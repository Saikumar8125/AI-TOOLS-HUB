/* AI Tools Hub · sfx.js v3.2 — optional UI sounds, off by default.
   The header Sound button ([data-sound-toggle]) turns them on/off and stores "1"/"0" in localStorage "aith-sound".
   Files come from /assets/sfx/ on this site and are fetched only once sound is on. Pages call window.AITHSfx.play(name).
   Delegated here: the "click" sound for primary action buttons (button.btn--primary, not the search submit). */
(function () {
  "use strict";
  var d = document, NAMES = ["click", "open", "add", "success"], cache = null, last = null, on = false;
  try { on = localStorage.getItem("aith-sound") === "1"; } catch (e) { /* storage blocked */ }

  function load() {
    if (cache) return;
    cache = {};
    NAMES.forEach(function (n) { var a = new Audio("/assets/sfx/" + n + ".mp3"); a.preload = "auto"; a.volume = 0.08; cache[n] = a; });
  }
  function play(name) {
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
  d.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-sound-toggle], button.btn--primary"); if (!t) return;
    if (t.hasAttribute("data-sound-toggle")) {
      on = !on;
      try { localStorage.setItem("aith-sound", on ? "1" : "0"); } catch (err) { /* storage blocked */ }
      paint();
      play("click"); // confirms sound is on; silent when turning off
    } else if (!t.closest('[role="search"]')) play("click");
  });
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", paint); else paint();
  if (on) load();
  window.AITHSfx = { play: play };
})();
