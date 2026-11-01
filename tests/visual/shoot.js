// Screenshot harness for refactor checks: node tests/visual/shoot.js <outDir>
// Serves public/ (run `node build.js` first), blocks external requests, disables animation.
"use strict";
const { chromium } = require("@playwright/test");
const { spawn } = require("child_process");
const path = require("path"), fs = require("fs");
const out = process.argv[2] || "shots";
const BASE = "http://127.0.0.1:4173";
const SHOTS = [
  ["home", "/", null], ["home-light", "/", "light"], ["modal", "/", "modal"],
  ["drawer", "/", "drawer"], ["tool", "/tools/chatgpt", null], ["guide", "/guides/kirana-shops", null]
];
const VIEWS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const srv = spawn("node", [path.join(__dirname, "..", "server.js")], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 700));
  const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH, args: ["--no-sandbox"] } : {});
  try {
    for (const [vn, vp] of Object.entries(VIEWS)) {
      for (const [name, url, mode] of SHOTS) {
        const ctx = await browser.newContext({ viewport: vp, reducedMotion: "reduce", isMobile: vn === "mobile", hasTouch: vn === "mobile" });
        if (mode === "light") await ctx.addInitScript(() => localStorage.setItem("aith-theme", "light"));
        const page = await ctx.newPage();
        await page.route("**/*", (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
        await page.addInitScript(() => { Math.random = () => 0.42; });
        await page.goto(BASE + url, { waitUntil: "load" });
        // content-visibility:auto sections get estimated heights until painted; force real layout for stable captures
        await page.addStyleTag({ content: "*{content-visibility:visible!important;contain-intrinsic-size:auto!important}" });
        await page.waitForTimeout(600);
        if (mode === "modal") { await page.$eval("#grid .x-card", (el) => el.click()); await page.waitForTimeout(1500); }
        if (mode === "drawer") { await page.locator("#grid .x-fw [data-fav]").first().click(); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300); await page.locator("#saved-btn").click(); await page.waitForTimeout(700); }
        const full = !mode || mode === "light";
        if (full) { await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); }); await page.waitForTimeout(400); }
        await page.screenshot({ path: path.join(out, `${vn}-${name}.png`), fullPage: full, animations: "disabled", caret: "hide" });
        await ctx.close();
      }
    }
  } finally { await browser.close(); srv.kill(); }
})();
