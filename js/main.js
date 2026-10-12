// Fuze Traders — terminal UI: ticker, live lead feed, payout spark, nav, form
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("#yr").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // sticky nav
  var nav = document.getElementById("nav");
  if (nav) { var s = function(){ nav.classList.toggle("scrolled", scrollY > 6); }; s(); addEventListener("scroll", s, {passive:true}); }

  // mobile menu
  var burger = document.getElementById("burger"), links = document.getElementById("navlinks");
  if (burger && links) {
    burger.addEventListener("click", function(){ links.classList.toggle("open"); });
    links.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ links.classList.remove("open"); }); });
  }

  // reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }); }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    reveals.forEach(function(el){ io.observe(el); });
  } else { reveals.forEach(function(el){ el.classList.add("in"); }); }

  // ticker content (duplicated for seamless loop)
  var tk = document.getElementById("ticker");
  if (tk) {
    var items = [
      ["GEO: UK", "▲", "up"], ["GEO: ZA", "▲", "up"], ["GEO: DE", "▲", "up"], ["GEO: AU", "●", ""],
      ["CPA", "▼ optimising", "up"], ["HOT TRANSFERS", "LIVE", "up"], ["FILL RATE", "98.4%", ""],
      ["INTENT AVG", "82", ""], ["DUPES", "0 passed", ""], ["GEO: AE", "▲", "up"], ["GEO: CA", "▲", "up"], ["UPTIME", "100%", ""]
    ];
    var html = items.map(function (it) {
      return '<span class="ti"><b>' + it[0] + '</b> <span class="ar ' + (it[2]==="up"?"up":"") + '">' + it[1] + '</span></span>';
    }).join("");
    tk.innerHTML = html + html; // two copies -> -50% loop
  }

  // payout spark bars
  var sp = document.getElementById("spark");
  if (sp) {
    var vals = [34,41,38,52,47,63,58,71,66,80,88,100];
    sp.innerHTML = vals.map(function(v){ return '<i style="height:'+v+'%"></i>'; }).join("");
  }

  // live lead feed
  var feed = document.getElementById("feed"), cnt = document.getElementById("cnt");
  if (feed) {
    var GEO = ["UK","DE","ZA","AU","AE","CA","ES","IT","PL","NL","SE","CH"];
    var pad = function(n){ return n<10 ? "0"+n : ""+n; };
    var count = 3184 + Math.floor(Math.random()*60);
    var make = function () {
      var d = new Date();
      var ts = pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds());
      var geo = GEO[Math.floor(Math.random()*GEO.length)];
      var score = 72 + Math.floor(Math.random()*27);
      var row = document.createElement("div");
      row.className = "feed-row";
      row.innerHTML =
        '<span class="ts">'+ts+'</span>' +
        '<span class="geo">'+geo+'</span>' +
        '<span class="score">'+score+' <span class="bar"><i style="width:'+score+'%"></i></span></span>' +
        '<span class="rt">ROUTED →</span>';
      feed.insertBefore(row, feed.firstChild);
      while (feed.children.length > 7) feed.removeChild(feed.lastChild);
      count++; if (cnt) cnt.textContent = count.toLocaleString();
    };
    for (var i = 0; i < 7; i++) make();        // fill on load
    if (!reduce) setInterval(make, 1900);      // stream
  }

  // live depositor-flow chart (candles + trend line, streaming)
  var chart = document.getElementById("depChart");
  if (chart) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 440, H = 200, TOP = 16, BOT = 16, N = 14;
    var slot = W / N, bw = slot * 0.44, plotH = H - TOP - BOT;
    var depDelta = document.getElementById("depDelta");
    var el = function (t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); return e; };
    var y = function (p) { return TOP + (1 - p / 100) * plotH; };
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

    // seed with a gentle uptrend
    var candles = [], price = 26;
    for (var i = 0; i < N; i++) {
      var o = price, c = clamp(o + 1.3 + (Math.random() - 0.45) * 8, 12, 92);
      candles.push({ o: o, c: c, h: Math.max(o, c) + Math.random() * 4, l: Math.min(o, c) - Math.random() * 4 });
      price = c;
    }

    // static grid
    var grid = el("g", {});
    [0.25, 0.5, 0.75].forEach(function (f) {
      grid.appendChild(el("line", { x1: 0, y1: TOP + f * plotH, x2: W, y2: TOP + f * plotH, stroke: "rgba(255,255,255,.055)", "stroke-width": 1 }));
    });

    var defs = el("defs", {});
    defs.innerHTML = '<linearGradient id="af" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5A00" stop-opacity=".40"/><stop offset="1" stop-color="#FF5A00" stop-opacity="0"/></linearGradient>';

    function render() {
      chart.innerHTML = "";
      chart.appendChild(defs);
      chart.appendChild(grid);
      // candles
      candles.forEach(function (d, i) {
        var cx = slot * (i + 0.5), up = d.c >= d.o, col = up ? "#28C76F" : "#F0556B";
        chart.appendChild(el("line", { class: "wick", x1: cx, y1: y(d.h), x2: cx, y2: y(d.l), stroke: col, opacity: 0.55 }));
        var top = y(Math.max(d.o, d.c)), h = Math.max(2, Math.abs(y(d.o) - y(d.c)));
        chart.appendChild(el("rect", { class: "cbody", x: cx - bw / 2, y: top, width: bw, height: h, rx: 1, fill: col, opacity: 0.5 }));
      });
      // area + trend line through closes
      var pts = candles.map(function (d, i) { return [slot * (i + 0.5), y(d.c)]; });
      var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
      var area = line + " L" + pts[pts.length - 1][0].toFixed(1) + " " + H + " L" + pts[0][0].toFixed(1) + " " + H + " Z";
      chart.appendChild(el("path", { class: "flowarea", d: area, fill: "url(#af)" }));
      chart.appendChild(el("path", { class: "flowline", d: line }));
      var last = pts[pts.length - 1];
      chart.appendChild(el("circle", { class: "tip", cx: last[0], cy: last[1], r: 4, fill: "#FF5A00" }));
      // delta
      if (depDelta) {
        var pct = ((candles[N - 1].c - candles[0].c) / candles[0].c * 100);
        var upd = pct >= 0;
        depDelta.textContent = (upd ? "▲ +" : "▼ ") + Math.abs(pct).toFixed(1) + "%";
        depDelta.style.color = upd ? "var(--up)" : "var(--down)";
      }
    }
    render();
    if (!reduce) setInterval(function () {
      var o = candles[N - 1].c;
      var c = clamp(o + 0.9 + (Math.random() - 0.42) * 10, 12, 94);
      candles.push({ o: o, c: c, h: Math.max(o, c) + Math.random() * 4, l: Math.min(o, c) - Math.random() * 4 });
      candles.shift();
      render();
    }, 1600);
  }

  // contact form -> opens Gmail compose addressed to Fuze
  var FUZE_EMAIL = "Brian.Griffin@fuzetraders.com";
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var g = function (id){ var el=document.getElementById(id); return el?el.value.trim():""; };
      var subject = "Fuze Traders enquiry — " + (g("type") || "General");
      var body = "Name: "+g("name")+"\nCompany: "+g("company")+"\nEmail: "+g("email")+"\nInterested in: "+g("type")+"\n\n"+g("msg");
      var url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(FUZE_EMAIL) +
                "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      window.open(url, "_blank", "noopener");
      var note = document.getElementById("formNote");
      if (note) note.textContent = "Opening Gmail… if it doesn't appear, email us at " + FUZE_EMAIL;
    });
  }
})();
