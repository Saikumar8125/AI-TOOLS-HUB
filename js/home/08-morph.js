/* Extracted verbatim from index.html inline <script id="x-morph-js"> (Phase 1B). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, cv = doc.getElementById("bgfield"), modal = doc.getElementById("modal");
  var intro = doc.getElementById("intro"), mm = window.matchMedia, nav = navigator;
  var reduce = !!(mm && mm("(prefers-reduced-motion: reduce)").matches);
  var still = reduce || !!(nav.connection && nav.connection.saveData);
  var fine = !!(mm && mm("(hover: hover) and (pointer: fine)").matches);
  var coarse = !!(mm && mm("(pointer: coarse)").matches);
  if (intro) setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, reduce ? 0 : 1300);
  if (!cv) return;

  var gl = null, U = {}, N = 0, raf = 0, last = 0, run = false, lost = false, ready = false;
  var W = 1, H = 1, dpr = 1, phone = false, fps = 60, t = 0, sy = 0, rS = 0, vel = 0, maxS = 1;
  var A = [], w = [1, 0, 0, 0, 0, 0], c = [0, 0, 0, 0, 0, 0], tw = [0, 0, 0, 0, 0, 0], px = -9999, py = -9999, pon = 0, pT = 0;

  var MAP = [["#hero", 0], ["#stats", 2], ["#logos", 3], [".x-promo", 3], ["#guides", 4], ["#today", 4], ["#recommended", 1], ["#categories", 1],
    ["#how", 4], ["#browse", 1], ["#pick", 4], ["#tools", 1], ["#trending", 4], ["#faq", 4], ["#submit", 4], [".x-foot", 5]];
  var WARM = [1, 0.45, 0.8, 0.6, 0.1, 0.3];

  var VS = [
    "attribute vec4 aS;",
    "uniform vec2 uRes; uniform float uT, uDpr, uScr, uVel;",
    "uniform vec3 uW0, uW1, uC0, uC1, uP;",
    "varying float vA, vStr, vSp;",
    "void main() {",
    "  float d = aS.z, r = aS.w, asp = uRes.x / uRes.y, sp = 0.35 + 0.65 * d;",
    "  vec2 p = aS.xy;",
    /* ambient drift, always on */
    "  p += vec2(sin(uT * 0.11 * (0.6 + r) + r * 40.0) * 0.012 + uT * 0.003 * (r - 0.5), cos(uT * 0.09 * (0.6 + r) + r * 25.0) * 0.01 - uT * 0.002 * sp);",

    "  p.y -= uC0.x * 0.03 * sp;",
    "  p.y += uC1.y * 0.028 * sp;",
    "  p.x += sin(uT * 0.7 * (0.5 + r) + r * 30.0) * 0.006 * (uW0.x + uW1.y);",
    "  p.x += uC0.z * 0.022 * sp * (mod(floor(aS.y * 9.0), 2.0) * 2.0 - 1.0);",
    "  p.y -= uScr / uRes.y * (0.1 + 0.4 * d);",
    "  p = fract(p);",

    "  vec2 q = (p - 0.5) * vec2(asp, 1.0);",
    "  float R0 = 0.5 * min(asp, 1.0), rr = length(q), k = max(1.0 - rr / R0, 0.0);",
    "  float a = uC0.y * 0.32 * k * k + uC1.x * 0.1 * smoothstep(R0, R0 * 0.55, rr);",
    "  float cs = cos(a), sn = sin(a);",
    "  q = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);",
    "  q.y *= 1.0 - uW1.z * (0.16 + 0.04 * sin(uT * 0.4));",
    "  vec2 dv = q - (uP.xy / uRes.y - 0.5 * vec2(asp, 1.0)); float dl = length(dv);",
    "  q += dv / max(dl, 0.001) * uP.z * 0.05 * (0.5 + 0.5 * d) * smoothstep(0.15, 0.0, dl);",
    "  float st = 1.0 + min(abs(uVel) * 0.0011, 2.2) * (0.3 + 0.7 * d);",

    "  float spk = step(0.95, r), tw = 0.5 + 0.5 * sin(uT * (1.2 + 2.4 * r) + r * 60.0);",
    "  vSp = spk; vStr = st;",
    "  vA = min((0.45 + 0.45 * d) * (1.0 + spk * 0.25) * (1.0 - (0.15 * spk + 0.35 * uW1.z) * tw), 1.0) / sqrt(st);",
    "  gl_PointSize = min(1.4 + 2.6 * d * d + spk * 0.8, 4.0) * uDpr * 2.4 * st;",
    "  gl_Position = vec4(q.x * 2.0 / asp, -q.y * 2.0, 0.0, 1.0);",
    "}"
  ].join("\n");
  var FS = [
    "precision mediump float;",
    "uniform vec3 uCol, uSpk; uniform float uAl;",
    "varying float vA, vStr, vSp;",
    "void main() {",
    "  vec2 q = gl_PointCoord * 2.0 - 1.0; q.x *= vStr;",
    "  float r2 = dot(q, q); if (r2 > 1.0) discard;",
    "  float core = exp(-r2 * 16.0), a = min((exp(-r2 * 4.0) * 0.45 + core * 0.85) * vA * uAl, 1.0);",
    "  gl_FragColor = vec4(mix(uCol, uSpk, min(1.0, core * (0.25 + vSp))) * a, a);",
    "}"
  ].join("\n");

  function init() {
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS);
    if (!v || !f) return false;
    var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
    gl.useProgram(pr);
    ["uRes", "uT", "uDpr", "uScr", "uVel", "uW0", "uW1", "uC0", "uC1", "uP", "uCol", "uSpk", "uAl"].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });

    var n = Math.ceil(Math.sqrt(N)), rows = Math.ceil(N / n), D, i, o, R = Math.random;
    N = n * rows; D = new Float32Array(N * 4);
    for (i = 0; i < N; i++) {
      o = i * 4;
      D[o] = ((i % n) + R()) / n; D[o + 1] = (Math.floor(i / n) + R()) / rows;
      D[o + 2] = Math.pow(R(), 1.7); D[o + 3] = R();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, D, gl.STATIC_DRAW);
    var la = gl.getAttribLocation(pr, "aS");
    if (la >= 0) { gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 4, gl.FLOAT, false, 16, 0); }
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    return true;
  }

  function ss(a, b, x) { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); }
  /* layout reads only here */
  function measure() {
    W = cv.clientWidth || window.innerWidth || 1; H = cv.clientHeight || window.innerHeight || 1;
    phone = W < 768 || coarse; fps = phone ? 30 : 60;
    if (!N) N = phone ? 1800 : 4000;
    sy = window.scrollY || 0;
    maxS = Math.max(1, root.scrollHeight - (window.innerHeight || H));
    A = [];
    MAP.forEach(function (m) {
      var el = doc.querySelector(m[0]), r = el && el.getBoundingClientRect();
      if (r && r.height) A.push({ y: r.top + sy, m: m[1] });
    });
    A.sort(function (a, b) { return a.y - b.y; });
    dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2);
    var bw = Math.round(W * dpr), bh = Math.round(H * dpr);
    if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
    if (gl) gl.viewport(0, 0, bw, bh);
  }

  function targ() {
    var vh = window.innerHeight || H, cc = sy + vh * 0.5 + vh * 0.45 * ss(maxS - vh, maxS, sy), i, s, nx, tot = 0;
    for (i = 0; i < 6; i++) tw[i] = 0;
    for (i = 0; i < A.length; i++) {
      s = i ? ss(A[i].y - vh * 0.3, A[i].y + vh * 0.3, cc) : 1;
      nx = i + 1 < A.length ? ss(A[i + 1].y - vh * 0.3, A[i + 1].y + vh * 0.3, cc) : 0;
      tw[A[i].m] += Math.max(0, s - nx);
    }
    for (i = 0; i < 6; i++) tot += tw[i];
    if (tot < 0.001) { tw[0] = 1; tot = 1; }
    for (i = 0; i < 6; i++) tw[i] /= tot;
  }
  function step(dt) {
    var k = 1 - Math.pow(0.9, dt * 60), kw = 1 - Math.pow(0.965, dt * 60), prev, i;
    if (Math.abs(sy - rS) > H * 3) rS = sy - (sy > rS ? 1 : -1) * H * 3;
    prev = rS; rS += (sy - rS) * k;
    vel += ((rS - prev) / Math.max(dt, 0.001) - vel) * k;
    targ();
    for (i = 0; i < 6; i++) { w[i] += (tw[i] - w[i]) * kw; c[i] += dt * w[i]; }
    pon += (pT - pon) * k;
  }
  function draw() {
    if (!gl || lost || gl.isContextLost()) return;
    var light = root.getAttribute("data-theme") === "light", wm = 0, i;
    for (i = 0; i < 6; i++) wm += w[i] * WARM[i];
    wm = (wm - 0.5) * 0.06;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uRes, W, H); gl.uniform1f(U.uT, t); gl.uniform1f(U.uDpr, dpr);
    gl.uniform1f(U.uScr, rS); gl.uniform1f(U.uVel, vel);
    gl.uniform3f(U.uW0, w[0], w[1], w[2]); gl.uniform3f(U.uW1, w[3], w[4], w[5]);
    gl.uniform3f(U.uC0, c[0], c[1], c[2]); gl.uniform3f(U.uC1, c[3], c[4], c[5]);
    gl.uniform3f(U.uP, px, py, fine ? pon : 0);
    if (light) {

      gl.uniform3f(U.uCol, 0.541, 0.427 - wm * 0.5, 0.184 - wm);
      gl.uniform3f(U.uSpk, 0.65, 0.506, 0.184); gl.uniform1f(U.uAl, 0.9);
    } else {
      /* champagne gold #f0dca8, white-gold sparkles */
      gl.uniform3f(U.uCol, 0.941, 0.863 - wm * 0.5, 0.659 - wm);
      gl.uniform3f(U.uSpk, 1, 0.97, 0.88); gl.uniform1f(U.uAl, 1);
    }
    gl.drawArrays(gl.POINTS, 0, N);
    cv.classList.add("is-on");
  }

  function paused() {
    return lost || doc.hidden || root.classList.contains("x-lock") || root.classList.contains("is-menu") || root.classList.contains("x-hs-on") || !!(modal && !modal.hidden && !modal.classList.contains("is-closing"));
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < 1000 / fps - 2) return;
    var dt = Math.min((now - last) / 1000, 0.1); last = now;
    t += dt; step(dt);
    draw();
  }
  function start() { if (!ready || run || still || paused()) return; run = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stop() { run = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
  function sync() { if (paused()) stop(); else start(); }
  function hide() { stop(); gl = null; cv.style.display = "none"; }
  window.XField = { pause: stop };

  function go() {
    try {
      measure();
      gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
      if (!gl || !init()) return hide();
      cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); lost = true; stop(); }, false);
      measure(); rS = sy; targ(); w = tw.slice(); ready = true;
      draw(); sync();
    } catch (err) { hide(); }
  }

  window.addEventListener("scroll", function () { sy = window.scrollY || 0; }, { passive: true });
  if (fine && !still) {
    window.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") { px = e.clientX; py = e.clientY; pT = 1; } }, { passive: true });
    doc.addEventListener("mouseout", function (e) { if (!e.relatedTarget) pT = 0; });
    window.addEventListener("blur", function () { pT = 0; });
  }
  doc.addEventListener("visibilitychange", sync);
  new MutationObserver(function () { if (ready && !run) draw(); sync(); }).observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
  if (modal) new MutationObserver(sync).observe(modal, { attributes: true, attributeFilter: ["hidden", "class"] });
  var rzT = 0;
  function onResize() { clearTimeout(rzT); rzT = setTimeout(function () { if (ready) { measure(); if (!run) draw(); } }, 150); }
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize);
  var main = doc.querySelector("main");
  if (main && "ResizeObserver" in window) new ResizeObserver(onResize).observe(main);
  requestAnimationFrame(function () { setTimeout(go, 0); });
})();
