// Static page generator for AI Tools Hub.
// Runs on every Vercel deploy (see vercel.json): copies the site into public/
// and writes one page per tool, category and guide (guides.js), index pages and the sitemap.
// Tools come from data.js, so editing data.js is still the only step needed.
// Local run: node build.js
"use strict";
const fs = require("fs");
const path = require("path");

const SITE = "https://aitoolshub-in.vercel.app";
const OUT = path.join(__dirname, "public");
const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = TODAY.slice(0, 4);
const GUIDES_PUBLISHED = "2026-10-27"; // change only when guides are really re-checked
const SKIP = new Set(["public", "node_modules", "build.js", "guides.js", "vercel.json", "package.json", ".git", ".github", ".vercel", "CHANGELOG.md", "README.md", "LICENSE", "package-lock.json", "test-results", "playwright-report", "MASTER_PROMPT.txt", "AUDIT.md", "SFX-LICENSES.md"]);

// data
global.window = {};
require("./data.js");
require("./guides.js");
const TOOLS = window.AITH_TOOLS;
const DESC = window.AITH_DESC || {};
const GUIDES = window.AITH_GUIDES || [];
const guidesByTool = {};
GUIDES.forEach((g) => g.sec.forEach((x) => x.tools.forEach((n) => { (guidesByTool[n] = guidesByTool[n] || new Set()).add(g); })));
const titleCase = (x) => x.replace(/^./, (c) => c.toUpperCase());
const icon = (n, cls) => `<svg class="i${cls ? " " + cls : ""}" aria-hidden="true"><use href="/icons.svg#i-${n}"/></svg>`;
const LINK_CHECK = "27 Oct 2026"; // last full link check (see README); change only after a real full re-check
const INDIA_CHECK = "11 Oct 2026"; // India facts in index.html #india-data were verified on official pages on this date
const THEME_INIT = '<script>(function(r){var t=null;try{t=localStorage.getItem("aith-theme")}catch(e){}if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";r.setAttribute("data-theme",t)})(document.documentElement)</script>';
const ISSUE_SUGGEST = "https://github.com/Saikumar8125/AI-TOOLS-HUB/issues/new?title=Tool%20suggestion%3A%20&body=Tool%20name%3A%0AOfficial%20website%20(https)%3A%0ACategory%3A%0APricing%20(Free%20%2F%20Freemium%20%2F%20Paid)%3A%0AWhat%20it%20does%20(one%20line)%3A%0AWhy%20it%20suits%20Indian%20small%20businesses%3A%0A";
const ISSUE_PROBLEM = "https://github.com/Saikumar8125/AI-TOOLS-HUB/issues/new?title=Problem%20report%3A%20&body=Page%20or%20tool%3A%0AWhat%20is%20wrong%20(link%20%2F%20pricing%20%2F%20other)%3A%0AWhat%20it%20should%20be%20(with%20official%20source%20link)%3A%0A";
// Legal pages (v3.1): static files in the repo root, copied to public/ by the copy loop below, linked in every footer and listed in the sitemap.
const LEGAL = [["privacy.html", "Privacy Policy"], ["terms.html", "Terms &amp; Conditions"], ["cookies.html", "Cookie Policy"], ["copyright.html", "Copyright &amp; Trademarks"], ["disclaimer.html", "Third-Party Disclaimer"], ["contact.html", "Contact &amp; Grievances"]];
const LEGAL_NAV = `<nav class="foot__legal" aria-label="Legal"><h2 class="foot__h">Legal</h2><ul>${LEGAL.map(([f, l]) => `<li><a href="/${f}">${l}</a></li>`).join("")}</ul></nav>`;
const missingLegal = LEGAL.map((x) => x[0]).filter((f) => !fs.existsSync(path.join(__dirname, f)));
if (missingLegal.length) throw new Error("Missing legal page(s) in the repo root: " + missingLegal.join(", ") + ". Upload them before deploying (they are linked from every footer).");
const home = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
let INDIA = {};
try { INDIA = JSON.parse((home.match(/id="india-data">([\s\S]*?)<\/script>/) || [])[1] || "{}"); } catch (e) { INDIA = {}; }
const IN_LABELS = { inr: "INR pricing", upi: "UPI payments", gst: "GST invoices", lang: "Indian-language support" };

