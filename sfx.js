/* AI Tools Hub · sfx.js v3.15 — optional UI sounds (off by default), light haptics on supporting phones + smooth <details> accordions.
   The header Sound button ([data-sound-toggle]) turns them on/off and stores "1"/"0" in localStorage "aith-sound".
   Files are /click.mp3, /open.mp3, /add.mp3, /success.mp3 at the site root and are fetched only once sound is on. Pages call window.AITHSfx.play(name).
   Delegated here (v3.14, one sound per kind of control): click = primary buttons, tap = other buttons, select = chips, switch = tabs and segmented controls,
   toggle = theme and sound buttons, expand/collapse = FAQ answers. home.js plays menu-open/menu-close for the mobile menu.
   A page sound played in the same click (add, open, success) wins: the delegated click stays quiet within 80ms of another sound. */
(function () {
  "use strict";
  var d = document, NAMES = ["click", "open", "add", "success", "tap", "select", "switch", "toggle", "menu-open", "menu-close", "expand", "collapse"], cache = null, last = null, lastT = 0, on = false;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function now() { return window.performance ? performance.now() : Date.now(); }
  try { on = localStorage.getItem("aith-sound") === "1"; } catch (e) { /* storage blocked */ }

  function load() {
    if (cache) return;
    cache = {};
    NAMES.forEach(function (n) { var a = new Audio("/" + n + ".mp3"); a.preload = "auto"; a.volume = 0.08; cache[n] = a; });
  }
  /* v3.15 haptics: a short vibration with each control sound, on phones that support it (Android Chrome, Samsung, Brave; iOS Safari has no Vibration API).
     Works even when sound is off. Nothing is stored. Pulses are 6-20 ms so they feel like a tap, not a buzz. */
  var BUZZ = { tap: 8, click: 12, select: 10, "switch": 8, toggle: 15, "menu-open": 10, "menu-close": 8, expand: 6, collapse: 6, open: 10, add: [10, 40, 14], success: [12, 50, 20] };
  var canBuzz = !!(navigator.vibrate) && window.matchMedia && matchMedia("(pointer: coarse)").matches;
  function buzz(name) {
    if (!canBuzz || d.hidden || !BUZZ[name]) return;
    try { navigator.vibrate(BUZZ[name]); } catch (e) { /* blocked: stay still */ }
  }
  function play(name) {
    buzz(name);
    lastT = now();
    if (!on || d.hidden || typeof Audio === "undefined") return;
    load();
    var a = cache[name]; if (!a) return;
    if (last && last !== a) last.pause(); // one sound at a time
    try { a.currentTime = 0; } catch (e) { /* not seekable yet */ }
    last = a;
    var p = a.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked or file missing: stay silent */ });
  }
  function paint() {
    [].forEach.call(d.querySelectorAll("[data-sound-toggle]"), function (b) { b.setAttribute("aria-pressed", String(on)); b.title = on ? "Sound on" : "Sound off"; });
  }
  /* v3.14: each kind of control has its own sound (all Kenney CC0, see SFX-LICENSES.md) */
  var MAP = [
    ["#theme, [data-theme-toggle]", "toggle"],
    ["button.btn--primary", "click"],
    ["button.chip", "select"],
    ['[role="tab"], .seg button', "switch"],
    ["button.btn, button.sbtn, button.tbtn, [data-search]", "tap"]
  ];
  var QUIET = '[role="search"] button[type="submit"], #burger, summary';
  d.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var t = e.target.closest("[data-sound-toggle]");
    if (t) {
      on = !on;
      try { localStorage.setItem("aith-sound", on ? "1" : "0"); } catch (err) { /* storage blocked */ }
      paint();
      if (on) play("toggle"); else buzz("toggle"); // sound confirms on; a tap confirms off
      return;
    }
    if (e.target.closest(QUIET)) return;
    for (var i = 0; i < MAP.length; i++) {
      t = e.target.closest(MAP[i][0]);
      if (t && !t.disabled) {
        var name = MAP[i][1], t0 = now();
        setTimeout(function () { if (lastT < t0) play(name); }, 0); // after page handlers, so their own sound (add, open, success) wins
        return;
      }
    }
  });

  /* ---------- FAQ accordions: height + content ease instead of snapping (v3.13) ---------- */
  var EASE = "cubic-bezier(.23, 1, .32, 1)";
  function body(det) { return [].filter.call(det.children, function (c) { return c.tagName !== "SUMMARY"; }); }
  function toggle(det, open) {
    var sum = det.querySelector("summary");
    var from = det.getBoundingClientRect().height; // measured before cancelling, so a reversed tap starts where it is
    if (det._a) { det._a.cancel(); det._a = null; }
    if (open) det.open = true;
    var to = open ? det.scrollHeight : sum.getBoundingClientRect().height;
    det.style.overflow = "hidden";
    var a = det.animate([{ height: from + "px" }, { height: to + "px" }], { duration: open ? 320 : 240, easing: EASE });
    body(det).forEach(function (c) {
      c.animate(open ? [{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "none" }] : [{ opacity: 1 }, { opacity: 0 }],
        { duration: open ? 280 : 160, delay: open ? 40 : 0, easing: open ? EASE : "ease-out", fill: "backwards" });
    });
    det._a = a;
    a.onfinish = function () { det._a = null; det.style.overflow = ""; if (!open) det.open = false; };
    a.oncancel = function () { det.style.overflow = ""; };
  }
  d.addEventListener("click", function (e) {
    var sum = e.target.closest && e.target.closest("details > summary"); if (!sum) return;
    var det = sum.parentNode, opening = !det.open || !!(det._a && det._closing);
    play(opening ? "expand" : "collapse");
    if (reduce || !det.animate) return; // native toggle, no motion
    e.preventDefault();
    det._closing = !opening;
    toggle(det, opening);
  });
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", paint); else paint();
  if (on) load();
  window.AITHSfx = { play: play };
})();
