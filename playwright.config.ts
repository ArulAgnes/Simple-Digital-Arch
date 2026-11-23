import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45000,
  outputDir: "/tmp/da-playwright-results",
  reporter: [["list"], ["json", { outputFile: "/tmp/da-e2e-results.json" }]],
  use: {
    baseURL: process.env.DA_TEST_BASE_URL || "http://127.0.0.1:3000",
    viewport: { width: 1440, height: 1000 },
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
