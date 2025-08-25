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
    video: "retain-on-failure",
    storageState: "tests/.auth/storageState.json",
  },
  globalSetup: "./tests/setup/global-setup.js",
  globalTeardown: "./tests/setup/global-teardown.js",
});
