/* AI Tools Hub · pages.js: search palette, guide progress bar, table-of-contents highlight (static pages only) */
(function () {
  "use strict";
  var d = document, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* reading progress (guides) */
  var bar = d.querySelector(".progress i");
  if (bar) {
    var tick = function () {
      var h = d.documentElement, m = h.scrollHeight - h.clientHeight;
      bar.style.transform = "scaleX(" + (m > 0 ? Math.min(1, h.scrollTop / m) : 0) + ")";
    };
    addEventListener("scroll", tick, { passive: true }); tick();
  }

  /* table of contents: highlight the section being read */
  var toc = d.querySelector(".toc"), links = toc ? [].slice.call(toc.querySelectorAll("a")) : [];
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = byId[e.target.id];
        if (!e.isIntersecting || !a) return;
        links.forEach(function (l) { l.classList.remove("on"); });
        a.classList.add("on");
        toc.scrollTo({ left: a.offsetLeft - toc.clientWidth / 2 + a.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    Object.keys(byId).forEach(function (id) { var el = d.getElementById(id); if (el) io.observe(el); });
  }

  /* search palette: press / or Ctrl/Cmd+K, or tap the search button */
  var idx = null, loading = null, dlg, input, list, items = [], sel = 0, opener = null;
  var load = function () {
    return loading || (loading = fetch("/search-index.json").then(function (r) { return r.json(); }).then(function (j) { idx = j; }).catch(function () { idx = []; }));
  };
  var KIND = { tool: "Tool", guide: "Guide", category: "Category" };
  function render() {
    list.innerHTML = items.map(function (r, i) {
      return '<li role="option" id="pal' + i + '" aria-selected="' + (i === sel) + '"><a href="' + esc(r[2]) + '"><span class="pal__n">' + esc(r[1]) + '</span><span class="pal__m">' + esc(KIND[r[0]]) + (r[3] && r[0] === "tool" ? " · " + esc(r[3]) : "") + (r[4] ? " · " + esc(r[4]) : "") + '</span>' + (r[5] ? '<span class="pal__d">' + esc(r[5]) + "</span>" : "") + "</a></li>";
    }).join("") || '<li class="pal__empty">No match. Try "invoice", "WhatsApp" or "video".</li>';
    input.setAttribute("aria-activedescendant", items.length ? "pal" + sel : "");
    var cur = list.children[sel]; if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (!idx) return;
    if (!q) { items = idx.filter(function (r) { return r[0] === "guide"; }).slice(0, 6); sel = 0; return render(); }
    var tokens = q.split(/\s+/), out = [];
    function run(all) {
      idx.forEach(function (r) {
        var name = r[1].toLowerCase(), nw = " " + name.replace(/[^a-z0-9]+/g, " "), hay = nw + " " + ((r[3] || "") + " " + (r[5] || "")).toLowerCase().replace(/[^a-z0-9]+/g, " "), s = 0, hit = 0;
        for (var i = 0; i < tokens.length; i++) { /* match at the start of a word, so "gst" does not match "SongStarter" */
          var t = " " + tokens[i].replace(/[^a-z0-9]+/g, "");
          if (t.length < 2 || hay.indexOf(t) < 0) { if (all) return; continue; }
          hit++; s += nw.indexOf(t) === 0 ? 30 : nw.indexOf(t) > 0 ? 18 : 6;
        }
        if (!hit) return;
        if (name === q) s += 100; else if (name.indexOf(q) === 0) s += 40;
        if (r[0] === "guide") s += 4;
        out.push([s, r]);
      });
    }
    run(true);
    if (out.length < 4 && tokens.length > 1) { out = []; run(false); } /* few exact matches: also show partial matches */
    out.sort(function (a, b) { return b[0] - a[0]; });
    items = out.slice(0, 8).map(function (x) { return x[1]; }); sel = 0; render();
  }
  function build() {
    if (dlg) return;
    dlg = d.createElement("div"); dlg.className = "pal"; dlg.hidden = true;
    dlg.innerHTML = '<div class="pal__box" role="dialog" aria-modal="true" aria-label="Search AI tools"><input class="pal__in" type="search" placeholder="Search tools, guides, categories" aria-label="Search" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="palist"><ul class="pal__list" id="palist" role="listbox"></ul><p class="pal__hint">↑ ↓ to move · Enter to open · Esc to close</p></div>';
    d.body.appendChild(dlg);
    input = dlg.querySelector("input"); list = dlg.querySelector("ul");
    dlg.addEventListener("mousedown", function (e) { if (e.target === dlg) close(); });
    input.addEventListener("input", function () { search(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); render(); }
      else if (e.key === "Enter" && items[sel]) { location.href = items[sel][2]; }
      else if (e.key === "Escape") close();
    });
  }
  function open(from) {
    build(); opener = from || d.activeElement; dlg.hidden = false; d.documentElement.classList.add("pal-open");
    input.value = ""; input.focus();
    load().then(function () { search(input.value); });
  }
  function close() { if (!dlg || dlg.hidden) return; dlg.hidden = true; d.documentElement.classList.remove("pal-open"); if (opener && opener.focus) opener.focus(); }
  d.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-search]"); if (b) { e.preventDefault(); open(b); } });
  d.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((d.activeElement || {}).tagName || "");
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); dlg && !dlg.hidden ? close() : open(); }
    else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); open(); }
    else if (e.key === "Escape") close();
  });
  d.querySelectorAll("[data-search]").forEach(function (b) { b.addEventListener("pointerenter", load, { once: true }); });
})();
