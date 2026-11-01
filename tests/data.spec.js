// Data integrity and build output. No browser needed.
const { test, expect } = require("@playwright/test");
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
global.window = {};
require(path.join(ROOT, "data.js"));
require(path.join(ROOT, "guides.js"));
const TOOLS = window.AITH_TOOLS, DESC = window.AITH_DESC || {}, GUIDES = window.AITH_GUIDES || [];

test("585 tools in 26 categories", () => {
  expect(TOOLS.length).toBe(585);
  expect(new Set(TOOLS.map((t) => t.c)).size).toBe(26);
});
test("every tool has name, https URL, category, pricing and a description", () => {
  const bad = TOOLS.filter((t) => !t.n || !/^https:\/\//.test(t.u) || !t.c || !["Free", "Freemium", "Paid"].includes(t.p) || !DESC[t.n]);
  expect(bad.map((t) => t.n)).toEqual([]);
});
test("tool names are unique", () => {
  const seen = new Set(), dup = [];
  TOOLS.forEach((t) => { if (seen.has(t.n)) dup.push(t.n); seen.add(t.n); });
  expect(dup).toEqual([]);
});
test("duplicate tool URLs are only the known one (Stitch)", () => {
  const m = {};
  TOOLS.forEach((t) => (m[t.u] = m[t.u] || []).push(t.n));
  const dups = Object.keys(m).filter((u) => m[u].length > 1);
  expect(dups).toEqual(["https://stitch.withgoogle.com"]);
});
test("18 guides, unique slugs, every guide tool exists in data.js", () => {
  expect(GUIDES.length).toBe(18);
  expect(new Set(GUIDES.map((g) => g.s)).size).toBe(18);
  const names = new Set(TOOLS.map((t) => t.n));
  const missing = [];
  GUIDES.forEach((g) => g.sec.forEach((s) => s.tools.forEach((n) => { if (!names.has(n)) missing.push(g.s + ": " + n); })));
  expect(missing).toEqual([]);
});
test("build output: tool, category and guide pages plus sitemap", () => {
  const pub = path.join(ROOT, "public");
  const count = (d) => fs.readdirSync(path.join(pub, d)).filter((f) => f.endsWith(".html")).length;
  expect(count("tools")).toBe(585);
  expect(count("category")).toBe(26);
  expect(count("guides")).toBe(18);
  const urls = (fs.readFileSync(path.join(pub, "sitemap.xml"), "utf8").match(/<loc>/g) || []).length;
  expect(urls).toBe(639);
  ["index.html", "guides.html", "categories.html", "all-tools.html", "d2c.html", "search-index.json"].forEach((f) => expect(fs.existsSync(path.join(pub, f)), f).toBe(true));
});

// ---- SEO and link safety (Phase 6) -------------------------------------
const PUB = path.join(ROOT, "public"), SITE = "https://aitoolshub-in.vercel.app";
function htmlFiles(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) htmlFiles(p, out);
    else if (f.endsWith(".html") && !/^google[0-9a-f]+\.html$/.test(f)) out.push(p);
  }
  return out;
}
test("every sitemap URL maps to a built page, and robots.txt points at the sitemap", () => {
  const sm = fs.readFileSync(path.join(PUB, "sitemap.xml"), "utf8");
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(urls.length).toBe(639);
  const missing = urls.filter((u) => {
    let p = u.replace(SITE, "") || "/";
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(PUB, p);
    return !(fs.existsSync(f) || fs.existsSync(f + ".html"));
  });
  expect(missing).toEqual([]);
  expect(fs.readFileSync(path.join(PUB, "robots.txt"), "utf8")).toContain("Sitemap: " + SITE + "/sitemap.xml");
});
test("every indexable page has one absolute canonical on the live domain, a title and a description", () => {
  const bad = [];
  for (const f of htmlFiles(PUB)) {
    const s = fs.readFileSync(f, "utf8"), rel = path.relative(PUB, f);
    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(s)) continue;
    const can = [...s.matchAll(/<link[^>]+rel="canonical"[^>]*>/gi)];
    const okCan = can.length === 1 && new RegExp('href="' + SITE.replace(/\./g, "\\.") + "/").test(can[0][0]);
    if (!okCan || !/<title>[^<]{5,}<\/title>/.test(s) || !/<meta[^>]+name="description"[^>]+content="[^"]{20,}/i.test(s)) bad.push(rel);
  }
  expect(bad).toEqual([]);
});
test("every link that opens a new tab carries rel=noopener", () => {
  const bad = [];
  const files = htmlFiles(PUB).concat([path.join(ROOT, "js/home/02-app.js"), path.join(ROOT, "main.js"), path.join(ROOT, "pages.js")]);
  for (const f of files) {
    const s = fs.readFileSync(f, "utf8");
    for (const m of s.matchAll(/<a\b[^>]*target=\\?"_blank\\?"[^>]*>/g)) if (!/rel=\\?"[^"\\]*noopener/.test(m[0])) bad.push(path.relative(ROOT, f) + ": " + m[0].slice(0, 90));
  }
  expect(bad).toEqual([]);
});
