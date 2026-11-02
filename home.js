/* AI Tools Hub · home.js v3.0 — homepage app (vanilla JS, no dependencies)
   Data: data.js (window.AITH_TOOLS / AITH_DESC), #india-data (verified India facts), #guide-map (written by build.js).
   Matching: finder.js (window.AITHFinder). Storage keys: aith-saved, aith-compare, aith-recent, aith-theme (aith-sound is read and written by sfx.js). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var $ = function (id) { return doc.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ISSUES = "https://github.com/Saikumar8125/AI-TOOLS-HUB/issues/new";
  var SITE = "https://aitoolshub-in.vercel.app";
  var LINK_CHECK = "27 Oct 2026", INDIA_CHECK = "11 Oct 2026";

  /* ---------- data ---------- */
  var DESC = window.AITH_DESC || {};
  var TOOLS = (window.AITH_TOOLS || []).map(function (t, i) {
    var d = DESC[t.n] || {};
    return { n: t.n, u: t.u, c: t.c, p: t.p, i: i, d: d.d || "", b: d.b || [] };
  });
  function json(id, fb) { try { var el = $(id); return el ? JSON.parse(el.textContent || "null") || fb : fb; } catch (e) { return fb; } }
  var INDIA = json("india-data", {});
  var GMAP = json("guide-map", {});
  var GUIDES = GMAP.g || [], TOOL_GUIDES = GMAP.t || {}, INTRO = GMAP.i || {};
  var IN_LABELS = { inr: "INR pricing", upi: "UPI payments", gst: "GST invoices", lang: "Indian-language support" };
  var byName = {};
  TOOLS.forEach(function (t) { byName[t.n] = t; });
  var F = window.AITHFinder, IX = F ? F.createIndex(TOOLS, INDIA) : null;

  var CATS = [], COUNT = {};
  TOOLS.forEach(function (t) { if (!COUNT[t.c]) { COUNT[t.c] = 0; CATS.push(t.c); } COUNT[t.c]++; });
  var CAT_ICON = { "Chatbots": "message-square", "Study": "graduation-cap", "Research": "microscope", "Writing": "pen-line", "Coding": "code-xml", "No-Code": "blocks", "Image": "image", "Photo Edit": "image-up", "Design": "palette", "PPT": "presentation", "Video": "clapperboard", "Avatar": "circle-user-round", "Audio": "audio-lines", "Music": "music", "Transcription": "captions", "Translation": "languages", "Resume & Jobs": "briefcase-business", "Productivity": "list-checks", "Automation": "workflow", "Marketing": "megaphone", "Business": "building-2", "Data & Sheets": "table-2", "3D & Gaming": "box", "Health & Life": "heart-pulse", "Prompts & Learning AI": "lightbulb", "Browser & Search": "globe" };
  // data.js keeps the catalogue grouped by category; entries after this index break that grouping, i.e. they were appended later.
  var APPENDED_FROM = (function () { var seen = {}, prev = null; for (var i = 0; i < TOOLS.length; i++) { var c = TOOLS[i].c; if (c !== prev) { if (seen[c]) return i; seen[c] = 1; prev = c; } } return TOOLS.length; })();

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function icon(n, cls) { return '<svg class="i' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="/icons.svg#i-' + n + '"/></svg>'; }
  // Must stay identical to slugify() in build.js
  function slug(s) { return String(s).toLowerCase().replace(/&/g, " and ").replace(/['’.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tool"; }
  var SLUG = {}, BY_SLUG = {};
  (function () { var used = {}; TOOLS.forEach(function (t) { var s = slug(t.n), b = s, k = 2; while (used[s]) s = b + "-" + k++; used[s] = 1; SLUG[t.n] = s; BY_SLUG[s] = t; }); })();
  var CAT_BY_SLUG = {}; CATS.forEach(function (c) { CAT_BY_SLUG[slug(c)] = c; });
  function domain(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  function fav(t, size) {
    var px = size === "lg" ? 56 : size === "sm" ? 32 : 40;
    return '<span class="fav' + (size ? " fav--" + size : "") + '" aria-hidden="true"><span class="fav__l">' + esc(t.n.charAt(0).toUpperCase()) + '</span><img src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain(t.u)) + "&amp;sz=" + (px > 40 ? 128 : 64) + '" alt="" width="' + px + '" height="' + px + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" /></span>';
  }
  function badge(p) { return '<span class="badge badge--' + esc(String(p).toLowerCase()) + '">' + esc(p) + "</span>"; }
  function freeLine(t) { return t.p === "Free" ? "Free to use" : t.p === "Freemium" ? "Free plan available" : "No free plan listed"; }
  function india(t) {
    var d = INDIA[t.n]; if (!d) return null;
    var labels = Object.keys(d.l || {}).filter(function (k) { return IN_LABELS[k]; }).map(function (k) { return { k: k, label: IN_LABELS[k], src: d.l[k] }; });
    var ok = labels.length > 0 || !!d.m;
    var na = !ok && d.x && d.x.src ? { src: d.x.src, date: d.x.d || "" } : null;
    return { labels: labels, made: !!d.m, verified: ok, na: na, listed: true };
  }
  /* Three India statuses. "unavailable" only when #india-data has a confirmed source in d.x {src, d}. */
  var IN_STATUS = { verified: "Verified for India", unverified: "India availability not verified", unavailable: "Not available in India" };
  function inStatus(t) { var x = india(t); return x && x.verified ? "verified" : x && x.na ? "unavailable" : "unverified"; }
  function verified(t) { return inStatus(t) === "verified"; }
  function inBadge(t, short) {
    var s = inStatus(t);
    if (s === "verified") return '<span class="badge badge--ok" title="INR, UPI, GST, Indian-language or Made in India confirmed on official pages, ' + INDIA_CHECK + '">' + icon("badge-check") + IN_STATUS.verified + "</span>";
    if (s === "unavailable") return '<span class="badge badge--no">' + icon("x") + IN_STATUS.unavailable + "</span>";
    return '<span class="badge badge--line badge--muted">' + (short ? "India: not verified" : IN_STATUS.unverified) + "</span>";
  }
  function vBadge(t) { return inBadge(t, true); }
  function reportUrl(t) {
    var body = "Tool: " + t.n + "\nListed link: " + t.u + "\nListed pricing: " + (t.p || "") + "\nPage: " + SITE + "/tools/" + SLUG[t.n] + "\n\nWhat is wrong (link / pricing / other):\nWhat it should be (with official source link):\n";
    return ISSUES + "?title=" + encodeURIComponent("Problem report: " + t.n) + "&body=" + encodeURIComponent(body);
  }
  var store = {
    get: function (k, fb) { try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? fb : v; } catch (e) { return fb; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  function names(key, max) {
    var v = store.get(key, []), seen = {};
    if (!Array.isArray(v)) return [];
    return v.filter(function (n) { if (typeof n !== "string" || !byName[n] || seen[n]) return false; seen[n] = 1; return true; }).slice(0, max || 999);
  }
  function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }

  /* favicons: fall back to the letter when the image fails or is Google's 16px default */
  doc.addEventListener("error", function (e) { var t = e.target; if (t && t.tagName === "IMG" && t.parentNode && t.parentNode.classList && t.parentNode.classList.contains("fav")) t.remove(); }, true);
  doc.addEventListener("load", function (e) { var t = e.target; if (t && t.tagName === "IMG" && t.parentNode && t.parentNode.classList && t.parentNode.classList.contains("fav") && t.naturalWidth && t.naturalWidth <= 16) t.remove(); }, true);

  function sfx(n) { if (window.AITHSfx) window.AITHSfx.play(n); } // sfx.js; plays only when the user turned sound on

  /* ---------- toast ---------- */
  var toastEl = $("toast"), toastT = 0;
  function toast(msg, ico) {
    toastEl.innerHTML = (ico ? icon(ico) : "") + "<span>" + esc(msg) + "</span>";
    toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }

  /* ---------- overlays (sheet, drawer, compare, palette): focus trap, Escape, return focus ---------- */
  var stack = [];
  function focusables(el) { return [].filter.call(el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'), function (x) { return x.offsetParent !== null || x === doc.activeElement; }); }
  function isOpen(ov) { return stack.some(function (s) { return s.el === ov; }); }
  function openOv(ov, opener, focusEl) {
    if (isOpen(ov)) return;
    clearTimeout(ov._closeT);
    stack.push({ el: ov, opener: opener || doc.activeElement });
    ov.hidden = false;
    doc.body.classList.add("is-locked");
    requestAnimationFrame(function () { ov.classList.add("is-open"); });
    var box = ov.querySelector('[role="dialog"]');
    (focusEl || box).focus({ preventScroll: true });
    setTimeout(function () { if (!box.contains(doc.activeElement)) (focusEl || box).focus({ preventScroll: true }); }, 30);
  }
  function closeOv(ov, noReturn) {
    var k = -1; stack.forEach(function (s, i) { if (s.el === ov) k = i; });
    if (k < 0) return;
    var s = stack.splice(k, 1)[0];
    ov.classList.remove("is-open");
    var done = function () { if (!ov.classList.contains("is-open")) ov.hidden = true; };
    clearTimeout(ov._closeT);
    if (reduce) done(); else ov._closeT = setTimeout(done, 200);
    if (!stack.length) doc.body.classList.remove("is-locked");
    if (ov.contains(doc.activeElement)) doc.activeElement.blur();
    if (!noReturn && s.opener && s.opener.focus && doc.contains(s.opener)) s.opener.focus({ preventScroll: true });
  }
  function top() { return stack.length ? stack[stack.length - 1].el : null; }
  doc.addEventListener("keydown", function (e) {
    var t = top();
    if (!t) return;
    if (e.key === "Escape") { e.preventDefault(); closeOv(t); return; }
    if (e.key === "Tab") {
      var box = t.querySelector('[role="dialog"]'), f = focusables(box);
      if (!f.length) { e.preventDefault(); box.focus(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || doc.activeElement === box)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!box.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });
  doc.addEventListener("click", function (e) { var c = e.target.closest("[data-close]"); if (c) { var ov = c.closest(".ov"); if (ov) closeOv(ov); } });

  /* ---------- theme ---------- */
  var themeBtn = $("theme");
  function paintTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    [].forEach.call(doc.querySelectorAll('meta[name="theme-color"]'), function (m) { m.setAttribute("content", dark ? "#0d0d10" : "#fafaf9"); m.removeAttribute("media"); });
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("aith-theme", next); } catch (e) { /* storage blocked */ }
    paintTheme();
  });
  paintTheme();

  /* ---------- header, mobile menu, back to top ---------- */
  var hdr = $("hdr"), burger = $("burger"), menu = $("menu"), toTop = $("to-top");
  function setMenu(open) {
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    burger.querySelector("use").setAttribute("href", "/icons.svg#i-" + (open ? "x" : "menu"));
  }
  burger.addEventListener("click", function () { setMenu(menu.hidden); if (!menu.hidden) { var a = menu.querySelector("a"); if (a) a.focus(); } });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden && !top()) { setMenu(false); burger.focus(); } });
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { var y = window.scrollY; hdr.classList.toggle("is-scrolled", y > 4); toTop.hidden = y < 1200; ticking = false; });
  }, { passive: true });
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); $("hero-q").focus({ preventScroll: true }); });

  /* ---------- tool card ---------- */
  function card(t, why) {
    var saved = isSaved(t), inCmp = cmp.indexOf(t.n) > -1;
    return '<article class="tc" data-ti="' + t.i + '">' +
      '<div class="tc__head">' + fav(t) + '<div class="tc__id"><h3 class="tc__name"><button type="button" class="tc__open" data-open="' + t.i + '">' + esc(t.n) + '</button></h3><p class="tc__cat">' + esc(t.c) + "</p></div></div>" +
      '<p class="tc__desc">' + esc(t.d || t.c + " tool") + "</p>" +
      '<div class="tc__meta">' + badge(t.p) + "<span>" + freeLine(t) + "</span>" + vBadge(t) + "</div>" +
      (why && why.length ? '<ul class="tc__why" aria-label="Why it matches">' + why.slice(0, 2).map(function (r) { return "<li>" + icon("check") + esc(r) + "</li>"; }).join("") + "</ul>" : "") +
      '<div class="tc__foot"><a class="visit" href="' + esc(t.u) + '" target="_blank" rel="noopener" aria-label="Visit ' + esc(t.n) + ' official site (opens in a new tab)">Visit' + icon("arrow-up-right", "i--xs") + "</a>" +
      '<button type="button" class="btn btn--ghost btn--sm" data-open="' + t.i + '" aria-label="Details for ' + esc(t.n) + '">Details</button>' +
      '<button type="button" class="iconbtn fav-btn" data-fav="' + t.i + '" aria-pressed="' + saved + '" aria-label="Save ' + esc(t.n) + '">' + icon("heart") + "</button>" +
      '<button type="button" class="iconbtn" data-cmp="' + t.i + '" aria-pressed="' + inCmp + '" aria-label="Compare ' + esc(t.n) + '">' + icon("git-compare-arrows") + "</button></div></article>";
  }
  function syncButtons() {
    [].forEach.call(doc.querySelectorAll("[data-fav]"), function (b) { b.setAttribute("aria-pressed", String(isSaved(TOOLS[+b.getAttribute("data-fav")]))); });
    [].forEach.call(doc.querySelectorAll("[data-cmp]"), function (b) { b.setAttribute("aria-pressed", String(cmp.indexOf(TOOLS[+b.getAttribute("data-cmp")].n) > -1)); });
  }

  /* ---------- favourites (localStorage "aith-saved": tool names) ---------- */
  var saved = names("aith-saved"), savedN = $("saved-n"), savedBtn = $("saved-btn");
  function isSaved(t) { return saved.indexOf(t.n) > -1; }
  function paintSaved(bump) {
    savedN.textContent = saved.length;
    savedN.classList.toggle("is-on", saved.length > 0);
    if (bump && !reduce) { savedN.classList.remove("is-bump"); void savedN.offsetWidth; savedN.classList.add("is-bump"); }
    savedBtn.setAttribute("aria-label", saved.length + " saved tool" + (saved.length === 1 ? "" : "s"));
    $("drawer-list").innerHTML = saved.length ? saved.map(function (n) {
      var t = byName[n];
      return '<li class="mini-row"><button type="button" class="mini" data-open="' + t.i + '">' + fav(t, "sm") + '<span class="opt__t"><span class="opt__n">' + esc(t.n) + '</span><span class="opt__w">' + esc(t.c) + " · " + esc(t.p) + "</span></span></button>" +
        '<button type="button" class="iconbtn" data-sv-rm="' + t.i + '" aria-label="Remove ' + esc(t.n) + ' from saved">' + icon("trash-2") + "</button></li>";
    }).join("") : '<li class="empty">' + icon("heart") + "<h3>No saved tools yet</h3><p>Tap the heart on any tool to keep it here. Saved tools stay in this browser.</p></li>";
  }
  function toggleSave(t) {
    var k = saved.indexOf(t.n);
    if (k > -1) saved.splice(k, 1); else saved.unshift(t.n);
    store.set("aith-saved", saved);
    paintSaved(k < 0); syncButtons();
    toast(k > -1 ? "Removed " + t.n + " from saved" : "Saved " + t.n, k > -1 ? "trash-2" : "heart");
    if (k < 0) sfx("add");
  }
  savedBtn.addEventListener("click", function () { openOv($("drawer"), savedBtn); });
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-sv-rm]"); if (!b) return;
    var t = TOOLS[+b.getAttribute("data-sv-rm")], next = b.closest("li").nextElementSibling || b.closest("li").previousElementSibling;
    toggleSave(t);
    var f = next && next.querySelector("[data-sv-rm]"); (f || $("drawer").querySelector("[data-close]")).focus();
  });

  /* ---------- compare (localStorage "aith-compare", max 4) ---------- */
  var MAX_CMP = 4, cmp = names("aith-compare", MAX_CMP), cbar = $("cbar");
  function paintCmp() {
    cbar.hidden = cmp.length === 0;
    doc.body.classList.toggle("has-cbar", cmp.length > 0);
    $("cbar-list").innerHTML = cmp.map(function (n) { var t = byName[n]; return '<li title="' + esc(n) + '">' + fav(t, "sm") + '<span class="sr-only">' + esc(n) + "</span></li>"; }).join("");
    $("cbar-n").textContent = cmp.length + " of " + MAX_CMP;
    var go = $("cbar-go"); go.disabled = cmp.length < 2; go.textContent = cmp.length < 2 ? "Pick one more" : "Compare " + cmp.length;
  }
  function toggleCmp(t) {
    var k = cmp.indexOf(t.n);
    if (k > -1) cmp.splice(k, 1);
    else if (cmp.length >= MAX_CMP) { toast("You can compare up to 4 tools. Remove one first.", "info"); return false; }
    else cmp.push(t.n);
    store.set("aith-compare", cmp);
    paintCmp(); syncButtons();
    if (isOpen($("cmp"))) cmpTable();
    if (k < 0) { toast("Added " + t.n + " to compare (" + cmp.length + " of 4)", "git-compare-arrows"); sfx("add"); }
    return true;
  }
  $("cbar-clear").addEventListener("click", function () { cmp = []; store.set("aith-compare", cmp); paintCmp(); syncButtons(); toast("Compare cleared"); });
  $("cbar-go").addEventListener("click", function () { cmpTable(); openOv($("cmp"), $("cbar-go")); });
  function inCell(t) {
    var x = india(t);
    if (x && x.na) return '<span class="badge badge--no">' + icon("x") + IN_STATUS.unavailable + '</span> <a href="' + esc(x.na.src) + '" target="_blank" rel="noopener">source</a>';
    if (!x || !x.verified) return '<span class="m-unv">' + IN_STATUS.unverified + ' — check official site</span>';
    return "<ul>" + (x.made ? "<li>" + icon("badge-check") + "Made in India</li>" : "") + x.labels.map(function (l) { return "<li>" + icon("badge-check") + '<span>' + esc(l.label) + ' <a href="' + esc(l.src) + '" target="_blank" rel="noopener">source</a></span></li>'; }).join("") + "</ul>";
  }
  function pros(t) {
    var out = [], x = india(t), g = (TOOL_GUIDES[t.n] || []).length;
    if (t.p !== "Paid") out.push(t.p === "Free" ? "Free to use" : "Free plan available");
    if (x && x.made) out.push("Made in India (verified)");
    if (x && x.labels.length) out.push(x.labels.map(function (l) { return l.label; }).join(", ") + " verified");
    if (g) out.push("Picked in " + g + " of our business guides");
    return out;
  }
  function cmpTable() {
    var list = cmp.map(function (n) { return byName[n]; });
    if (list.length < 2) { $("cmp-body").innerHTML = '<div class="empty empty--inset">' + icon("git-compare-arrows") + "<h3>Pick at least two tools</h3><p>Use the compare button on any tool card. You can compare up to 4.</p></div>"; return; }
    function row(label, fn) { return '<tr><th scope="row">' + label + "</th>" + list.map(function (t) { return "<td>" + fn(t) + "</td>"; }).join("") + "</tr>"; }
    function ul(a, ok) { return a.length ? "<ul>" + a.map(function (x) { return "<li>" + icon(ok ? "check" : "info") + "<span>" + esc(x) + "</span></li>"; }).join("") + "</ul>" : '<span class="m-unv">Not listed</span>'; }
    $("cmp-body").innerHTML = '<table class="cmp"><caption class="sr-only">Comparison of ' + list.length + " tools</caption><thead><tr><th scope=\"col\"><span class=\"sr-only\">Attribute</span></th>" + list.map(function (t) {
      return '<th scope="col"><div class="cmp__tool"><div class="tc__head">' + fav(t, "sm") + '<div class="tc__id"><p class="tc__name">' + esc(t.n) + '</p><p class="tc__cat">' + esc(t.c) + '</p></div></div><div class="cmp__acts"><a class="btn btn--sm btn--primary" href="' + esc(t.u) + '" target="_blank" rel="noopener">Visit' + icon("arrow-up-right", "i--xs") + '</a><button type="button" class="btn btn--sm" data-open="' + t.i + '">Details</button><button type="button" class="iconbtn" data-cmp-rm="' + t.i + '" aria-label="Remove ' + esc(t.n) + ' from compare">' + icon("x") + "</button></div></div></th>";
    }).join("") + "</tr></thead><tbody>" +
      row("Pricing", function (t) { return badge(t.p) + ' <span class="muted small">directory data</span>'; }) +
      row("Free plan", function (t) { return esc(freeLine(t)); }) +
      row("Key features", function (t) { return ul(t.b, true); }) +
      row("Use cases", function (t) { return esc(t.d); }) +
      row("Platforms", function () { return '<span class="m-unv">Not verified — check official site</span>'; }) +
      row("India support", inCell) +
      row("Pros (from our data)", function (t) { return ul(pros(t), true); }) +
      row("Limitations", function (t) { return t.p === "Paid" ? ul(["No free plan listed"], false) : '<span class="m-unv">Not listed</span>'; }) +
      row("Official site", function (t) { return '<a href="' + esc(t.u) + '" target="_blank" rel="noopener">' + esc(domain(t.u)) + "</a>"; }) +
      "</tbody></table><p class=\"cmp__note\">Links last checked " + LINK_CHECK + ". India facts verified on official pages " + INDIA_CHECK + ". Platforms and current prices are not in our data: check each official site.</p>";
  }
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cmp-rm]"); if (!b) return;
    toggleCmp(TOOLS[+b.getAttribute("data-cmp-rm")]);
    if (cmp.length < 2) { closeOv($("cmp"), true); $("cbar-clear").focus(); }
  });

  /* ---------- recently viewed (localStorage "aith-recent") ---------- */
  var recent = names("aith-recent", 8);
  function paintRecent() {
    $("recent").hidden = recent.length === 0;
    $("recent-list").innerHTML = recent.map(function (n) { var t = byName[n]; return '<li><button type="button" data-open="' + t.i + '">' + fav(t, "sm") + '<span class="opt__t"><span class="opt__n">' + esc(t.n) + '</span><span class="opt__w">' + esc(t.c) + "</span></span></button></li>"; }).join("");
  }
  function pushRecent(t) { recent = [t.n].concat(recent.filter(function (n) { return n !== t.n; })).slice(0, 8); store.set("aith-recent", recent); paintRecent(); }
  $("recent-clear").addEventListener("click", function () { recent = []; store.set("aith-recent", recent); paintRecent(); toast("Recently viewed cleared"); $("hero-q").focus({ preventScroll: true }); });

  /* ---------- tool sheet ---------- */
  var sheet = $("sheet"), mBody = $("m-body"), mFoot = $("m-foot"), current = null;
  function alternatives(t) {
    var same = TOOLS.filter(function (x) { return x.c === t.c && x !== t; });
    return same.filter(function (x) { return x.p === t.p; }).concat(same.filter(function (x) { return x.p !== t.p; })).slice(0, 4);
  }
  function miniGrid(list) { return '<ul class="mini-grid">' + list.map(function (x) { return '<li><button type="button" class="mini" data-open="' + x.i + '">' + fav(x, "sm") + '<span class="opt__t"><span class="opt__n">' + esc(x.n) + '</span><span class="opt__w">' + esc(x.c) + " · " + esc(x.p) + "</span></span></button></li>"; }).join("") + "</ul>"; }
  function paintSheet(t) {
    var x = india(t), alts = alternatives(t), altSet = {}, gl = (TOOL_GUIDES[t.n] || []).map(function (k) { return GUIDES[k]; }).filter(Boolean);
    alts.forEach(function (a) { altSet[a.n] = 1; });
    var sim = IX ? F.similar(IX, t.n, 8).map(function (r) { return r.tool; }).filter(function (s) { return !altSet[s.n] && s.c !== t.c; }).slice(0, 4) : [];
    mBody.innerHTML =
      '<div class="m-head">' + fav(t, "lg") + '<div class="tc__id"><h2 class="m-title" id="m-name">' + esc(t.n) + '</h2><p class="m-meta"><a href="/category/' + slug(t.c) + '">' + esc(t.c) + "</a>" + badge(t.p) + vBadge(t) + "</p></div></div>" +
      '<p class="m-about">' + esc(t.d) + "</p>" +
      '<section class="m-blk"><h3>Key features</h3><ul class="m-list">' + t.b.map(function (b) { return "<li>" + icon("check") + "<span>" + esc(b) + "</span></li>"; }).join("") + "</ul></section>" +
      '<section class="m-blk"><h3>Best use cases <span class="badge badge--line">general info</span></h3><ul class="m-list">' + (INTRO[t.c] ? "<li>" + icon("lightbulb") + "<span>" + esc(INTRO[t.c]) + "</span></li>" : "") + t.b.slice(0, 1).map(function (b) { return "<li>" + icon("check") + "<span>Main highlight: " + esc(b) + "</span></li>"; }).join("") +
      (gl.length ? "<li>" + icon("book-open") + "<span>Picked in our guides for " + gl.slice(0, 4).map(function (g) { return '<a href="/guides/' + esc(g[0]) + '">' + esc(g[2]) + "</a>"; }).join(", ") + (gl.length > 4 ? " and " + (gl.length - 4) + " more" : "") + "</span></li>" : "") + "</ul></section>" +
      '<section class="m-blk"><h3>Facts ' + '<span class="badge badge--line">directory data, links checked ' + LINK_CHECK + '</span></h3><dl class="m-facts">' +
        "<div><dt>Pricing model</dt><dd>" + badge(t.p) + ' <span class="muted small">Check the official site for current prices.</span></dd></div>' +
        "<div><dt>Free plan</dt><dd>" + esc(freeLine(t)) + "</dd></div>" +
        '<div><dt>Official site</dt><dd><a href="' + esc(t.u) + '" target="_blank" rel="noopener">' + esc(domain(t.u)) + "</a></dd></div>" +
        '<div><dt>Platforms</dt><dd class="m-unv">Not verified — check official site</dd></div>' +
      "</dl></section>" +
      '<section class="m-blk" id="m-india"><h3>India availability ' + inBadge(t) + "</h3>" +
        (x && x.verified ? '<dl class="m-facts">' + (x.made ? "<div><dt>Origin</dt><dd>Made in India</dd></div>" : "") + x.labels.map(function (l) { return "<div><dt>" + esc(l.label) + '</dt><dd>Verified <a class="src" href="' + esc(l.src) + '" target="_blank" rel="noopener">source' + "</a></dd></div>"; }).join("") + '</dl><p class="m-src">Confirmed on official pages, ' + INDIA_CHECK + ".</p>"
          : x && x.na ? '<p class="note">' + icon("info") + "<span>Confirmed not available in India" + (x.na.date ? " (" + esc(x.na.date) + ")" : "") + '. <a class="src" href="' + esc(x.na.src) + '" target="_blank" rel="noopener">Source</a></span></p>'
          : '<p class="note">' + icon("info") + "<span>India availability not verified — check official site. We haven't confirmed INR pricing, UPI, GST invoices or Indian-language support for " + esc(t.n) + "." + (x && x.listed ? " It is in our D2C seller picks." : "") + "</span></p>") +
      "</section>" +
      (alts.length ? '<section class="m-blk"><h3>Alternatives in ' + esc(t.c) + "</h3>" + miniGrid(alts) + "</section>" : "") +
      (sim.length ? '<section class="m-blk"><h3>Similar tools in other categories</h3>' + miniGrid(sim) + "</section>" : "") +
      '<p class="m-legend"><span>' + icon("circle-check", "i--xs") + "Links checked " + LINK_CHECK + "</span><span>" + icon("badge-check", "i--xs") + "India facts verified " + INDIA_CHECK + '</span><a id="m-report" href="' + esc(reportUrl(t)) + '" target="_blank" rel="noopener">' + "Report a wrong link or price</a></p>";
    var inC = cmp.indexOf(t.n) > -1;
    mFoot.innerHTML = '<a class="btn btn--primary" id="m-visit" href="' + esc(t.u) + '" target="_blank" rel="noopener"><span>Visit<span class="hide-sm"> official site</span></span>' + icon("arrow-up-right", "i--sm") + "</a>" +
      '<button type="button" class="btn btn--icon fav-btn iconbtn" data-fav="' + t.i + '" aria-pressed="' + isSaved(t) + '" aria-label="Save ' + esc(t.n) + '">' + icon("heart") + "</button>" +
      '<button type="button" class="btn btn--icon iconbtn" data-cmp="' + t.i + '" aria-pressed="' + inC + '" aria-label="Compare ' + esc(t.n) + '">' + icon("git-compare-arrows") + "</button>" +
      '<a class="btn" id="m-page" href="/tools/' + SLUG[t.n] + '">Full details</a>';
    mBody.scrollTop = 0;
  }
  function openTool(t, opener) {
    if (!t) return;
    current = t;
    paintSheet(t);
    pushRecent(t);
    if (!isOpen(sheet)) { openOv(sheet, opener); if (root.classList.contains("is-ready")) sfx("open"); } // no sound for ?tool= on page load
    else sheet.querySelector('[role="dialog"]').focus();
  }
  doc.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); var t = TOOLS[+o.getAttribute("data-open")]; if (isOpen($("palette"))) closeOv($("palette"), true); openTool(t, o.closest("#sheet") ? (stack[stack.length - 1] || {}).opener : o); return; }
    var f = e.target.closest("[data-fav]"); if (f) { toggleSave(TOOLS[+f.getAttribute("data-fav")]); return; }
    var c = e.target.closest("[data-cmp]"); if (c) { toggleCmp(TOOLS[+c.getAttribute("data-cmp")]); return; }
  });
  // whole card opens details (keyboard users use the name button)
  doc.addEventListener("click", function (e) {
    if (e.target.closest("a, button, input, select, textarea, label")) return;
    var c = e.target.closest(".tc[data-ti], .rec[data-ti]"); if (c) openTool(TOOLS[+c.getAttribute("data-ti")], c.querySelector("[data-open]"));
  });

  /* ---------- directory ---------- */
  var PER = innerWidth < 600 ? 12 : 24;
  var JOBS = [
    ["Product photos", ["Photoroom", "Pebblely", "Claid", "Mokker", "Remove.bg", "Erase.bg", "Picwish", "Clipdrop", "Let's Enhance", "Picsart AI", "Adobe Firefly", "Freepik AI"]],
    ["Listings & SEO copy", ["Hypotenuse AI", "Rytr", "Anyword", "Writesonic", "Grammarly", "Semrush", "Surfer SEO", "Ahrefs AI"]],
    ["WhatsApp marketing", ["AiSensy", "Interakt", "Wati", "Gallabox", "LimeChat", "Brevo"]],
    ["Ad creatives", ["AdCreative.ai", "Canva", "Predis.ai", "Creatify", "Arcads", "Pencil", "Adobe Express", "Simplified", "Microsoft Designer", "VistaCreate", "Kittl"]],
    ["GST & invoicing", ["Zoho Books", "Clear", "TallyPrime", "myBillBook", "Swipe"]],
    ["COD & RTO", ["GoKwik", "Shiprocket", "Razorpay Magic Checkout", "LimeChat"]],
    ["Support bots", ["Tidio", "Intercom Fin", "Zendesk AI", "Freshdesk Freddy", "Chatbase", "Botpress", "Voiceflow"]]
  ].map(function (j) { return { name: j[0], key: slug(j[0]), set: j[1].filter(function (n) { return byName[n]; }) }; });
  var JOB_BY = {}; JOBS.forEach(function (j) { JOB_BY[j.key] = j; });
  var S = { q: "", cat: "", p: "", india: "", sort: "", job: "", page: 1 };
  var qIn = $("q"), grid = $("grid"), catSel = $("f-cat"), sortSel = $("sort"), inSel = $("f-india");

  catSel.innerHTML = '<option value="">All categories</option>' + CATS.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + " (" + COUNT[c] + ")</option>"; }).join("");
  $("jobs").innerHTML = JOBS.map(function (j) { return '<button class="chip" type="button" data-job="' + j.key + '" aria-pressed="false">' + esc(j.name) + " <small>" + j.set.length + "</small></button>"; }).join("");

  function effSort() { return S.sort || (S.q ? "relevance" : "featured"); }
  function results() {
    var base = S.q && IX ? F.search(IX, S.q) : TOOLS.map(function (t) { return { tool: t, reasons: [], i: t.i, score: 0 }; });
    var job = S.job && JOB_BY[S.job];
    var list = base.filter(function (r) {
      var t = r.tool;
      if (S.cat && t.c !== S.cat) return false;
      if (S.p && t.p !== S.p) return false;
      if (S.india && inStatus(t) !== S.india) return false;
      if (job && job.set.indexOf(t.n) < 0) return false;
      return true;
    });
    var s = effSort();
    if (s === "az") list.sort(function (a, b) { return a.tool.n.localeCompare(b.tool.n, "en", { sensitivity: "base" }); });
    else if (s === "latest") list.sort(function (a, b) { var A = a.i >= APPENDED_FROM, B = b.i >= APPENDED_FROM; return A !== B ? (A ? -1 : 1) : A ? b.i - a.i : a.i - b.i; });
    else if (s === "featured" || !S.q) list.sort(function (a, b) { return a.i - b.i; });
    return list;
  }
  function writeURL() {
    var p = new URLSearchParams();
    if (S.q) p.set("q", S.q);
    if (S.cat) p.set("cat", slug(S.cat));
    if (S.p) p.set("price", S.p.toLowerCase());
    if (S.india) p.set("india", S.india);
    if (S.job) p.set("job", S.job);
    if (S.sort) p.set("sort", S.sort);
    if (S.page > 1) p.set("page", String(S.page));
    var qs = p.toString(), url = location.pathname + (qs ? "?" + qs : "") + location.hash;
    if (url !== location.pathname + location.search + location.hash) history.replaceState(null, "", url);
  }
  function readURL() {
    var p = new URLSearchParams(location.search), pr = (p.get("price") || "").toLowerCase();
    S.q = (p.get("q") || "").slice(0, 120);
    S.cat = CAT_BY_SLUG[p.get("cat") || ""] || "";
    S.p = pr === "free" ? "Free" : pr === "freemium" ? "Freemium" : pr === "paid" ? "Paid" : "";
    var iv = p.get("india"); S.india = iv === "1" ? "verified" : IN_STATUS[iv] ? iv : "";
    S.job = JOB_BY[p.get("job") || ""] ? p.get("job") : "";
    S.sort = ["featured", "relevance", "az", "latest"].indexOf(p.get("sort")) > -1 ? p.get("sort") : "";
    S.page = Math.max(1, parseInt(p.get("page"), 10) || 1);
  }
  function chip(label, key) { return '<button type="button" class="chip chip--rm" data-rm="' + key + '" aria-label="Remove filter: ' + esc(label) + '">' + esc(label) + icon("x") + "</button>"; }
  var SORT_LABEL = { featured: "Featured", relevance: "Best match", az: "A–Z", latest: "Latest additions" };
  function render(opts) {
    opts = opts || {};
    var list = results(), n = list.length, pages = Math.max(1, Math.ceil(n / PER));
    if (S.page > pages) S.page = pages;
    var from = (S.page - 1) * PER, slice = list.slice(from, from + PER);
    qIn.value !== S.q && (qIn.value = S.q);
    $("clear").hidden = !S.q;
    catSel.value = S.cat;
    sortSel.value = effSort();
    inSel.value = S.india;
    [].forEach.call($("price").querySelectorAll("button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-p") === S.p)); });
    [].forEach.call($("jobs").querySelectorAll("[data-job]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-job") === S.job)); });
    var act = [];
    if (S.q) act.push(chip("“" + S.q + "”", "q"));
    if (S.cat) act.push(chip(S.cat, "cat"));
    if (S.p) act.push(chip(S.p, "p"));
    if (S.india) act.push(chip(IN_STATUS[S.india], "india"));
    if (S.job) act.push(chip(JOB_BY[S.job].name, "job"));
    if (S.sort && S.sort !== (S.q ? "relevance" : "featured")) act.push(chip("Sort: " + SORT_LABEL[S.sort], "sort"));
    $("active").innerHTML = act.join("");
    $("clear-all").hidden = act.length === 0;
    $("count-n").textContent = n;
    $("count-t").textContent = n === 1 ? "tool" : "tools";
    $("count-sr").textContent = n + (n === 1 ? " tool" : " tools") + " found";
    var note = $("sort-note"), s = effSort();
    note.hidden = s !== "latest" && s !== "featured";
    note.textContent = s === "latest" ? "Latest additions: the " + (TOOLS.length - APPENDED_FROM) + " tools appended after the main catalogue come first, newest first. The directory doesn't track dates, so none are shown." : "Featured: our hand-curated catalogue order, grouped by category. There is no popularity data behind it.";
    if (!n) {
      grid.innerHTML = '<div class="empty empty--full">' + icon("search") + "<h3>No tools match these filters</h3><p>" + (S.q ? "Nothing matched “" + esc(S.q) + "”" + (act.length > 1 ? " with the other filters" : "") + ". " : "") + 'Try fewer filters or a broader task, or let the Tool Finder suggest options.</p><div class="chips"><button type="button" class="btn btn--sm" data-rm="all">Clear all filters</button><a class="btn btn--sm btn--ghost" href="#finder">Open the Tool Finder</a></div></div>';
    } else {
      grid.innerHTML = slice.map(function (r) { return card(r.tool, S.q ? r.reasons : null); }).join("");
    }
    $("pg-info").textContent = "Page " + S.page + " of " + pages + " · " + n + (n === 1 ? " tool" : " tools");
    $("pg-prev").disabled = S.page <= 1;
    $("pg-next").disabled = S.page >= pages;
    $("pager").hidden = pages <= 1;
    writeURL();
    if (opts.scroll) scrollToEl($("tools"));
  }
  var qT = 0;
  qIn.addEventListener("input", function () { clearTimeout(qT); qT = setTimeout(function () { S.q = qIn.value.trim(); S.page = 1; render(); }, 120); });
  qIn.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); clearTimeout(qT); S.q = qIn.value.trim(); S.page = 1; render(); } });
  $("clear").addEventListener("click", function () { S.q = ""; S.page = 1; render(); qIn.focus(); });
  catSel.addEventListener("change", function () { S.cat = catSel.value; S.page = 1; render(); });
  sortSel.addEventListener("change", function () { var v = sortSel.value; S.sort = v === (S.q ? "relevance" : "featured") ? "" : v; S.page = 1; render(); });
  var IN_COUNT = { verified: 0, unverified: 0, unavailable: 0 };
  TOOLS.forEach(function (t) { IN_COUNT[inStatus(t)]++; });
  inSel.innerHTML = '<option value="">Any India status</option>' + ["verified", "unverified", "unavailable"].map(function (k) { return '<option value="' + k + '"' + (IN_COUNT[k] ? "" : " disabled") + ">" + IN_STATUS[k] + " (" + (IN_COUNT[k] || "none confirmed yet") + ")</option>"; }).join("");
  inSel.addEventListener("change", function () { S.india = inSel.value; S.page = 1; render(); });
  $("price").addEventListener("click", function (e) { var b = e.target.closest("[data-p]"); if (!b) return; S.p = b.getAttribute("data-p"); S.page = 1; render(); });
  $("jobs").addEventListener("click", function (e) { var b = e.target.closest("[data-job]"); if (!b) return; var k = b.getAttribute("data-job"); S.job = S.job === k ? "" : k; S.page = 1; render(); });
  function clearAll() { S.q = ""; S.cat = ""; S.p = ""; S.india = ""; S.job = ""; S.sort = ""; S.page = 1; render(); }
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-rm]"); if (!b) return;
    var k = b.getAttribute("data-rm");
    if (k === "all") clearAll();
    else { if (k === "india") S.india = ""; else S[k] = ""; S.page = 1; render(); }
    var next = $("active").querySelector("[data-rm]"); (next || qIn).focus({ preventScroll: true });
  });
  $("clear-all").addEventListener("click", function () { clearAll(); qIn.focus({ preventScroll: true }); });
  $("pg-prev").addEventListener("click", function () { if (S.page > 1) { S.page--; render({ scroll: true }); } });
  $("pg-next").addEventListener("click", function () { S.page++; render({ scroll: true }); });
  function applySearch(q, extra) {
    S.q = String(q || "").trim(); S.cat = ""; S.p = ""; S.india = ""; S.job = ""; S.sort = ""; S.page = 1;
    if (extra) Object.keys(extra).forEach(function (k) { S[k] = extra[k]; });
    render({ scroll: true });
  }
  window.addEventListener("popstate", function () { readURL(); render(); });

  /* ---------- hero search with live suggestions ---------- */
  var hq = $("hero-q"), hl = $("hero-list"), hSel = -1, hItems = [];
  if (innerWidth < 600) hq.placeholder = "Describe a task or tool…";
  function hClose() { hl.hidden = true; hq.setAttribute("aria-expanded", "false"); hq.removeAttribute("aria-activedescendant"); hSel = -1; }
  function hRender() {
    var q = hq.value.trim();
    if (!q || !IX) { hClose(); return; }
    var all = F.search(IX, q); hItems = all.slice(0, 6);
    hl.innerHTML = (hItems.length ? hItems.map(function (r, k) {
      return '<li role="option" id="hs' + k + '" aria-selected="false" data-k="' + k + '">' + fav(r.tool, "sm") + '<span class="opt__t"><span class="opt__n">' + esc(r.tool.n) + '</span><span class="opt__w">' + esc(r.reasons[0] || r.tool.c) + '</span></span><span class="opt__k">' + esc(r.tool.c) + "</span></li>";
    }).join("") + '<li role="option" id="hs-all" class="suggest__all" aria-selected="false" data-k="all">See all ' + all.length + " results in the directory</li>"
      : '<li class="suggest__empty">No tools match “' + esc(q) + '”. Try a broader task, or the Tool Finder below.</li>');
    hl.hidden = false; hq.setAttribute("aria-expanded", "true"); hSel = -1;
  }
  function hMark() {
    var opts = hl.querySelectorAll('[role="option"]');
    [].forEach.call(opts, function (o, k) { o.setAttribute("aria-selected", String(k === hSel)); });
    if (hSel > -1 && opts[hSel]) { hq.setAttribute("aria-activedescendant", opts[hSel].id); opts[hSel].scrollIntoView({ block: "nearest" }); } else hq.removeAttribute("aria-activedescendant");
  }
  function hPick(k) { if (k === "all" || k == null) { var q = hq.value; hClose(); applySearch(q); } else { var r = hItems[+k]; hClose(); openTool(r.tool, hq); } }
  var hT = 0;
  hq.addEventListener("input", function () { clearTimeout(hT); hT = setTimeout(hRender, 80); });
  hq.addEventListener("focus", function () { if (hq.value.trim()) hRender(); });
  hq.addEventListener("keydown", function (e) {
    var opts = hl.querySelectorAll('[role="option"]');
    if (e.key === "ArrowDown" && !hl.hidden) { e.preventDefault(); hSel = Math.min(opts.length - 1, hSel + 1); hMark(); }
    else if (e.key === "ArrowUp" && !hl.hidden) { e.preventDefault(); hSel = Math.max(-1, hSel - 1); hMark(); }
    else if (e.key === "Escape" && !hl.hidden) { e.preventDefault(); e.stopPropagation(); hClose(); }
    else if (e.key === "Enter" && hSel > -1 && opts[hSel]) { e.preventDefault(); hPick(opts[hSel].getAttribute("data-k")); }
  });
  hl.addEventListener("mousedown", function (e) { e.preventDefault(); });
  hl.addEventListener("click", function (e) { var o = e.target.closest('[role="option"]'); if (o) hPick(o.getAttribute("data-k")); });
  doc.addEventListener("click", function (e) { if (!e.target.closest("#hero-form")) hClose(); });
  $("hero-form").addEventListener("submit", function (e) { e.preventDefault(); hPick("all"); });
  [].forEach.call(doc.querySelectorAll(".hero__try [data-q]"), function (b) { b.addEventListener("click", function () { hq.value = b.getAttribute("data-q"); applySearch(hq.value); }); });

  /* ---------- command palette (Ctrl/Cmd+K, "/") ---------- */
  var pal = $("palette"), pq = $("pal-q"), pl = $("pal-list"), pItems = [], pSel = 0;
  var JUMPS = [
    { t: "Tool Finder", d: "Describe a task, budget and must-haves", ico: "wand-sparkles", go: "#finder" },
    { t: "Verified for India", d: "INR, UPI, GST or language confirmed", ico: "badge-check", fn: function () { applySearch("", { india: "verified" }); } },
    { t: "All categories", d: CATS.length + " categories", ico: "blocks", go: "#categories" },
    { t: "D2C tools for Indian sellers", d: "Shopify, Amazon, WhatsApp, COD and GST", ico: "store", href: "d2c.html" },
    { t: "Guides for Indian businesses", d: "21 guides", ico: "book-open", href: "/guides" },
    { t: "Suggest a tool", d: "Opens a prefilled GitHub issue", ico: "plus", go: "#suggest" }
  ];
  function pRender() {
    var q = pq.value.trim(), html = "";
    pItems = [];
    if (!q) {
      recent.slice(0, 4).forEach(function (n) { pItems.push({ kind: "tool", tool: byName[n], why: "Recently viewed" }); });
      JUMPS.forEach(function (j) { pItems.push({ kind: "jump", j: j }); });
    } else {
      (IX ? F.search(IX, q, { limit: 7 }) : []).forEach(function (r) { pItems.push({ kind: "tool", tool: r.tool, why: r.reasons[0] || r.tool.c }); });
      var ql = q.toLowerCase();
      CATS.filter(function (c) { return c.toLowerCase().indexOf(ql) > -1; }).slice(0, 3).forEach(function (c) { pItems.push({ kind: "cat", c: c }); });
      GUIDES.filter(function (g) { return (g[1] + " " + g[2]).toLowerCase().indexOf(ql) > -1; }).slice(0, 3).forEach(function (g) { pItems.push({ kind: "guide", g: g }); });
    }
    var last = "";
    pItems.forEach(function (it, k) {
      var sec = it.kind === "tool" ? (q ? "Tools" : "Recently viewed") : it.kind === "cat" ? "Categories" : it.kind === "guide" ? "Guides" : "Jump to";
      if (sec !== last) { html += '<li class="pal__sep" role="presentation">' + sec + "</li>"; last = sec; }
      var inner = it.kind === "tool" ? fav(it.tool, "sm") + '<span class="opt__t"><span class="opt__n">' + esc(it.tool.n) + '</span><span class="opt__w">' + esc(it.why) + '</span></span><span class="opt__k">' + esc(it.tool.p) + "</span>"
        : it.kind === "cat" ? '<span class="pal__ico">' + icon(CAT_ICON[it.c] || "blocks") + '</span><span class="opt__t"><span class="opt__n">' + esc(it.c) + '</span><span class="opt__w">Filter the directory · ' + COUNT[it.c] + " tools</span></span>"
        : it.kind === "guide" ? '<span class="pal__ico">' + icon("book-open") + '</span><span class="opt__t"><span class="opt__n">' + esc(it.g[1]) + '</span><span class="opt__w">Guide</span></span>'
        : '<span class="pal__ico">' + icon(it.j.ico) + '</span><span class="opt__t"><span class="opt__n">' + esc(it.j.t) + '</span><span class="opt__w">' + esc(it.j.d) + "</span></span>";
      html += '<li role="option" id="po' + k + '" data-k="' + k + '" aria-selected="false">' + inner + "</li>";
    });
    pl.innerHTML = html || '<li class="suggest__empty">No match for “' + esc(q) + '”. Try “invoice”, “WhatsApp” or “video”.</li>';
    pSel = pItems.length ? 0 : -1; pMark();
  }
  function pMark() {
    [].forEach.call(pl.querySelectorAll('[role="option"]'), function (o) { o.setAttribute("aria-selected", String(+o.getAttribute("data-k") === pSel)); });
    var cur = $("po" + pSel);
    if (cur) { pq.setAttribute("aria-activedescendant", cur.id); cur.scrollIntoView({ block: "nearest" }); } else pq.removeAttribute("aria-activedescendant");
  }
  function pGo(k) {
    var it = pItems[k]; if (!it) return;
    var opener = (stack.filter(function (s) { return s.el === pal; })[0] || {}).opener;
    closeOv(pal, true);
    if (it.kind === "tool") openTool(it.tool, opener);
    else if (it.kind === "cat") applySearch("", { cat: it.c });
    else if (it.kind === "guide") location.href = "/guides/" + it.g[0];
    else if (it.j.fn) it.j.fn();
    else if (it.j.href) location.href = it.j.href;
    else { scrollToEl(doc.querySelector(it.j.go)); var f = doc.querySelector(it.j.go + " input, " + it.j.go + " textarea"); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, reduce ? 0 : 400); }
  }
  function openPal(opener) { if (isOpen(pal)) return; pq.value = ""; pRender(); openOv(pal, opener, pq); }
  $("open-palette").addEventListener("click", function () { openPal($("open-palette")); });
  pq.addEventListener("input", pRender);
  pq.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (pItems.length) { pSel = (pSel + 1) % pItems.length; pMark(); } }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (pItems.length) { pSel = (pSel - 1 + pItems.length) % pItems.length; pMark(); } }
    else if (e.key === "Enter") { e.preventDefault(); pGo(pSel); }
  });
  pl.addEventListener("click", function (e) { var o = e.target.closest('[role="option"]'); if (o) pGo(+o.getAttribute("data-k")); });
  doc.addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase(), typing = /^(input|textarea|select)$/i.test((e.target && e.target.tagName) || "") || (e.target && e.target.isContentEditable);
    if ((e.metaKey || e.ctrlKey) && k === "k") { e.preventDefault(); if (isOpen(pal)) closeOv(pal); else { if (isOpen(sheet)) closeOv(sheet, true); openPal(doc.activeElement); } }
    else if (k === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey && !top()) { e.preventDefault(); openPal(doc.activeElement); }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) { var kb = doc.querySelector(".hdr__search .kbd"); if (kb) kb.textContent = "⌘K"; }

  /* ---------- discover tabs + tool of the day ---------- */
  var FEATURED = ["ChatGPT", "Claude", "Perplexity", "Cursor", "Gamma", "Midjourney", "ElevenLabs", "Notion AI"];
  var TRENDING = ["Cursor", "Lovable", "NotebookLM", "Kling AI", "Suno", "Bolt.new", "v0", "DeepSeek"];
  var TAB_NOTE = {
    featured: "Hand-picked starting points in the most-used categories.",
    trending: "Editor's picks of fast-moving tools. Chosen by hand; there is no traffic or popularity data behind this list.",
    free: "Tools listed as Free, one per category, in curated order.",
    latest: "The most recent tools appended to the directory. Dates aren't tracked, so none are shown."
  };
  function tabList(k) {
    if (k === "featured") return FEATURED.map(function (n) { return byName[n]; }).filter(Boolean);
    if (k === "trending") return TRENDING.map(function (n) { return byName[n]; }).filter(Boolean);
    if (k === "free") { var seen = {}; return TOOLS.filter(function (t) { if (t.p !== "Free" || seen[t.c]) return false; seen[t.c] = 1; return true; }); }
    return TOOLS.slice(APPENDED_FROM).reverse();
  }
  var tabs = [].slice.call(doc.querySelectorAll('#discover [role="tab"]')), dGrid = $("discover-grid"), dTab = "featured";
  function paintTab(k, focus) {
    dTab = k;
    tabs.forEach(function (b) { var on = b.getAttribute("data-tab") === k; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    dGrid.setAttribute("aria-labelledby", "tab-" + k);
    var list = tabList(k).slice(0, 8);
    dGrid.innerHTML = list.map(function (t) { return card(t); }).join("");
    $("discover-note").innerHTML = esc(TAB_NOTE[k]) + (k === "free" ? ' <button type="button" class="linkbtn" id="see-free">See all ' + TOOLS.filter(function (t) { return t.p === "Free"; }).length + " free tools</button>" : k === "latest" ? ' <button type="button" class="linkbtn" id="see-latest">Sort the directory by latest additions</button>' : "");
    if (!reduce) { dGrid.classList.remove("is-swap"); void dGrid.offsetWidth; dGrid.classList.add("is-swap"); }
  }
  tabs.forEach(function (b, idx) {
    b.addEventListener("click", function () { paintTab(b.getAttribute("data-tab")); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (e.key === "Home") d = -idx; else if (e.key === "End") d = tabs.length - 1 - idx;
      if (!d) return; e.preventDefault();
      paintTab(tabs[(idx + d + tabs.length) % tabs.length].getAttribute("data-tab"), true);
    });
  });
  doc.addEventListener("click", function (e) {
    if (e.target.id === "see-free") applySearch("", { p: "Free" });
    else if (e.target.id === "see-latest") applySearch("", { sort: "latest" });
  });
  var totd = null;
  function paintTotd(t, label, anim) {
    totd = t;
    $("totd-label").textContent = label;
    var body = $("totd-body");
    body.innerHTML = '<div class="totd__head">' + fav(t, "lg") + '<div class="tc__id"><p class="totd__name">' + esc(t.n) + '</p><p class="totd__meta">' + esc(t.c) + " " + badge(t.p) + "</p></div></div>" +
      '<p class="totd__about">' + esc(t.d) + '</p><a class="visit btn btn--sm btn--primary" href="' + esc(t.u) + '" target="_blank" rel="noopener" id="totd-visit">Visit ' + esc(t.n) + icon("arrow-up-right", "i--xs") + "</a>";
    $("totd-details").setAttribute("data-open", t.i);
    $("totd-details").setAttribute("aria-label", "Details for " + t.n);
    if (anim && !reduce) { body.classList.remove("is-swap"); void body.offsetWidth; body.classList.add("is-swap"); }
  }
  if (TOOLS.length) {
    var now = new Date(), h = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16;
    var dayLabel = "Tool of the day · " + new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(now);
    paintTotd(TOOLS[(h >>> 0) % TOOLS.length], dayLabel);
    $("totd-shuffle").addEventListener("click", function () {
      var t; do { t = TOOLS[Math.floor(Math.random() * TOOLS.length)]; } while (t === totd && TOOLS.length > 1);
      paintTotd(t, "Random pick", true);
    });
  }

  /* ---------- categories bento (pre-rendered by build.js; rendered here when missing) ---------- */
  var bento = $("bento");
  if (!bento.querySelector("li")) {
    bento.innerHTML = CATS.map(function (c, k) {
      return '<li' + (k < 2 ? ' class="is-lg"' : k < 6 ? ' class="is-wide"' : "") + '><a class="cat" href="/category/' + slug(c) + '" data-cat="' + esc(c) + '">' + icon(CAT_ICON[c] || "blocks") + '<span class="cat__n">' + esc(c) + '</span><span class="cat__c">' + COUNT[c] + " tools</span></a></li>";
    }).join("");
  }
  bento.addEventListener("click", function (e) {
    var a = e.target.closest("[data-cat]"); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault(); applySearch("", { cat: a.getAttribute("data-cat") });
  });

  /* ---------- India section ---------- */
  var IN_TOOLS = TOOLS.filter(verified);
  $("india-list").innerHTML = IN_TOOLS.map(function (t) {
    var x = india(t);
    return '<tr><td><span class="india__tool">' + fav(t, "sm") + "<span>" + esc(t.n) + '<span class="sr-only">, ' + esc(t.c) + '</span></span></span></td><td><span class="india__facts">' +
      (x.made ? '<span class="badge badge--ok">' + icon("badge-check") + "Made in India</span>" : "") +
      x.labels.map(function (l) { return '<a href="' + esc(l.src) + '" target="_blank" rel="noopener" aria-label="' + esc(l.label) + ' — source for ' + esc(t.n) + ' (opens in a new tab)"><span class="badge badge--ok">' + icon("badge-check") + esc(l.label) + "</span></a>"; }).join("") +
      '</span></td><td><button type="button" class="btn btn--sm" data-open="' + t.i + '">Details</button></td></tr>';
  }).join("");
  $("in-count").textContent = String(IN_TOOLS.length);
  $("india-filter-go").addEventListener("click", function () { applySearch("", { india: "verified" }); });

  /* ---------- AI Tool Finder ---------- */
  var ff = $("finder-form"), fTask = $("f-task"), fOut = $("finder-results");
  if (F) $("f-feats").innerHTML = Object.keys(F.FEATURES).map(function (k) { return '<label class="check"><input type="checkbox" name="f-feat" value="' + k + '" />' + esc(F.FEATURES[k].label) + "</label>"; }).join("");
  function fErr(msg) { var e = $("f-task-err"); e.hidden = !msg; e.innerHTML = msg ? icon("triangle-alert", "i--xs") + esc(msg) : ""; fTask.setAttribute("aria-invalid", msg ? "true" : "false"); }
  function runFinder() {
    var prefs = { task: fTask.value.trim(), budget: $("f-budget").value, pricing: $("f-pricing").value, features: [].map.call(ff.querySelectorAll('input[name="f-feat"]:checked'), function (c) { return c.value; }), limit: 6 };
    if (!prefs.task && !prefs.features.length && !prefs.pricing && !prefs.budget) { fErr("Describe the task, or pick a budget, pricing model or must-have."); fTask.focus(); return null; }
    if (prefs.task.length > 300) { fErr("Keep the task under 300 characters."); fTask.focus(); return null; }
    fErr("");
    var r = F.recommend(IX, prefs), B = F.BUDGETS[r.budget] || F.BUDGETS[""];
    if (!r.results.length) {
      fOut.innerHTML = '<div class="empty">' + icon("search") + "<h3>No matches yet</h3><p>Nothing in the directory fits all of these together. Try fewer must-haves, a wider budget or a simpler task, like “Instagram posts”.</p></div>";
    } else {
      fOut.innerHTML = '<p class="finder__sum">Top <b>' + r.results.length + "</b> of <b>" + r.total + "</b> matches" + (prefs.task ? " for “" + esc(prefs.task.slice(0, 80)) + "”" : "") + (r.budget ? " · " + esc(B.label) : "") + "</p>" +
        r.results.map(function (x, k) {
          var t = x.tool;
          return '<article class="rec" data-ti="' + t.i + '"><span class="rec__rank">' + (k + 1) + '</span><div class="rec__main"><div class="rec__head">' + fav(t) + '<div class="tc__id"><h3 class="tc__name"><button type="button" class="tc__open" data-open="' + t.i + '">' + esc(t.n) + '</button></h3><p class="tc__cat">' + esc(t.c) + " · " + freeLine(t) + "</p></div>" + badge(t.p) + "</div>" +
            '<ul class="rec__why" aria-label="Why ' + esc(t.n) + ' matches">' + x.reasons.slice(0, 4).map(function (w) { return "<li>" + icon("check") + "<span>" + esc(w) + "</span></li>"; }).join("") + "</ul>" +
            '<div class="rec__acts"><a class="btn btn--sm btn--primary" href="' + esc(t.u) + '" target="_blank" rel="noopener">Visit' + icon("arrow-up-right", "i--xs") + '</a><button type="button" class="btn btn--sm" data-open="' + t.i + '">Details</button><button type="button" class="btn btn--sm btn--ghost" data-cmp="' + t.i + '" aria-pressed="' + (cmp.indexOf(t.n) > -1) + '">' + icon("git-compare-arrows", "i--sm") + "Compare</button></div></div></article>";
        }).join("");
    }
    var note = $("finder-note").querySelector("span");
    note.textContent = r.notes[0] || "Budget maps to pricing models only: the directory does not hold INR prices. Always confirm plans on the official site.";
    return r;
  }
  ff.addEventListener("submit", function (e) { e.preventDefault(); var r = runFinder(); if (r && innerWidth < 1024) scrollToEl(fOut); });
  ff.addEventListener("reset", function () { fErr(""); setTimeout(function () { fOut.innerHTML = '<div class="finder__empty">' + icon("wand-sparkles", "i--lg") + "<p>Your matches appear here, ranked, each with the reasons it was picked.</p></div>"; }, 0); });
  [].forEach.call(doc.querySelectorAll("[data-eg]"), function (b) { b.addEventListener("click", function () { fTask.value = b.getAttribute("data-eg"); runFinder(); }); });
  fTask.addEventListener("keydown", function (e) { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); ff.requestSubmit ? ff.requestSubmit() : runFinder(); } });

  /* ---------- suggest a tool (validated, then a prefilled GitHub issue) ---------- */
  var sf = $("submit-form"), sCat = $("s-cat");
  sCat.innerHTML = '<option value="">Choose a category</option>' + CATS.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("") + '<option value="Other / new category">Other / new category</option>';
  var HOSTS = {}; TOOLS.forEach(function (t) { var d = domain(t.u); if (d) HOSTS[d + new URL(t.u).pathname.replace(/\/$/, "")] = t; });
  function setErr(id, msg) { var el = $(id + "-err"), inp = $(id); el.hidden = !msg; el.innerHTML = msg ? icon("triangle-alert", "i--xs") + msg : ""; inp.setAttribute("aria-invalid", msg ? "true" : "false"); return !msg; }
  function sValues() {
    var pr = sf.querySelector('input[name="pricing"]:checked');
    return { name: $("s-name").value.trim(), url: $("s-url").value.trim(), cat: sCat.value, pricing: pr ? pr.value : "Not sure", what: $("s-what").value.trim(), why: $("s-why").value.trim() };
  }
  function sValidate(v, only) {
    var ok = true, first = null;
    function chk(id, msg) { if (only && id !== only) { if (msg && ok) { ok = false; first = id; } return; } if (!setErr(id, msg) && ok) { ok = false; first = id; } }
    var dupName = v.name && byName[Object.keys(byName).filter(function (n) { return n.toLowerCase() === v.name.toLowerCase(); })[0]];
    chk("s-name", !v.name ? "Enter the tool's name." : v.name.length < 2 ? "The name looks too short." : dupName ? esc(dupName.n) + ' is already listed. <button type="button" class="linkbtn" data-open="' + dupName.i + '">See it</button>' : "");
    var u = null; try { u = new URL(v.url); } catch (e) { u = null; }
    var dupUrl = u && HOSTS[u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, "")];
    chk("s-url", !v.url ? "Enter the official website." : !u || !/^https?:$/.test(u.protocol) || u.hostname.indexOf(".") < 0 ? "Enter a full web address starting with https://" : u.protocol !== "https:" ? "Use the https:// address of the official site." : dupUrl ? "This website is already listed as " + esc(dupUrl.n) + "." : "");
    chk("s-cat", !v.cat ? "Choose a category." : "");
    chk("s-what", !v.what ? "Describe what the tool does in one line." : v.what.length < 20 ? "Add a little more detail (at least 20 characters)." : "");
    return { ok: ok, first: first };
  }
  function sBody(v) { return "Tool name: " + v.name + "\nOfficial website: " + v.url + "\nCategory: " + v.cat + "\nPricing: " + v.pricing + "\nWhat it does: " + v.what + "\nWhy it suits Indian businesses: " + (v.why || "Not given") + "\n\nSubmitted with the Suggest a tool form on " + SITE + "/\n"; }
  function sUrl(v) { return ISSUES + "?title=" + encodeURIComponent("Tool suggestion: " + v.name) + "&body=" + encodeURIComponent(sBody(v)); }
  function copyText(s) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(s).then(function () { return true; }, function () { return legacyCopy(s); });
    return Promise.resolve(legacyCopy(s));
  }
  function legacyCopy(s) { var ta = doc.createElement("textarea"); ta.value = s; ta.setAttribute("readonly", ""); ta.className = "sr-only"; doc.body.appendChild(ta); ta.select(); var ok = false; try { ok = doc.execCommand("copy"); } catch (e) { ok = false; } ta.remove(); return ok; }
  sf.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = sValues(), r = sValidate(v);
    if (!r.ok) { $(r.first).focus(); return; }
    var url = sUrl(v);
    sf.setAttribute("data-issue-url", url);
    $("submit-out").innerHTML = '<div class="sform__ok"><b>' + icon("circle-check") + "Your GitHub issue is ready</b><span>A new tab opens with everything filled in. Review it and press Submit new issue on GitHub. If the tab didn't open, use the link below.</span>" +
      '<span><a href="' + esc(url) + '" target="_blank" rel="noopener" id="s-issue-link">Open the prefilled issue on GitHub</a></span></div>';
    window.open(url, "_blank", "noopener");
  });
  $("s-copy").addEventListener("click", function () {
    var v = sValues();
    if (!v.name && !v.url && !v.what) { toast("Fill in the form first", "info"); $("s-name").focus(); return; }
    copyText("Tool suggestion: " + (v.name || "") + "\n\n" + sBody(v)).then(function (ok) { if (ok) sfx("success"); toast(ok ? "Details copied. Paste them into a new GitHub issue." : "Couldn't copy. Select the text and copy it manually.", ok ? "copy" : "info"); });
  });
  // re-check a field as soon as it is fixed (input/change, not blur, so the layout never shifts under a click)
  ["s-name", "s-url", "s-cat", "s-what"].forEach(function (id) { $(id).addEventListener(id === "s-cat" ? "change" : "input", function () { if ($(id).getAttribute("aria-invalid") === "true") sValidate(sValues(), id); }); });

  /* ---------- start ---------- */
  var tp = new URLSearchParams(location.search).get("tool");
  readURL();
  paintSaved(); paintCmp(); paintRecent(); paintTab("featured");
  dGrid.classList.remove("is-swap");
  render();
  if (tp && BY_SLUG[tp]) openTool(BY_SLUG[tp], qIn);
  if (location.search && /[?&](q|cat|price|india|job|sort|page)=/.test(location.search) && !location.hash) setTimeout(function () { scrollToEl($("tools")); }, 50);
  root.classList.add("is-ready");
  window.AITH = { version: "3.0", state: S, results: results, recommend: function (p) { return F.recommend(IX, p); } };
  if (window.console && console.log) console.log("%cAI Tools Hub%c v3.0\nBuilt by J. Venkata Sai Kumar\nFound a bug? https://github.com/Saikumar8125/AI-TOOLS-HUB/issues", "font:600 15px sans-serif", "color:inherit");
})();
