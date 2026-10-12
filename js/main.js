// Fuze Traders — nav, reveal-on-scroll, year, contact form -> mailto
(function () {
  var EMAIL = "ptsnmn@gmail.com";

  // year
  document.querySelectorAll("#yr").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // sticky nav shadow
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  // mobile menu
  var burger = document.getElementById("burger");
  var links = document.getElementById("navlinks");
  if (burger && links) {
    burger.addEventListener("click", function () { links.classList.toggle("open"); });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // contact form -> mailto (no backend)
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var g = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var subject = "Fuze Traders enquiry — " + (g("type") || "General");
      var body =
        "Name: " + g("name") + "\n" +
        "Company: " + g("company") + "\n" +
        "Email: " + g("email") + "\n" +
        "Interested in: " + g("type") + "\n\n" +
        g("msg");
      window.location.href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      var note = document.getElementById("formNote");
      if (note) note.textContent = "Opening your email app… if nothing happens, email us at " + EMAIL;
    });
  }
})();
