// Regression tests for the homepage directory and generated pages.
// External requests (fonts, CDN, favicons) are blocked so results do not depend on the network.
const { test, expect } = require("@playwright/test");
const path = require("path");
global.window = global.window || {};
require(path.join(__dirname, "..", "data.js"));
const TOOLS = window.AITH_TOOLS;

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.route("**/*", (r) => (r.request().url().startsWith("http://127.0.0.1") ? r.continue() : r.abort()));
});
test.afterEach(() => { expect(errors, "uncaught page errors").toEqual([]); });

async function home(page) {
  await page.goto("/");
  await expect(page.locator("#grid .x-card").first()).toBeVisible();
}
const shown = (page) => page.locator("#count-sr");
async function expectCount(page, n) { await expect(shown(page)).toHaveText(new RegExp("^" + n + " tools? found")); }

test("homepage renders the directory with all 585 tools counted", async ({ page }) => {
  await home(page);
  await expectCount(page, 585);
  expect(await page.locator("#grid .x-card").count()).toBeGreaterThan(0);
});

test("search narrows results and clear resets", async ({ page }) => {
  await home(page);
  await page.fill("#q", "chatgpt");
  await expect(page.locator("#grid .x-card__name", { hasText: /^ChatGPT$/ })).toBeVisible();
  await expect(shown(page)).not.toHaveText(/^585 /);
  await page.fill("#q", "zzqqxxnotatool");
  await expectCount(page, 0);
  await page.fill("#q", "");
  await expectCount(page, 585);
});

test("pricing filter matches data.js counts", async ({ page }) => {
  await home(page);
  for (const p of ["Free", "Freemium", "Paid"]) {
    const n = TOOLS.filter((t) => t.p === p).length;
    await page.locator(`#price [data-p="${p}"]`).click();
    await expect(page.locator(`#price [data-p="${p}"]`)).toHaveAttribute("aria-pressed", "true");
    await expectCount(page, n);
  }
  await page.locator('#price [data-p=""]').click();
  await expectCount(page, 585);
});

test("category pill matches data.js count", async ({ page }) => {
  await home(page);
  const n = TOOLS.filter((t) => t.c === "Chatbots").length;
  await page.locator('#cat-pills [data-cat="Chatbots"]').click();
  await expectCount(page, n);
  await page.locator('#cat-pills [data-cat=""]').click();
  await expectCount(page, 585);
});

test("job pill filters to its stated size", async ({ page }) => {
  await home(page);
  const pill = page.locator("#job-pills [data-job]").first();
  const n = (await pill.locator("small").textContent()).trim();
  expect(n).toMatch(/^\d+$/);
  await pill.click();
  await expect(pill).toHaveAttribute("aria-pressed", "true");
  await expectCount(page, n);
});

test("tool modal opens with the right tool and closes with Escape and the close button", async ({ page }) => {
  await home(page);
  const card = page.locator("#grid .x-card").first();
  const name = (await card.locator(".x-card__name").textContent()).trim();
  await card.click();
  await expect(page.locator("#modal")).toBeVisible();
  await expect(page.locator("#m-name")).toHaveText(name);
  await expect(page.locator("#m-visit")).toHaveAttribute("href", /^https:\/\//);
  await page.keyboard.press("Escape");
  await expect(page.locator("#modal")).toBeHidden();
  await card.click();
  await expect(page.locator("#modal")).toBeVisible();
  await page.locator("#modal button.x-close[data-close]").click();
  await expect(page.locator("#modal")).toBeHidden();
});

test("favorites: save, list in drawer, remove", async ({ page }) => {
  await home(page);
  const wrap = page.locator("#grid .x-fw").first();
  const name = (await wrap.locator(".x-card__name").textContent()).trim();
  const heart = wrap.locator("[data-fav]");
  await heart.click();
  await expect(heart).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#saved-n")).toHaveText("1");
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator("#saved-btn").click();
  await expect(page.locator("#drawer-list")).toContainText(name);
  await page.locator("#drawer-list [data-sv-rm]").first().click();
  await expect(page.locator("#saved-n")).toHaveText("0");
  await expect(page.locator("#drawer-list")).toContainText("No saved tools yet");
});

test("favorites persist across reload, and removal persists too", async ({ page }) => {
  await home(page);
  const wraps = page.locator("#grid .x-fw");
  const names = [];
  for (const k of [0, 2]) {
    names.push((await wraps.nth(k).locator(".x-card__name").textContent()).trim());
    await wraps.nth(k).locator("[data-fav]").click();
  }
  await expect(page.locator("#saved-n")).toHaveText("2");
  await page.reload();
  await expect(page.locator("#grid .x-card").first()).toBeVisible();
  await expect(page.locator("#saved-n")).toHaveText("2");
  await expect(wraps.nth(0).locator("[data-fav]")).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator("#saved-btn").click();
  for (const n of names) await expect(page.locator("#drawer-list")).toContainText(n);
  await page.locator("#drawer-list [data-sv-rm]").first().click();
  await expect(page.locator("#saved-n")).toHaveText("1");
  await page.reload();
  await expect(page.locator("#saved-n")).toHaveText("1");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("aith-saved")))).toEqual([names[1]]);
});

test("corrupt or unknown saved favorites are ignored safely", async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.getItem("seeded")) { sessionStorage.setItem("seeded", "1"); localStorage.setItem("aith-saved", '["Not A Real Tool", 42, "ChatGPT", "ChatGPT"]'); } });
  await home(page);
  await expect(page.locator("#saved-n")).toHaveText("1");
  await page.evaluate(() => localStorage.setItem("aith-saved", "{not json"));
  await page.reload();
  await expect(page.locator("#saved-n")).toHaveText("0");
});

test("compare: pick two tools and open the comparison", async ({ page }) => {
  await home(page);
  const wraps = page.locator("#grid .x-fw");
  const names = [];
  for (const k of [0, 1]) {
    names.push((await wraps.nth(k).locator(".x-card__name").textContent()).trim());
    await wraps.nth(k).locator("[data-cmp]").click();
  }
  await expect(page.locator("#cbar-go")).toBeEnabled();
  await page.locator("#cbar-go").click();
  await expect(page.locator("#cmp")).toHaveAttribute("aria-hidden", "false");
  for (const n of names) await expect(page.locator("#cmp-cols")).toContainText(n);
  await page.locator("#cmp button[data-cmp-close]").click();
  await expect(page.locator("#cmp")).toHaveAttribute("aria-hidden", "true");
});

test("theme toggle switches and persists after reload", async ({ page }) => {
  await home(page);
  await page.evaluate(() => scrollTo(0, 0));
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");
  const toggle = page.locator("#theme");
  if (!(await toggle.isVisible())) await page.locator("#burger").click();
  await toggle.click();
  const after = before === "dark" ? "light" : "dark";
  await expect(html).toHaveAttribute("data-theme", after);
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", after);
});

for (const [url, h1] of [["/tools/chatgpt", /ChatGPT/], ["/category/chatbots", /Chatbots/i], ["/guides", /guides/i], ["/guides/kirana-shops", /Kirana/i], ["/d2c.html", /./]]) {
  test(`generated page ${url} loads with an h1`, async ({ page }) => {
    const res = await page.goto(url);
    expect(res.status()).toBe(200);
    await expect(page.locator("h1").first()).toHaveText(h1);
  });
}
