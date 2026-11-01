// Run with: npm test   (builds public/ first, then runs every project)
// Set PW_CHROMIUM_PATH to use a system Chromium instead of `npx playwright install chromium`.
const { defineConfig } = require("@playwright/test");
const launchOptions = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH, args: ["--no-sandbox"] } : {};
module.exports = defineConfig({
  testDir: ".",
  timeout: 30000,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:4173", launchOptions },
  webServer: { command: "node tests/server.js", url: "http://127.0.0.1:4173/", reuseExistingServer: true, cwd: require("path").join(__dirname, "..") },
  projects: [
    { name: "data", testMatch: /data\.spec\.js/ },
    { name: "desktop", testMatch: /ui\.spec\.js/, use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testMatch: /ui\.spec\.js/, use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
  ]
});