const INTRO = {
  "Chatbots": "General AI assistants for writing, questions, research and everyday help.",
  "Study": "AI tools that help students learn faster: notes, flashcards, homework help and exam prep.",
  "Research": "AI tools for finding, reading and summarising papers, reports and sources.",
  "Writing": "AI writers for blogs, product descriptions, emails, ads and grammar fixes.",
  "Coding": "AI coding assistants and app builders for developers and beginners.",
  "No-Code": "Build websites, apps and internal tools with AI, without writing code.",
  "Image": "AI image generators for product shots, posters, social posts and art.",
  "Photo Edit": "Remove backgrounds, enhance, upscale and retouch photos with AI.",
  "Design": "AI design tools for logos, banners, brand kits and social creatives.",
  "PPT": "Make presentations and pitch decks in minutes with AI.",
  "Video": "AI video makers and editors for reels, ads, shorts and explainers.",
  "Avatar": "AI avatar and talking-head video tools for training, sales and marketing.",
  "Audio": "AI voice generators, voice cloning and audio clean-up tools.",
  "Music": "Create songs, background music and jingles with AI.",
  "Transcription": "Turn meetings, calls and videos into text and notes with AI.",
  "Translation": "AI translation for documents, websites, videos and chats.",
  "Resume & Jobs": "AI resume builders, cover letters and interview practice tools.",
  "Productivity": "AI tools for notes, email, calendars, tasks and meetings.",
  "Automation": "Automate repetitive work across apps with AI workflows and agents.",
  "Marketing": "AI tools for SEO, social media, ads and email marketing.",
  "Business": "AI tools for sales, customer support, accounting and operations.",
  "Data & Sheets": "AI for spreadsheets, formulas, dashboards and data analysis.",
  "3D & Gaming": "Generate 3D models, game assets and worlds with AI.",
  "Health & Life": "AI tools for fitness, food, travel and everyday life.",
  "Prompts & Learning AI": "Learn AI and write better prompts with these courses and libraries.",
  "Browser & Search": "AI search engines and browser assistants."
};

