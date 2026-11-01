/* Extracted verbatim from index.html inline <script> (Phase 1B). */
(function () {
  "use strict";
  var doc = document;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  var h2s = [].slice.call(doc.querySelectorAll(".x-head .x-h2"));
  var eyes = [].slice.call(doc.querySelectorAll(".x-head .x-idx, .x-eyebrow"));
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add("is-tw");
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

  function split(h) {
    var orig = h.innerHTML, n = 0;
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    function walk(node, out) {
      [].slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          c.nodeValue.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { out.appendChild(doc.createTextNode(" ")); return; }
            var w = doc.createElement("span"); w.className = "x-w";
            for (var k = 0; k < p.length; k++) { var s = doc.createElement("span"); s.className = "x-ch"; s.style.setProperty("--i", n++); s.textContent = p[k]; w.appendChild(s); }
            out.appendChild(w);
          });
        } else if (c.nodeType === 1) { var cl = c.cloneNode(false); cl.removeAttribute("id"); walk(c, cl); out.appendChild(cl); }
      });
    }
    var wrap = doc.createElement("span"); wrap.setAttribute("aria-hidden", "true"); walk(h, wrap);
    h.textContent = ""; h.appendChild(wrap); h.classList.add("x-split");
    h._xs = { orig: orig, n: n };
  }
  var hio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var h = e.target; hio.unobserve(h); h.classList.add("is-in");
      setTimeout(function () { h.innerHTML = h._xs.orig; h.removeAttribute("aria-label"); }, h._xs.n * 24 + 900);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  h2s.forEach(function (el) { split(el); hio.observe(el); });
  eyes.forEach(function (el) { el.classList.add("x-ls"); io.observe(el); });
})();
