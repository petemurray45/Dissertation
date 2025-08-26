import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.FRONTEND_URL || "http://localhost:5173",
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    storageState: "tests/.auth/storageState.json",
  },
  globalSetup: "./tests/setup/global-setup.js",

  webServer: {
    command: "npm run dev:test",
    url: process.env.FRONTEND_URL || "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