// helpers
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slugify = (s) => String(s).toLowerCase().replace(/&/g, " and ").replace(/['’.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tool";
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
const priceText = { Free: "Free", Freemium: "Free plan + paid upgrades", Paid: "Paid" };

// unique slugs
const used = new Set();
TOOLS.forEach((t) => {
  let s = slugify(t.n), base = s, i = 2;
  while (used.has(s)) s = base + "-" + i++;
  used.add(s); t.slug = s;
});
const CATS = [];
const byCat = {};
TOOLS.forEach((t) => { if (!byCat[t.c]) { byCat[t.c] = []; CATS.push(t.c); } byCat[t.c].push(t); });
const catSlug = (c) => slugify(c);

// layout
function page(o) {
  const ld = (o.ld || []).map((x) => '<script type="application/ld+json">' + JSON.stringify(x).replace(/</g, "\\u003c") + "</script>").join("\n");
  return `<!doctype html>
<html lang="en-IN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${THEME_INIT}
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${SITE}${o.path}">
<meta name="theme-color" content="#fafaf9">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AI Tools Hub">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${SITE}${o.path}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${SITE}/og-image.png">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/ds.css">
<link rel="stylesheet" href="/pages.css">
${ld}
</head>
<body${o.bodyClass ? ` class="${o.bodyClass}"` : ""}${o.tool ? ` data-tool="${esc(o.tool)}"` : ""}>
<a class="skip" href="#main">Skip to content</a>
${o.pre || ""}
${topbar(o.nav)}
<main id="main">
${o.body}
</main>
${footer()}
<script src="/sfx.js" defer></script>
<script src="/pages.js" defer></script>
</body>
</html>
`;
}

function topbar(cur) {
  const a = (href, label, key) => `<a href="${href}"${cur === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="topbar"><div class="wrap">
<a class="brand" href="/" aria-label="AI Tools Hub home"><img src="/icon.svg" width="28" height="28" alt=""><b>AI Tools Hub</b></a>
<nav class="toplinks" aria-label="Main">${a("/#tools", "Directory", "dir")}${a("/#finder", "Tool Finder", "finder")}${a("/categories", "Categories", "cats")}${a("/guides", "Guides", "guides")}${a("/d2c.html", "D2C · India", "d2c")}<button class="sbtn" type="button" data-search aria-label="Search tools, guides and categories">${icon("search", "i--sm")}<span>Search</span><kbd class="kbd">/</kbd></button><button class="tbtn" type="button" data-sound-toggle aria-pressed="false" aria-label="Sound effects" title="Sound off">${icon("volume-x", "snd-off")}${icon("volume-2", "snd-on")}</button><button class="tbtn" type="button" data-theme-toggle aria-label="Switch theme">${icon("sun", "theme-sun")}${icon("moon", "theme-moon")}</button></nav>
</div></header>`;
}
function footer() {
  return `<footer class="foot"><div class="wrap">
<div class="foot__grid">
<div><a class="brand" href="/" aria-label="AI Tools Hub home"><img src="/icon.svg" width="28" height="28" alt="" loading="lazy"><b>AI Tools Hub</b></a><p>${TOOLS.length} hand-picked AI tools in ${CATS.length} categories, curated for Indian small businesses. Every link goes to the official site.</p></div>
<nav aria-label="Guides"><h2 class="foot__h">Guides</h2><ul>${GUIDES.slice(0, 6).map((g) => `<li><a href="/guides/${g.s}">${esc(titleCase(g.who))}</a></li>`).join("")}<li><a href="/guides">All ${GUIDES.length + 3} guides</a></li></ul></nav>
<nav aria-label="Browse"><h2 class="foot__h">Browse</h2><ul><li><a href="/#tools">Directory</a></li><li><a href="/#finder">Tool Finder</a></li><li><a href="/categories">All categories</a></li><li><a href="/all-tools">All tools A–Z</a></li><li><a href="/d2c.html">D2C tools for Indian sellers</a></li><li><a href="/category/chatbots">Chatbots</a></li><li><a href="/category/writing">Writing</a></li><li><a href="/category/video">Video</a></li><li><a href="/category/marketing">Marketing</a></li></ul></nav>
${LEGAL_NAV}
</div>
<div class="foot__base"><p>Built for Indian SMBs · © ${YEAR} AI Tools Hub · Links checked ${LINK_CHECK} · <a href="${ISSUE_SUGGEST}" target="_blank" rel="noopener">Suggest a tool</a> · <a href="${ISSUE_PROBLEM}" target="_blank" rel="noopener">Report a problem</a> · <a href="https://github.com/Saikumar8125/AI-TOOLS-HUB" target="_blank" rel="noopener">Source on GitHub</a></p></div>
</div></footer>`;
}
const favicon = (t, cls) => `<span class="fav${cls ? " " + cls : ""}" aria-hidden="true"><span class="fav__l">${esc(t.n.charAt(0).toUpperCase())}</span><img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host(t.u))}&amp;sz=64" alt="" width="32" height="32" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()"></span>`;
const freeLine = (t) => t.p === "Free" ? "Free to use" : t.p === "Freemium" ? "Free plan available" : "No free plan listed";
const crumbs = (items) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x[0], item: SITE + x[1] }))
});
const crumbHtml = (items) => '<nav class="crumbs" aria-label="Breadcrumb">' + items.map((x, i) => i < items.length - 1 ? `<a href="${x[1]}">${esc(x[0])}</a>` : `<span aria-current="page">${esc(x[0])}</span>`).join('<span class="sep" aria-hidden="true">/</span>') + "</nav>";
const badge = (p) => `<span class="badge badge--${p.toLowerCase()}">${esc(p)}</span>`;
function card(t) {
  const d = DESC[t.n] || {};
  return `<li class="card"><div class="card__top"><div class="card__id">${favicon(t)}<h3><a href="/tools/${t.slug}">${esc(t.n)}</a></h3></div>${badge(t.p)}</div><p>${esc(d.d || t.c + " tool")}</p></li>`;
}
function guideCard(t, g) {
  const d = DESC[t.n] || {};
  const why = g.why && g.why[t.n];
  const price = g.price && g.price[t.n];
  return `<li class="card"><div class="card__top"><div class="card__id">${favicon(t)}<h3><a href="/tools/${t.slug}">${esc(t.n)}</a></h3></div>${badge(t.p)}</div><p>${esc(d.d || t.c + " tool")}</p>${why ? `<p class="why"><strong>Why it fits:</strong> ${esc(why)}</p>` : ""}${price ? `<p class="why"><strong>Price:</strong> ${esc(price)}</p>` : ""}</li>`;
}
function faqLd(qs) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qs.map((q) => ({ "@type": "Question", name: q[0], acceptedAnswer: { "@type": "Answer", text: q[1] } })) };
}
const faqHtml = (qs) => '<section class="faq"><h2>FAQ</h2>' + qs.map((q) => `<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join("") + "</section>";

const mix = (n) => { const parts = ["Free", "Freemium", "Paid"].filter((k) => n[k]).map((k) => n[k] + " " + k.toLowerCase()); return parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1] : parts.join(""); };

// tool pages
function toolPage(t) {
  const d = DESC[t.n] || {};
  const about = d.d || `${t.n} is an AI tool in the ${t.c} category.`;
  const india = INDIA[t.n] || {};
  const inl = Object.keys(india.l || {}).filter((k) => IN_LABELS[k]);
  // Three India statuses: Verified for India / India availability not verified / Not available in India (only with a confirmed source in india.x.src)
  const inOk = inl.length > 0 || !!india.m;
  const naSrc = !inOk && india.x && india.x.src ? india.x.src : "";
  const inBadge = inOk ? `<span class="badge badge--ok">${icon("badge-check")}Verified for India</span>` : naSrc ? `<span class="badge badge--no">${icon("x")}Not available in India</span>` : `<span class="badge badge--line badge--muted">India availability not verified</span>`;
  const alts = byCat[t.c].filter((x) => x !== t);
  const same = alts.filter((x) => x.p === t.p);
  const pick = same.concat(alts.filter((x) => x.p !== t.p)).slice(0, 8);
  const cpath = "/category/" + catSlug(t.c);
  const free = t.p === "Free" ? `Yes. ${t.n} is free to use.` : t.p === "Freemium" ? `${t.n} has a free plan, with paid plans for more usage or features. Check the official site for current prices.` : `${t.n} is a paid tool. Check the official site for current plans and any free trial.`;
  const qs = [
    [`Is ${t.n} free?`, free],
    [`What is ${t.n} used for?`, about],
    [`What are the best ${t.n} alternatives?`, pick.length ? `Popular alternatives in ${t.c} include ${pick.slice(0, 4).map((x) => x.n).join(", ")}.` : `See the ${t.c} category for similar tools.`]
  ];
  if (inl.length || india.m) qs.push([`Does ${t.n} work for Indian businesses?`, [india.m ? `${t.n} is made in India.` : "", inl.length ? `Verified on its official pages: ${inl.map((k) => IN_LABELS[k]).join(", ")}.` : ""].join(" ").trim()]);
  const title = `${t.n}: Features, Pricing & Alternatives (${YEAR}) | AI Tools Hub`;
  const desc = `${about} ${priceText[t.p]}. Compare ${t.n} with ${pick.length} similar ${t.c} AI tools.`.slice(0, 300);
  const crumbItems = [["Home", "/"], [t.c, cpath], [t.n, "/tools/" + t.slug]];
  const app = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: t.n, url: t.u, applicationCategory: t.c, operatingSystem: "Web", description: about };
  if (t.p === "Free") app.offers = { "@type": "Offer", price: "0", priceCurrency: "INR" };
  const gl = [...(guidesByTool[t.n] || [])];
  const feat = gl.length ? `<section class="wrap"><h2>Where ${esc(t.n)} fits</h2><p class="lead">Picked in these guides for Indian businesses.</p><ul class="chips">${gl.slice(0, 8).map((g) => `<li><a href="/guides/${g.s}">${esc(titleCase(g.who))}</a></li>`).join("")}${gl.length > 8 ? `<li><a href="/guides">+${gl.length - 8} more guides</a></li>` : ""}</ul></section>` : "";
  const indiaRows = (india.m ? `<div><dt>Origin</dt><dd>Made in India <span class="badge badge--ok">${icon("badge-check")}verified</span></dd></div>` : "") + inl.map((k) => `<div><dt>${esc(IN_LABELS[k])}</dt><dd>Verified <a href="${esc(india.l[k])}" target="_blank" rel="noopener">source</a></dd></div>`).join("");
  const body = `<article class="wrap hero">
${crumbHtml(crumbItems)}
<div class="th">${favicon(t)}<h1>${esc(t.n)}</h1></div>
<p class="sub">${esc(about)}</p>
<p class="pagemeta">${badge(t.p)}<span>${esc(freeLine(t))}</span><a href="${cpath}">${esc(t.c)}</a>${host(t.u) ? `<span>${esc(host(t.u))}</span>` : ""}${inBadge}</p>
<div class="acts"><a class="btn btn--primary" href="${esc(t.u)}" target="_blank" rel="noopener">Visit ${esc(t.n)}${icon("arrow-up-right", "i--sm")}</a><button class="btn" type="button" data-save aria-pressed="false" hidden>${icon("heart", "i--sm")}<span>Save</span></button><a class="btn btn--ghost" href="/?q=${encodeURIComponent(t.c)}#tools">Search similar tools</a></div>
</article>
<div class="wrap grid2">
<section class="panel"><h2>Key features</h2>${(d.b && d.b.length) ? "<ul class=\"ticks\">" + d.b.map((x) => `<li>${esc(x)}</li>`).join("") + "</ul>" : `<p class="muted">See the official site for features.</p>`}</section>
<section class="panel"><h2>Quick facts <span class="badge badge--line">directory data · links checked ${LINK_CHECK}</span></h2><dl class="facts"><div><dt>Category</dt><dd><a href="${cpath}">${esc(t.c)}</a></dd></div><div><dt>Pricing</dt><dd>${esc(priceText[t.p])}</dd></div><div><dt>Free plan</dt><dd>${esc(freeLine(t))}</dd></div>${host(t.u) ? `<div><dt>Official site</dt><dd><a href="${esc(t.u)}" target="_blank" rel="noopener">${esc(host(t.u))}</a></dd></div>` : ""}<div><dt>Platforms</dt><dd class="unv">Not verified — check official site</dd></div></dl></section>
</div>
<div class="wrap"><section class="panel panel--sp"><h2>India availability ${inBadge}</h2>${indiaRows ? `<dl class="facts">${indiaRows}</dl><p class="muted small">Confirmed on official pages, ${INDIA_CHECK}.</p>` : naSrc ? `<p class="muted">Confirmed not available in India${india.x.d ? ` (${esc(india.x.d)})` : ""}. <a href="${esc(naSrc)}" target="_blank" rel="noopener">Source</a></p>` : `<p class="muted">India availability not verified — check official site. We haven't confirmed INR pricing, UPI payments, GST invoices or Indian-language support for ${esc(t.n)} on its official pages.</p>`}<p class="muted small report"><a href="${esc(reportUrl(t))}" target="_blank" rel="noopener">Report a wrong link or price</a></p></section></div>
${feat}
${pick.length ? `<section class="wrap"><h2>Alternatives to ${esc(t.n)}</h2><ul class="cards">${pick.map(card).join("")}</ul><p class="more"><a href="${cpath}">All ${byCat[t.c].length} ${esc(t.c)} AI tools</a></p></section>` : ""}
<div class="wrap">${faqHtml(qs)}</div>
<div class="visitbar"><b>${esc(t.n)}</b><a class="btn btn--primary btn--sm" href="${esc(t.u)}" target="_blank" rel="noopener">Visit${icon("arrow-up-right", "i--xs")}</a></div>`;
  return page({ title, desc, path: "/tools/" + t.slug, body, bodyClass: "has-visitbar", tool: t.n, ld: [app, crumbs(crumbItems), faqLd(qs)] });
}

// category pages
function catPage(c) {
  const list = byCat[c];
  const n = { Free: 0, Freemium: 0, Paid: 0 };
  list.forEach((t) => n[t.p]++);
  const sorted = list.slice();
  const p = "/category/" + catSlug(c);
  const title = `${list.length} Best AI ${c} Tools (${YEAR}): Free & Paid | AI Tools Hub`;
  const intro = INTRO[c] || `AI tools in the ${c} category.`;
  const desc = `${intro} ${list.length} hand-picked tools: ${mix(n)}. Curated for Indian small businesses.`;
  const freeList = sorted.filter((t) => t.p === "Free").slice(0, 5).map((t) => t.n);
  const qs = [
    [`What are the best free AI ${c} tools?`, freeList.length ? `Free picks include ${freeList.join(", ")}.` : `Most ${c} tools here are freemium: they have a free plan with paid upgrades.`],
    [`How many AI ${c} tools are listed?`, `${list.length} tools: ${mix(n)}.`]
  ];
  const crumbItems = [["Home", "/"], ["Categories", "/categories"], [c, p]];
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: `AI ${c} tools`, numberOfItems: list.length, itemListElement: sorted.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: SITE + "/tools/" + t.slug, name: t.n })) };
  const groups = ["Free", "Freemium", "Paid"].filter((k) => n[k]).map((k) => `<h2 class="group">${k} <span class="muted">(${n[k]})</span></h2><ul class="cards">${sorted.filter((t) => t.p === k).map(card).join("")}</ul>`).join("");
  const body = `<div class="wrap hero">
${crumbHtml(crumbItems)}
<h1>Best AI ${esc(c)} tools</h1>
<p class="sub">${esc(intro)}</p>
<ul class="stats"><li><b>${list.length}</b> tools</li>${["Free", "Freemium", "Paid"].filter((k) => n[k]).map((k) => `<li><b>${n[k]}</b> ${k.toLowerCase()}</li>`).join("")}</ul>
</div>
<section class="wrap">${groups}</section>
<section class="wrap"><p class="more"><a class="btn" href="/?cat=${catSlug(c)}#tools">${icon("sliders-horizontal", "i--sm")}Filter ${esc(c)} in the directory</a></p><h2>Other categories</h2><ul class="chips">${CATS.filter((x) => x !== c).map((x) => `<li><a href="/category/${catSlug(x)}">${esc(x)}</a></li>`).join("")}</ul></section>
<div class="wrap">${faqHtml(qs)}</div>`;
  return page({ title, desc, path: p, body, nav: "cats", ld: [itemList, crumbs(crumbItems), faqLd(qs)] });
}

function categoriesPage() {
  const body = `<div class="wrap hero">${crumbHtml([["Home", "/"], ["Categories", "/categories"]])}
<h1>AI tools by category</h1>
<p class="sub">Every category in the directory, with free, freemium and paid tools for Indian small businesses.</p>
<ul class="stats"><li><b>${CATS.length}</b> categories</li><li><b>${TOOLS.length}</b> tools</li></ul></div>
<section class="wrap"><ul class="cards">${CATS.map((c) => `<li class="card"><div class="card__top"><h3><a href="/category/${catSlug(c)}">${esc(c)}</a></h3><span class="muted">${byCat[c].length}</span></div><p>${esc(INTRO[c] || "")}</p></li>`).join("")}</ul></section>`;
  return page({ title: `AI Tools by Category (${CATS.length}) | AI Tools Hub`, desc: `Browse ${TOOLS.length} AI tools in ${CATS.length} categories: chatbots, writing, video, design, marketing, business and more.`, path: "/categories", body, nav: "cats", ld: [crumbs([["Home", "/"], ["Categories", "/categories"]])] });
}

function allToolsPage() {
  const sorted = TOOLS.slice().sort((a, b) => a.n.localeCompare(b.n, "en", { sensitivity: "base" }));
  const letters = {};
  sorted.forEach((t) => { const L = /[a-z]/i.test(t.n[0]) ? t.n[0].toUpperCase() : "#"; (letters[L] = letters[L] || []).push(t); });
  const body = `<div class="wrap hero">${crumbHtml([["Home", "/"], ["All tools", "/all-tools"]])}
<h1>All AI tools A–Z</h1>
<p class="sub">${TOOLS.length} tools with category and pricing. Search, filter and compare them in the <a href="/#tools">interactive directory</a>.</p></div>
<section class="wrap az">${Object.keys(letters).map((L) => `<h2 class="group">${L}</h2><ul class="azlist">${letters[L].map((t) => `<li><a href="/tools/${t.slug}">${esc(t.n)}</a> <span class="muted">${esc(t.c)} · ${esc(t.p)}</span></li>`).join("")}</ul>`).join("")}</section>`;
  return page({ title: `All ${TOOLS.length} AI Tools A–Z | AI Tools Hub`, desc: `Full A–Z list of ${TOOLS.length} AI tools with category and pricing (free, freemium, paid).`, path: "/all-tools", body, nav: "dir", ld: [crumbs([["Home", "/"], ["All tools", "/all-tools"]])] });
}

// guide pages
const byName = {};
TOOLS.forEach((t) => { byName[t.n] = t; });
function guidePage(g) {
  const p = "/guides/" + g.s;
  const title = `${g.t} (${YEAR}) | AI Tools Hub`;
  const desc = (g.i.split(". ")[0] + ". Hand-picked free and paid AI tools for " + g.who + ", with an Indian focus.").slice(0, 300);
  const crumbItems = [["Home", "/"], ["Guides", "/guides"], [g.t, p]];
  const secs = g.sec.map((x, i) => `<section class="gsec" id="s${i + 1}"><h2><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(x.h)}</h2><p class="lead">${esc(x.p)}</p><ul class="cards${x.tools.length === 4 || x.tools.length === 2 ? " cards--2" : ""}">${x.tools.map((n) => byName[n]).filter(Boolean).map((t) => guideCard(t, g)).join("")}</ul></section>`).join("");
  const toc = `<nav class="toc" aria-label="On this page">${g.sec.map((x, i) => `<a href="#s${i + 1}">${esc(x.h)}</a>`).join("")}</nav>`;
  const glance = `<section class="panel glance"><h2>Top picks at a glance</h2><ol>${g.sec.map((x) => { const f = byName[x.tools[0]]; return f ? `<li><span>${esc(x.h)}</span><a href="/tools/${f.slug}">${esc(f.n)}</a></li>` : ""; }).join("")}</ol></section>`;
  const others = GUIDES.filter((x) => x !== g).map((x) => `<li><a href="/guides/${x.s}">${esc(x.who.replace(/^./, (c) => c.toUpperCase()))}</a></li>`).join("");
  const art = { "@context": "https://schema.org", "@type": "Article", headline: g.t, description: desc, datePublished: g.d || GUIDES_PUBLISHED, dateModified: g.d || GUIDES_PUBLISHED, author: { "@type": "Person", name: "J. Venkata Sai Kumar" }, publisher: { "@type": "Organization", name: "AI Tools Hub" }, image: SITE + "/og-image.png", mainEntityOfPage: SITE + p };
  const body = `<div class="wrap hero">
