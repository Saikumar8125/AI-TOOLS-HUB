/* Extracted verbatim from index.html inline <script> (Phase 1B). */
(function () {
  "use strict";
  var doc = document, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  function watch(el, cls, margin) {
    if (!el) return;
    if (!hasIO) { el.classList.add(cls); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle(cls, e.isIntersecting); }); }, { rootMargin: margin || "60px 0px" }).observe(el);
  }

  var logos = doc.getElementById("logos"), track = doc.getElementById("logos-track");
  if (logos && track && !reduce) {
    var set = track.querySelector(".x-logos__set");
    if (set) {
      var copy = set.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.appendChild(copy);
      logos.classList.add("is-loop");
      watch(logos, "is-vis");
    }
  }
  /* tap: colour one logo at a time on touch */
  if (logos) logos.addEventListener("click", function (e) {
    var it = e.target.closest(".x-tl"); if (!it) return;
    var was = it.classList.contains("is-on");
    [].forEach.call(logos.querySelectorAll(".x-tl.is-on"), function (n) { n.classList.remove("is-on"); });
    if (!was) it.classList.add("is-on");
  });

  var spot = doc.getElementById("spot");
  if (spot) {
    var size = function () {
      var w = spot.offsetWidth, h = spot.offsetHeight;
      if (w && h) spot.style.setProperty("--spot-d", Math.ceil(Math.sqrt(w * w + h * h)) + 2 + "px");
    };
    size();
    if ("ResizeObserver" in window) new ResizeObserver(size).observe(spot); else window.addEventListener("resize", size, { passive: true });
    if (!reduce) watch(spot, "is-vis", "0px");
  }

  if (!reduce && hasIO) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        sio.unobserve(e.target);
        e.target.classList.add("is-shine");
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.6 });
    [].forEach.call(doc.querySelectorAll("main .x-btn--solid"), function (b) { sio.observe(b); });
  }
})();
