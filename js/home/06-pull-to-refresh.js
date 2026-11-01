/* Extracted verbatim from index.html inline <script> (Phase 1B). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, el = doc.getElementById("ptr");
  if (!el) return;
  var touchDev = root.classList.contains("x-touch") || (("ontouchstart" in window) && (navigator.maxTouchPoints || 0) > 0);
  if (!touchDev) return;
  var arc = el.querySelector(".x-ptr__arc");
  var content = [doc.querySelector("main"), doc.querySelector(".x-foot")].filter(Boolean);
  var mqR = window.matchMedia("(prefers-reduced-motion: reduce)");

  var TH = 50, SLOP = 8, MAXD = 160, START = -40, REST = 56, SHIFT = 24, TRAVEL = 1.3;
  var SKIP = ".x-modal, .x-drawer, .x-menu, .x-hs, .x-cbar, .x-fabs, .x-cc__vp, .x-pills, .x-simrow, .x-marquee, .x-cmp__cols, input, textarea, select, [contenteditable], [data-no-ptr]";
  var s = null, d = 0, ready = false, busy = false, raf = 0, backT = 0;

  function atTop() { return (window.scrollY || root.scrollTop || 0) <= 0; }
  function blocked(t) {
    if (busy || root.classList.contains("x-lock") || root.classList.contains("is-menu") || root.classList.contains("x-hs-on")) return true;
    var m = doc.getElementById("modal");
    if ((m && !m.hidden) || doc.querySelector(".x-drawer.is-open")) return true;
    for (var n = t && t.nodeType === 1 ? t : t && t.parentElement; n && n !== doc.body && n !== root; n = n.parentElement) {
      if (n.matches && n.matches(SKIP)) return true;
      if (n.scrollWidth > n.clientWidth + 1) {
        var ox = getComputedStyle(n).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
      }
    }
    return false;
  }

  function band(pull) { var raw = Math.max(0, pull); return MAXD * (1 - Math.exp(-raw / MAXD)); }
  function tY(y) { return "translate3d(-50%," + y.toFixed(1) + "px,0)"; }
  function setContent(fn) { for (var i = 0; i < content.length; i++) fn(content[i]); }
  function setReady(r) {
    if (r === ready) return;
    ready = r; el.classList.toggle("is-ready", r);
    /* a tiny tick, once per crossing */
    if (r && typeof navigator.vibrate === "function" && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) { try { navigator.vibrate(8); } catch (e) { /* ignore */ } }
  }
  function paint() {
    raf = 0;
    if (!s || !s.on) return;
    var rm = mqR.matches, p = Math.min(1, d / TH);
    if (s.fresh) {
      s.fresh = false;
      el.classList.remove("is-back", "is-settle", "is-loading");
      el.classList.add("is-on");
      if (!rm) setContent(function (c) { c.classList.remove("is-spring", "is-settle"); c.classList.add("x-ptr-c"); });
    }
    el.style.transform = tY(rm ? REST : START + d * TRAVEL);
    el.style.opacity = (rm ? p : Math.min(1, d / 28)).toFixed(3);
    arc.style.strokeDashoffset = (100 - p * 100).toFixed(2);
    arc.style.opacity = p > 0.01 ? "1" : "0";
    if (!rm) {
      var cy = (SHIFT * (1 - Math.exp(-d / 50))).toFixed(1);
      setContent(function (c) { c.style.transform = "translate3d(0," + cy + "px,0)"; });
    }
    setReady(d >= TH);
  }
  function cleanContent() { setContent(function (c) { c.classList.remove("x-ptr-c", "is-spring", "is-settle"); c.style.transform = ""; c.style.opacity = ""; }); }
  function back() {
    s = null; d = 0;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    clearTimeout(backT);
    requestAnimationFrame(function () {
      if ((s && s.on) || busy) return;
      var rm = mqR.matches;
      el.classList.remove("is-settle");
      el.classList.add("is-back");
      el.style.transform = rm ? tY(REST) : "";
      el.style.opacity = "";
      setReady(false);
      if (!rm) setContent(function (c) { if (c.classList.contains("x-ptr-c")) { c.classList.add("is-spring"); c.style.transform = "translate3d(0,0,0)"; } });
      backT = setTimeout(function () {
        requestAnimationFrame(function () {
          if ((s && s.on) || busy) return;
          el.classList.remove("is-on", "is-back");
          el.style.transform = ""; arc.style.strokeDashoffset = ""; arc.style.opacity = "";
          cleanContent();
        });
      }, 330);
    });
  }
  function refresh() {
    busy = true; s = null;
    clearTimeout(backT);
    var rm = mqR.matches;
    requestAnimationFrame(function () {
      el.classList.remove("is-back");
      el.classList.add("is-on", "is-settle", "is-loading");
      el.style.transform = tY(REST);
      el.style.opacity = "1";

      arc.style.opacity = "1";
      arc.style.strokeDashoffset = rm ? "0" : "72";
      setContent(function (c) {
        c.classList.remove("is-spring"); c.classList.add("x-ptr-c", "is-settle");
        if (!rm) c.style.transform = "translate3d(0," + (SHIFT * 0.75).toFixed(1) + "px,0)";
      });
    });
    setTimeout(function () {
      requestAnimationFrame(function () { setContent(function (c) { c.style.opacity = "0.55"; }); });
      setTimeout(function () { location.reload(); }, 180);
    }, rm ? 250 : 400);
  }

  doc.addEventListener("touchstart", function (e) {
    s = null;
    if (e.touches.length !== 1 || !atTop() || blocked(e.target)) return;
    var p = e.touches[0];
    s = { x: p.clientX, y: p.clientY, on: false };
  }, { passive: true });
  doc.addEventListener("touchmove", function (e) {
    if (!s) return;
    if (e.touches.length !== 1) { if (s.on) back(); else s = null; return; }
    var p = e.touches[0], dy = p.clientY - s.y, dx = p.clientX - s.x;
    if (!s.on) {

      if ((Math.abs(dx) > SLOP && Math.abs(dx) > Math.abs(dy)) || dy < -SLOP || !atTop()) { s = null; return; }
      if (dy < SLOP) return;
      s.on = true; s.fresh = true;
      clearTimeout(backT);
    }
    if (!atTop()) { back(); return; }
    d = band(dy - SLOP);
    if (!raf) raf = requestAnimationFrame(paint);
  }, { passive: true });
  function end(cancel) {
    if (!s) return;
    if (!s.on) { s = null; return; }
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!cancel && d >= TH && atTop()) refresh(); else back();
  }
  doc.addEventListener("touchend", function (e) { if (!e.touches.length) end(false); }, { passive: true });
  doc.addEventListener("touchcancel", function () { end(true); }, { passive: true });

  window.addEventListener("pageshow", function () {
    busy = false; s = null; d = 0; ready = false; clearTimeout(backT);
    el.className = "x-ptr"; el.style.transform = ""; el.style.opacity = "";
    arc.style.strokeDashoffset = ""; arc.style.opacity = "";
    cleanContent();
  });
})();
