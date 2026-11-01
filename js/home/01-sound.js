/* Extracted verbatim from index.html inline <script> (Phase 1B). */
(function () {
  "use strict";
  var doc = document, ctx = null, out = null, noiseBuf = null, on = true, last = 0, ptr = "", pend = null, quietOpen = 0;
  var AC = window.AudioContext || window.webkitAudioContext;
  var android = /Android/i.test(navigator.userAgent) && typeof navigator.vibrate === "function";
  function ensure() {
    if (!on || !AC) return null;
    if (!ctx) {
      try {
        ctx = new AC();

        out = ctx.createGain(); out.gain.value = 1;
        var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 6000; lp.Q.value = 0.5;
        out.connect(lp); lp.connect(ctx.destination);
      } catch (e) { AC = null; ctx = null; return null; }
    }
    if (ctx.state === "suspended" && !doc.hidden) wake();
    return ctx;
  }
  function ready() {
    if (!on || doc.hidden || !ctx || ctx.state === "closed") return false;
    var t = performance.now();
    if (t - last < 60) return false;
    last = t;
    if (ctx.state === "suspended") wake();
    return true;
  }

  function wake() { try { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* ignore */ } }
  function sleep() { try { var p = ctx.suspend(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* ignore */ } }

  function tone(type, f0, f1, vol, dur, at) {
    var t = ctx.currentTime + (at || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function knock(freq, q, vol, dur) {

    if (!noiseBuf) {
      var n = Math.ceil(ctx.sampleRate * 0.1); noiseBuf = ctx.createBuffer(1, n, ctx.sampleRate);
      var nd = noiseBuf.getChannelData(0); for (var k = 0; k < n; k++) nd[k] = Math.random() * 2 - 1;
    }
    var t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(out);
    s.start(t); s.stop(t + dur + 0.01);
  }
  function buzz() { if (android && ptr === "touch") { try { navigator.vibrate(8); } catch (e) { /* ignore */ } } }
  /* the voices; each is called only through play() */
  var V = {
    tap: function () { tone("triangle", 1200, 0, 0.03, 0.018); },
    select: function () { knock(1800, 4, 0.05, 0.025); },

    open: function () { V.toggleOn(); },

    close: function () { tone("sine", 990, 660, 0.035, 0.06); tone("triangle", 1320, 0, 0.02, 0.03, 0.05); },
    favOn: function () { tone("sine", 420, 760, 0.03, 0.07); tone("sine", 1568, 0, 0.03, 0.06, 0.05); },
    favOff: function () { tone("sine", 600, 380, 0.03, 0.07); },
    theme: function () { tone("triangle", 1800, 0, 0.03, 0.015); tone("triangle", 1200, 0, 0.03, 0.015, 0.04); },
    launch: function () { tone("sine", 660, 1320, 0.035, 0.11); },
    success: function () { tone("sine", 880, 0, 0.025, 0.32); tone("sine", 1318.5, 0, 0.0225, 0.42, 0.09); },
    error: function () { tone("triangle", 220, 0, 0.03, 0.04); tone("triangle", 220, 0, 0.03, 0.04, 0.06); },
    shuffle: function () { tone("triangle", 900, 0, 0.03, 0.02); tone("triangle", 1100, 0, 0.03, 0.02, 0.02); tone("triangle", 1300, 0, 0.03, 0.02, 0.04); },
    toggleOn: function () { tone("sine", 660, 990, 0.035, 0.06); tone("triangle", 1320, 0, 0.02, 0.03, 0.05); }
  };
  function fire(name) { if (!V[name] || !ready()) return; try { V[name](); buzz(); } catch (e) { /* ignore */ } }

  function play(name) {
    if (!on || !V[name]) return;
    if (name === "open" && performance.now() < quietOpen) return;
    clearTimeout(pend);
    pend = setTimeout(function () { pend = null; fire(name); }, 0);
  }
  var S = { play: play, get on() { return on; } };
  Object.keys(V).forEach(function (k) { S[k] = function () { play(k); }; });

  S.shuffleThenOpen = function () { play("shuffle"); quietOpen = performance.now() + 700; };
  window.XSound = S;

  function soon() { if (ctx) ensure(); else setTimeout(ensure, 0); }

  doc.addEventListener("pointerdown", function (e) { ptr = e.pointerType || ""; if (ptr !== "touch") soon(); }, { passive: true, capture: true });
  doc.addEventListener("pointerup", function (e) { if (e.pointerType === "touch") soon(); }, { passive: true, capture: true });

  doc.addEventListener("touchend", function () { if (ctx) ensure(); }, { passive: true, capture: true });
  doc.addEventListener("click", soon, true);
  doc.addEventListener("keydown", function (e) { ptr = "key"; if (e.key === "Enter" || e.key === " " || e.key === "Escape") ensure(); }, true);
  doc.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (doc.hidden) sleep(); else if (on) wake();
  });

  var btn = doc.getElementById("snd");
  function paint() {
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Sound on" : "Sound off");
    btn.title = on ? "Sound on" : "Sound off";
  }
  if (btn) {
    paint();
    btn.addEventListener("click", function () {
      on = !on; paint(); clearTimeout(pend); pend = null;
      if (on) { ensure(); last = 0; fire("toggleOn"); }
    });
  }

  var TAP = 'button, a[href], .x-chip, .x-card, .x-opt, [role="button"], [role="tab"], summary';
  var HOOKED = '[data-i], [data-sv-open], [data-close], [data-sv-close], [data-cmp-close], #saved-btn, #cbar-go, #surprise, #sub-copy, #sub-form [type="submit"]';
  var SELECT = '.x-chip, .x-cc__card, .x-cat__go, .x-cat, .x-seg button, .x-opt, [data-swap], [role="tab"]';
  function pick(el) {
    var o = el.getAttribute("data-snd");
    if (o) return o;
    if (el.matches(HOOKED)) return "none";

    if (el.closest("[data-i], [data-close]") && !el.matches("[data-fav], [data-cmp], [data-sv-rm]")) return "none";
    if (el.id === "theme") return "theme";
    if (el.id === "totd-shuffle") return "shuffle";
    if (el.id === "burger") return root.classList.contains("is-menu") ? "close" : "open";
    if (el.matches("[data-fav], [data-cmp]")) return el.getAttribute("aria-pressed") === "true" ? "favOff" : "favOn";
    if (el.matches("[data-sv-rm]")) return "favOff";
    if (el.matches("a[href]") && /^https?:/i.test(el.getAttribute("href") || "") && /^\s*Visit\b/i.test(el.textContent || "")) return "launch";
    if (el.matches(SELECT)) return "select";
    return "tap";
  }
  var root = doc.documentElement;
  doc.addEventListener("click", function (e) {
    if (!on) return;
    var el = e.target.closest && e.target.closest(TAP);
    if (!el || el.id === "snd" || el.disabled) return;
    play(pick(el));
  }, true);
})();
