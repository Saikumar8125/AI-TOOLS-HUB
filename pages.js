/* AI Tools Hub · pages.js v3.0 — shared script for generated pages, seller guides, legal pages and 404:
   theme toggle (aith-theme), search palette (/ or Ctrl/Cmd+K), guide reading progress, table-of-contents highlight,
   Save on tool pages (aith-saved), recently viewed (aith-recent) and the Clear-data button on legal pages (also clears aith-sound, set by sfx.js). */
(function () {
  "use strict";
  var d = document, root = d.documentElement, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var store = {
    get: function (k) { try { var v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string"; }) : []; } catch (e) { return []; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };

  /* theme */
  function paintTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    [].forEach.call(d.querySelectorAll("[data-theme-toggle]"), function (b) { b.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme"); });
    var m = d.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", dark ? "#0d0d10" : "#fafaf9");
  }
  d.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-theme-toggle]"); if (!b) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("aith-theme", next); } catch (err) { /* storage blocked */ }
    paintTheme();
  });
  paintTheme();

  /* tool pages: recently viewed + save */
  var tool = d.body.getAttribute("data-tool");
  if (tool) {
    store.set("aith-recent", [tool].concat(store.get("aith-recent").filter(function (n) { return n !== tool; })).slice(0, 8));
    var sb = d.querySelector("[data-save]");
    if (sb) {
      var paint = function () { var on = store.get("aith-saved").indexOf(tool) > -1; sb.setAttribute("aria-pressed", String(on)); sb.classList.toggle("is-saved", on); sb.querySelector("span").textContent = on ? "Saved" : "Save"; };
      sb.hidden = false; paint();
      sb.addEventListener("click", function () { var s = store.get("aith-saved"), k = s.indexOf(tool); if (k > -1) s.splice(k, 1); else s.unshift(tool); store.set("aith-saved", s); paint(); if (k < 0 && window.AITHSfx) window.AITHSfx.play("add"); });
    }
  }

  /* legal pages: clear this site's localStorage keys from this browser */
  var clr = d.querySelector("[data-clear-local]");
  if (clr) {
    clr.hidden = false;
    clr.addEventListener("click", function () {
      ["aith-saved", "aith-compare", "aith-recent", "aith-theme", "aith-sound"].forEach(function (k) { try { localStorage.removeItem(k); } catch (err) { /* storage blocked */ } });
      var st = d.getElementById("clear-status");
      if (st) st.textContent = "Done. Saved tools, compare picks, recently viewed tools, your theme choice and your sound setting were removed from this browser.";
    });
  }

  /* reading progress (guides) */
  var bar = d.querySelector(".progress i");
  if (bar) {
    var tick = function () { var h = d.documentElement, m = h.scrollHeight - h.clientHeight; bar.style.transform = "scaleX(" + (m > 0 ? Math.min(1, h.scrollTop / m) : 0) + ")"; };
    addEventListener("scroll", tick, { passive: true }); tick();
  }

  /* table of contents: highlight the section being read */
  var toc = d.querySelector(".toc"), links = toc ? [].slice.call(toc.querySelectorAll('a[href^="#"]')) : [];
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = byId[e.target.id];
        if (!e.isIntersecting || !a) return;
        links.forEach(function (l) { l.classList.remove("on"); l.removeAttribute("aria-current"); });
        a.classList.add("on"); a.setAttribute("aria-current", "true");
        toc.scrollTo({ left: a.offsetLeft - toc.clientWidth / 2 + a.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    Object.keys(byId).forEach(function (id) { var el = d.getElementById(id); if (el) io.observe(el); });
  }

  /* search palette over /search-index.json: [kind, name, url, category, price, short description] */
  var idx = null, loading = null, dlg, input, list, items = [], sel = 0, opener = null;
  var load = function () { return loading || (loading = fetch("/search-index.json").then(function (r) { return r.json(); }).then(function (j) { idx = j; }).catch(function () { idx = []; })); };
  var KIND = { tool: "Tool", guide: "Guide", category: "Category" };
  function render() {
    list.innerHTML = items.map(function (r, i) {
      return '<li role="option" id="pal' + i + '" aria-selected="' + (i === sel) + '"><a href="' + esc(r[2]) + '" tabindex="-1"><span class="pal__n">' + esc(r[1]) + '</span><span class="pal__m">' + esc(KIND[r[0]]) + (r[3] && r[0] === "tool" ? " · " + esc(r[3]) : "") + (r[4] ? " · " + esc(r[4]) : "") + "</span>" + (r[5] ? '<span class="pal__d">' + esc(r[5]) + "</span>" : "") + "</a></li>";
    }).join("") || (idx ? '<li class="pal__empty">No match. Try “invoice”, “WhatsApp” or “video”.</li>' : '<li class="pal__empty">Loading…</li>');
    input.setAttribute("aria-activedescendant", items.length ? "pal" + sel : "");
    var cur = list.children[sel]; if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (!idx) return render();
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
    if (out.length < 4 && tokens.length > 1) { out = []; run(false); }
    out.sort(function (a, b) { return b[0] - a[0]; });
    items = out.slice(0, 8).map(function (x) { return x[1]; }); sel = 0; render();
  }
  function build() {
    if (dlg) return;
    dlg = d.createElement("div"); dlg.className = "pal"; dlg.hidden = true;
    dlg.innerHTML = '<div class="pal__box" role="dialog" aria-modal="true" aria-label="Search AI tools, guides and categories"><div class="pal__f"><svg class="i" aria-hidden="true"><use href="/icons.svg#i-search"/></svg><input class="pal__in" type="search" placeholder="Search tools, guides, categories…" aria-label="Search" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="palist" aria-autocomplete="list"></div><ul class="pal__list" id="palist" role="listbox" aria-label="Results"></ul><p class="pal__hint">↑ ↓ to move · Enter to open · Esc to close</p></div>';
    d.body.appendChild(dlg);
    input = dlg.querySelector("input"); list = dlg.querySelector("ul");
    dlg.addEventListener("mousedown", function (e) { if (e.target === dlg) close(); });
    input.addEventListener("input", function () { search(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); render(); }
      else if (e.key === "Enter" && items[sel]) { location.href = items[sel][2]; }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") { e.preventDefault(); } /* focus stays in the palette */
    });
  }
  function open(from) {
    build(); opener = from || d.activeElement; dlg.hidden = false; root.classList.add("pal-open");
    input.value = ""; input.focus(); render();
    load().then(function () { search(input.value); });
  }
  function close() { if (!dlg || dlg.hidden) return; dlg.hidden = true; root.classList.remove("pal-open"); if (opener && opener.focus) opener.focus(); }
  d.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-search]"); if (b) { e.preventDefault(); open(b); } });
  d.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((d.activeElement || {}).tagName || "");
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); dlg && !dlg.hidden ? close() : open(); }
    else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); open(); }
    else if (e.key === "Escape") close();
  });
  [].forEach.call(d.querySelectorAll("[data-search]"), function (b) { b.addEventListener("pointerenter", load, { once: true }); });
})();
