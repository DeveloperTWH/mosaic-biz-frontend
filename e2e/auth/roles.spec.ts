import { test, expect } from "@playwright/test";
import { setupMocks } from "../helpers/mockApi";
import { seedClientSession } from "../helpers/authSession";

test.describe("@mocked auth and role access", () => {
  test("unauthenticated admin route redirects to sign in", async ({ page }) => {
    await setupMocks(page, { auth: "unauth" });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/signin/, { timeout: 15_000 });
  });

  test("customer can access customer orders page", async ({ page }) => {
    await setupMocks(page, { auth: "customer" });
    await seedClientSession(page, "customer");
    await page.goto("/customer/order");
    await expect(page.getByPlaceholder("Search by product or order details")).toBeVisible({ timeout: 15_000 });
  });

  test("vendor can access partners hub without login bounce", async ({ page }) => {
    await setupMocks(page, { auth: "business_owner", onboarding: "none" });
    await seedClientSession(page, "business_owner");
    await page.goto("/partners");
    await expect(page).toHaveURL(/\/partners/, { timeout: 15_000 });
    await expect(page.getByText("Business Verification").first()).toBeVisible();
  });

  test("admin can access admin dashboard shell", async ({ page }) => {
    await setupMocks(page, { auth: "admin" });
    await seedClientSession(page, "admin");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });
    await expect(page.getByText("No businesses available")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("wrong role sees explicit admin forbidden UI", async ({ page }) => {
    await setupMocks(page, { auth: "customer" });
    await seedClientSession(page, "customer");
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Admin access required" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("link", { name: "Go to your account" })).toBeVisible();
  });

  test("expired vendor session redirects to login once without loop", async ({ page }) => {
    await setupMocks(page, { auth: "unauth" });
    await seedClientSession(page, "business_owner");
    await page.goto("/partners");
    await expect(page).toHaveURL(/\/login\?type=vendor/, { timeout: 15_000 });
    await page.waitForTimeout(1_500);
    expect(page.url()).toMatch(/\/login\?type=vendor/);
  });

  test("verify-otp allows entry with email query param", async ({ page }) => {
    await setupMocks(page, { auth: "unauth" });
    const response = await page.goto("/verify-otp?email=e2e%40example.test&type=customer");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/verify-otp/);
  });
});

test.describe("@live optional auth against real API", () => {
  test.skip(
    !process.env.E2E_CUSTOMER_EMAIL || !process.env.E2E_CUSTOMER_PASSWORD,
    "Set E2E_CUSTOMER_EMAIL and E2E_CUSTOMER_PASSWORD for live auth tests"
  );

  test("live customer login reaches orders page", async ({ page }) => {
    await page.goto("/login?type=customer");
    await page.getByLabel(/email/i).fill(process.env.E2E_CUSTOMER_EMAIL!);
    await page.getByLabel(/password/i).fill(process.env.E2E_CUSTOMER_PASSWORD!);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 20_000 });
  });
});
