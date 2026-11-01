/* Extracted verbatim from index.html inline <script> (Phase 1B). */
(function () {
  "use strict";
  var track = document.getElementById("cc-track"), vp = document.getElementById("cc-vp"), pills = document.getElementById("cat-pills");
  if (!track || !vp || !pills) return;

  var G = {};
  var FALL = [["#6e5a30", "#2e2615"], ["#2a2925", "#121212"], ["#5a4527", "#241b10"], ["#1d4337", "#0f2a24"]];
  var I = {
    "Chatbots": '<path d="M4 5h16v11H9l-5 4z"/>', "Study": '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    "Research": '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>', "Writing": '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    "Coding": '<path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/>', "No-Code": '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/>',
    "Image": '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>', "Photo Edit": '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    "Design": '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3h3a4 4 0 0 0 4-4c0-5-4-9-9-9z"/><circle cx="7.5" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="11" r="1"/>',
    "PPT": '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8M8 12V9M12 12V7M16 12v-2"/>', "Video": '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',
    "Avatar": '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', "Audio": '<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>',
    "Music": '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>', "Transcription": '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    "Translation": '<path d="M3 5h10M8 3v2M5 5c1 4 4 7 7 8M11 5c-1 4-4 7-7 8"/><path d="m13 21 4-9 4 9M14.5 18h5"/>', "Resume & Jobs": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18"/>',
    "Productivity": '<path d="m4 12 5 5L20 6"/>', "Automation": '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    "Marketing": '<path d="M3 10v4l12 5V5z"/><path d="M15 9a3 3 0 0 1 0 6M7 15l1 5h3l-1-4"/>', "Business": '<path d="M3 20h18M5 20V9M10 20V5M15 20v-8M20 20v-5"/>',
    "Data & Sheets": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>', "3D & Gaming": '<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    "Health & Life": '<path d="M12 20s-8-5-8-11a4 4 0 0 1 8-2 4 4 0 0 1 8 2c0 6-8 11-8 11z"/>', "Prompts & Learning AI": '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    "Browser & Search": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
  };
  var DEF = '<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>';
  window.XCatIcons = I; window.XCatIconDef = DEF;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function build() {
    var cats = [].slice.call(pills.querySelectorAll("[data-cat]")).map(function (b) { return b.getAttribute("data-cat"); }).filter(Boolean);
    if (!cats.length) return false;
    function set(hidden) {
      return '<ul class="x-cc__set"' + (hidden ? ' aria-hidden="true"' : "") + ">" + cats.map(function (c, i) {
        var g = G[c] || FALL[i % FALL.length];
        return '<li><a class="x-cc__card" href="#tools" data-cat="' + esc(c) + '" style="--a:' + g[0] + ";--b:" + g[1] + '"' + (hidden ? ' tabindex="-1"' : "") + ' aria-label="Show ' + esc(c) + ' tools">' +
          '<span class="x-cc__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#e6d3a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (I[c] || DEF) + "</svg></span>" +
          '<span class="x-cc__arr" aria-hidden="true">→</span><span class="x-cc__name">' + esc(c) + "</span></a></li>";
      }).join("") + "</ul>";
    }
    track.innerHTML = set(false) + set(true);
    return true;
  }
  if (!build()) {
    var mo = new MutationObserver(function () { if (build()) mo.disconnect(); });
    mo.observe(pills, { childList: true });
  }
  track.addEventListener("click", function (e) {
    var a = e.target.closest(".x-cc__card"); if (!a) return;
    var c = a.getAttribute("data-cat");
    var pill = [].slice.call(pills.querySelectorAll("[data-cat]")).filter(function (b) { return b.getAttribute("data-cat") === c; })[0];
    if (!pill) return;

    pill.scrollIntoView = function () { pills.scrollLeft = pill.offsetLeft - (pills.clientWidth - pill.offsetWidth) / 2; };
    pill.click();
    delete pill.scrollIntoView;

  });

  var t;
  function pause() { clearTimeout(t); vp.classList.add("is-paused"); }
  function resume() { clearTimeout(t); t = setTimeout(function () { vp.classList.remove("is-paused"); }, 2500); }
  vp.addEventListener("touchstart", pause, { passive: true });
  vp.addEventListener("touchend", resume, { passive: true });
  vp.addEventListener("touchcancel", resume, { passive: true });
})();
