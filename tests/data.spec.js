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
