import { defineConfig, devices } from "@playwright/test";
import { QUALITY_SCAN_BASE_URL, QUALITY_SCAN_PORT } from "./quality/publicRoutes";

export default defineConfig({
  testDir: "./quality",
  testMatch: ["**/*.spec.ts"],
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  outputDir: "quality-reports/test-results",
  reporter: [
    ["list"],
    ["json", { outputFile: "quality-reports/playwright-report.json" }],
    ["html", { outputFolder: "quality-reports/playwright-html", open: "never" }],
  ],
  use: {
    baseURL: QUALITY_SCAN_BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chrome",
      testMatch: ["**/*.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "mobile-chrome",
      testMatch: ["**/route-smoke.spec.ts"],
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
  webServer: process.env.QUALITY_SCAN_REUSE_SERVER === "1"
    ? undefined
    : {
        command: `npm run start -- -p ${QUALITY_SCAN_PORT}`,
        url: QUALITY_SCAN_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          ...process.env,
          NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3099",
          NEXT_PUBLIC_APP_URL: QUALITY_SCAN_BASE_URL,
        },
      },
});
