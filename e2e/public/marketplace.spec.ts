import { test, expect } from "@playwright/test";
import {
  setupMocks,
  assertNoForbiddenRoutes,
  assertFeaturedProductsCalled,
} from "../helpers/mockApi";

test.describe("@mocked public marketplace", () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page, { auth: "unauth" });
  });

  test("homepage loads featured products from canonical route", async ({ page }) => {
    const tracker = await setupMocks(page, { auth: "unauth" });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Featured Products" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("E2E Featured Product")).toBeVisible();
    assertFeaturedProductsCalled(tracker);
    assertNoForbiddenRoutes(tracker);
  });

  test("products catalog page renders", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText("Shop").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("E2E Catalog Product")).toBeVisible();
  });

  test("services catalog page renders", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByText("E2E Consulting Service")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("food catalog page renders", async ({ page }) => {
    await page.goto("/foods");
    await expect(page.getByText("E2E Sample Dish")).toBeVisible({ timeout: 15_000 });
  });

  test("vendors directory page renders", async ({ page }) => {
    await page.goto("/vendors");
    await expect(page.getByRole("heading", { name: "Our Vendors" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("E2E Vendor Shop")).toBeVisible();
  });

  test("search page renders results", async ({ page }) => {
    await page.goto("/search?keyword=test");
    await expect(page.getByText("E2E Search Product")).toBeVisible({ timeout: 15_000 });
  });

  test("product detail page renders mocked product", async ({ page }) => {
    await page.goto("/product/prod-e2e-001");
    await expect(page.getByRole("heading", { name: "E2E Detail Product" }).last()).toBeVisible({ timeout: 15_000 });
  });

  test("missing product shows unavailable state", async ({ page }) => {
    await page.goto("/product/nonexistent-id");
    await expect(page.getByText("Product unavailable")).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText("This product may have been removed or is temporarily unavailable.")
    ).toBeVisible();
  });

  test("never calls /api/products/featured", async ({ page }) => {
    const tracker = await setupMocks(page, { auth: "unauth" });
    await page.goto("/");
    await page.waitForTimeout(2_000);
    assertNoForbiddenRoutes(tracker);
  });
});
