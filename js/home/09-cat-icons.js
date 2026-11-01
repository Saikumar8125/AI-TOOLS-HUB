/* Extracted verbatim from index.html inline <script id="x-lgl-js"> (Phase 1B). */
(function () {
  "use strict";
  var doc = document;
  function svg(p) { return '<svg class="x-neon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + p + "</svg>"; }

  var bento = doc.getElementById("bento");
  function deco() {
    if (!bento) return;
    var I = window.XCatIcons || {}, DEF = window.XCatIconDef || '<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>';
    var cards = bento.querySelectorAll(".x-cat"), names = [];
    if (!cards.length) return;
    [].forEach.call(cards, function (c) { var g = c.querySelector(".x-cat__go"); names.push(g ? g.getAttribute("data-go") || "" : ""); });
    [].forEach.call(cards, function (c, k) {
      if (c.querySelector(".x-clu, .x-cat__glyph")) return;
      var go = c.querySelector(".x-cat__go"); if (!go) return;
      var p = I[names[k]] || DEF;
      if (c.classList.contains("x-cat--lg")) {
        var a = I[names[(k + 2) % names.length]] || DEF, b = I[names[(k + 3) % names.length]] || DEF;
        var clu = doc.createElement("span"); clu.className = "x-clu"; clu.setAttribute("aria-hidden", "true");
        clu.innerHTML = '<span class="x-gi">' + svg(a) + '</span><span class="x-gi x-gi--lg">' + svg(p) + '</span><span class="x-gi">' + svg(b) + "</span>";
        c.appendChild(clu);
      } else {
        var gl = doc.createElement("span"); gl.className = "x-gi x-cat__glyph"; gl.setAttribute("aria-hidden", "true");
        gl.innerHTML = svg(p);
        c.insertBefore(gl, go);
      }
    });
  }
  deco();
  if (bento && "MutationObserver" in window) new MutationObserver(deco).observe(bento, { childList: true });

})();