${crumbHtml(crumbItems)}
<h1>${esc(g.t)}</h1>
<p class="sub">${esc(g.i)}</p>
<p class="pagemeta">Guide for ${esc(g.who)} · Published ${new Date(g.d || GUIDES_PUBLISHED).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · Tools from our directory of ${TOOLS.length}</p>
</div>
${toc}
<div class="wrap">${glance}${secs}
<section class="panel"><h2>Start this week</h2><ol class="steps">${g.tip.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></section>
${faqHtml(g.faq)}
<section><h2>More guides</h2><ul class="chips">${others}</ul></section>
</div>`;
  return page({ title, desc, path: p, body, nav: "guides", pre: '<div class="progress" aria-hidden="true"><i></i></div>', ld: [art, crumbs(crumbItems), faqLd(g.faq)] });
}
const ISSUES = "https://github.com/Saikumar8125/AI-TOOLS-HUB/issues/new";
function reportUrl(t) {
  const body = `Tool: ${t.n}\nListed link: ${t.u}\nListed pricing: ${t.p || ""}\nPage: ${SITE}/tools/${t.slug}\n\nWhat is wrong (link / pricing / other):\nWhat it should be (with official source link):\n`;
  return `${ISSUES}?title=${encodeURIComponent("Problem report: " + t.n)}&body=${encodeURIComponent(body)}`;
}
function guidesIndex() {
  const body = `<div class="wrap hero">${crumbHtml([["Home", "/"], ["Guides", "/guides"]])}
<h1>AI guides for Indian businesses</h1>
<p class="sub">Which AI tools to use, by business type. Plain picks, free options first where they exist.</p>
<ul class="stats"><li><b>${GUIDES.length + 3}</b> guides</li><li><b>${GUIDES.length}</b> by business type</li><li><b>3</b> for online sellers</li></ul></div>
<section class="wrap"><ul class="cards">${GUIDES.map((g) => `<li class="card"><div class="card__top"><h3><a href="/guides/${g.s}">${esc(g.t)}</a></h3></div><p>${esc(g.i.split(". ")[0])}.</p></li>`).join("")}
<li class="card"><div class="card__top"><h3><a href="/guide-whatsapp.html">AiSensy vs Interakt vs Wati</a></h3></div><p>WhatsApp marketing tools compared for Indian D2C brands.</p></li>
<li class="card"><div class="card__top"><h3><a href="/guide-shopify.html">AI tools for Shopify D2C brands</a></h3></div><p>One pick per job for Indian Shopify brands.</p></li>
<li class="card"><div class="card__top"><h3><a href="/guide-amazon.html">AI tools for Amazon India sellers</a></h3></div><p>Listings, images and ads for Amazon India.</p></li>
</ul></section>`;
  return page({ title: `AI Guides for Indian Businesses (${GUIDES.length + 3}) | AI Tools Hub`, desc: `Best AI tools by business type in India: CA firms, restaurants, kirana shops, clinics, coaching centres and more.`, path: "/guides", body, nav: "guides", ld: [crumbs([["Home", "/"], ["Guides", "/guides"]])] });
}

// build
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "tools"), { recursive: true });
fs.mkdirSync(path.join(OUT, "category"), { recursive: true });
fs.mkdirSync(path.join(OUT, "guides"), { recursive: true });
for (const f of fs.readdirSync(__dirname)) {
  if (SKIP.has(f) || f.startsWith(".")) continue;
  const src = path.join(__dirname, f);
  if (fs.statSync(src).isFile()) fs.copyFileSync(src, path.join(OUT, f));
}
// v3.2.1: sound files (click/open/add/success.mp3) sit flat in the repo root, so the loop above copies them.
for (const f of ["click.mp3", "open.mp3", "add.mp3", "success.mp3"]) if (!fs.existsSync(path.join(OUT, f))) { console.error("Missing sound file: " + f); process.exit(1); }
// Home page counts come from data.js, so the static HTML (what crawlers and no-JS visitors see) never drifts.
{
  const n = { total: TOOLS.length, cats: CATS.length, Free: 0, Freemium: 0 };
  TOOLS.forEach((t) => { if (t.p in n) n[t.p]++; });
  const f = path.join(OUT, "index.html");
  let h = fs.readFileSync(f, "utf8");
  h = h.replace(/(data-count="(total|cats|Free|Freemium)">)\d+</g, (m, a, k) => a + n[k] + "<")
    .replace(/(data-n="(total|cats)">)\d+</g, (m, a, k) => a + n[k] + "<")
    .replace(/See all \d+ guides/g, `See all ${GUIDES.length + 3} guides`);
  // categories bento: static links (crawlable, works without JS); home.js keeps them and adds in-page filtering
  const CAT_ICON = { "Chatbots": "message-square", "Study": "graduation-cap", "Research": "microscope", "Writing": "pen-line", "Coding": "code-xml", "No-Code": "blocks", "Image": "image", "Photo Edit": "image-up", "Design": "palette", "PPT": "presentation", "Video": "clapperboard", "Avatar": "circle-user-round", "Audio": "audio-lines", "Music": "music", "Transcription": "captions", "Translation": "languages", "Resume & Jobs": "briefcase-business", "Productivity": "list-checks", "Automation": "workflow", "Marketing": "megaphone", "Business": "building-2", "Data & Sheets": "table-2", "3D & Gaming": "box", "Health & Life": "heart-pulse", "Prompts & Learning AI": "lightbulb", "Browser & Search": "globe" };
  const bento = CATS.map((c, k) => `<li${k < 2 ? ' class="is-lg"' : k < 6 ? ' class="is-wide"' : ""}><a class="cat" href="/category/${catSlug(c)}" data-cat="${esc(c)}">${icon(CAT_ICON[c] || "blocks")}<span class="cat__n">${esc(c)}</span><span class="cat__c">${byCat[c].length} tools</span><span class="cat__d">${esc(INTRO[c] || "")}</span><span class="cat__tools">${byCat[c].slice(0, 4).map((t) => esc(t.n)).join(" · ")}</span></a></li>`).join("");
  h = h.replace("<!--build:bento-->", bento);
  // tool -> guides map for the tool sheet and the search palette: { g: [[slug, title, who]], t: { toolName: [guideIndex] } }
  const gmap = { g: GUIDES.map((g) => [g.s, g.t, titleCase(g.who)]), t: {}, i: INTRO };
  GUIDES.forEach((g, gi) => g.sec.forEach((x) => x.tools.forEach((nm) => { const a = gmap.t[nm] = gmap.t[nm] || []; if (a.indexOf(gi) < 0) a.push(gi); })));
  h = h.replace('<script type="application/json" id="guide-map">{}</script>', '<script type="application/json" id="guide-map">' + JSON.stringify(gmap).replace(/</g, "\\u003c") + "</script>");
  fs.writeFileSync(f, h);
}
TOOLS.forEach((t) => fs.writeFileSync(path.join(OUT, "tools", t.slug + ".html"), toolPage(t)));
CATS.forEach((c) => fs.writeFileSync(path.join(OUT, "category", catSlug(c) + ".html"), catPage(c)));
GUIDES.forEach((g) => fs.writeFileSync(path.join(OUT, "guides", g.s + ".html"), guidePage(g)));
fs.writeFileSync(path.join(OUT, "guides.html"), guidesIndex());
{
  // site search: [kind, name, url, category, price, short description]
  const short = (x) => String(x || "").slice(0, 110);
  const IDX = TOOLS.map((t) => ["tool", t.n, "/tools/" + t.slug, t.c, t.p, short((DESC[t.n] || {}).d)])
    .concat(GUIDES.map((g) => ["guide", g.t, "/guides/" + g.s, "Guide", "", short(g.who)]))
    .concat(CATS.map((c) => ["category", "AI " + c + " tools", "/category/" + catSlug(c), "Category", "", short(INTRO[c])]));
  fs.writeFileSync(path.join(OUT, "search-index.json"), JSON.stringify(IDX));
}
fs.writeFileSync(path.join(OUT, "categories.html"), categoriesPage());
fs.writeFileSync(path.join(OUT, "all-tools.html"), allToolsPage());

// sitemap: static pages from the repo's sitemap.xml + generated pages
const fixed = (fs.readFileSync(path.join(__dirname, "sitemap.xml"), "utf8").match(/<loc>[^<]+<\/loc>/g) || []).map((x) => x.slice(5, -6));
const urls = fixed.concat(LEGAL.map((x) => SITE + "/" + x[0]), [SITE + "/guides", SITE + "/categories", SITE + "/all-tools"], GUIDES.map((g) => SITE + "/guides/" + g.s), CATS.map((c) => SITE + "/category/" + catSlug(c)), TOOLS.map((t) => SITE + "/tools/" + t.slug));
fs.writeFileSync(path.join(OUT, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + [...new Set(urls)].map((u) => `  <url><loc>${esc(u)}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n") + "\n</urlset>\n");

console.log(`Built ${TOOLS.length} tool pages, ${LEGAL.length} legal pages copied, ${CATS.length} category pages, ${GUIDES.length + 3} guides (${GUIDES.length} business + 3 seller), ${new Set(urls).size} sitemap URLs.`);
