import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PLAYWRIGHT_PORT || "3000";
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      PORT,
      NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:3099",
      NEXT_PUBLIC_CLIENT_BASE_URL: baseURL,
      NEXT_PUBLIC_APP_URL: baseURL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_mock",
      JWT_SECRET: "playwright-test-jwt-secret-min-32-chars",
    },
  },
});
