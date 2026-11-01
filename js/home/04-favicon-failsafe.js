/* Extracted verbatim from index.html inline <script> (Phase 1B). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function mark(img) { img.classList.add("is-ld"); }
  doc.addEventListener("load", function (e) { var t = e.target; if (t && t.tagName === "IMG") mark(t); }, true);
  doc.addEventListener("error", function (e) { var t = e.target; if (t && t.tagName === "IMG") mark(t); }, true);
  [].forEach.call(doc.querySelectorAll(".x-fav img"), function (img) { if (img.complete) mark(img); });
  root.classList.add("x-imgfade");
  /* failsafe: never leave a logo invisible */
  setTimeout(function () { [].forEach.call(doc.querySelectorAll(".x-fav img:not(.is-ld)"), function (img) { if (img.complete) mark(img); }); }, 3000);

  function indicator(group) {
    if (!group) return;
    var cur = null, last = null, raf = 0;
    group.classList.add("has-ind");
    function place(animate) {
      var b = group.querySelector('button[aria-pressed="true"]');
      if (!b || !b.offsetWidth) { group.classList.remove("is-ready"); cur = null; last = null; return; }
      var box = { x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight };
      var moved = animate && last && cur && cur !== b && group.classList.contains("is-ready");
      var s = group.style;
      group.classList.add("is-snap");
      s.setProperty("--iw", box.w + "px"); s.setProperty("--ih", box.h + "px");
      if (moved) {
        s.setProperty("--ix", last.x + "px"); s.setProperty("--iy", last.y + "px"); s.setProperty("--isx", last.w / box.w);
        void group.offsetWidth;
        group.classList.remove("is-snap");
        s.setProperty("--ix", box.x + "px"); s.setProperty("--iy", box.y + "px"); s.setProperty("--isx", 1);
      } else {
        s.setProperty("--ix", box.x + "px"); s.setProperty("--iy", box.y + "px"); s.setProperty("--isx", 1);
        void group.offsetWidth;
        group.classList.remove("is-snap");
      }
      group.classList.add("is-ready");
      cur = b; last = box;
    }
    function sched(animate) { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { place(animate); }); }
    new MutationObserver(function (ms) {
      var b = group.querySelector('button[aria-pressed="true"]');
      var childs = ms.some(function (m) { return m.type === "childList"; });
      if (childs) { cur = null; last = null; group.classList.remove("is-ready"); sched(false); }
      else if (b !== cur) sched(true);
    }).observe(group, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-pressed"] });
    if ("ResizeObserver" in window) new ResizeObserver(function () { sched(false); }).observe(group);
    window.addEventListener("resize", function () { sched(false); }, { passive: true });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { sched(false); });
    sched(false);
  }
  indicator(doc.getElementById("price"));
  indicator(doc.getElementById("cat-pills"));
})();
