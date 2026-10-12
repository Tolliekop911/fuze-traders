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

  // contact form -> opens mail client (address not shown on site)
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var g = function (id){ var el=document.getElementById(id); return el?el.value.trim():""; };
      var subject = "Fuze Traders enquiry — " + (g("type") || "General");
      var body = "Name: "+g("name")+"\nCompany: "+g("company")+"\nEmail: "+g("email")+"\nInterested in: "+g("type")+"\n\n"+g("msg");
      window.location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var note = document.getElementById("formNote");
      if (note) note.textContent = "Opening your email app — add our address and send, or we'll follow up shortly.";
    });
  }
})();
