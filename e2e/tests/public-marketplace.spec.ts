import {
  assertNoDeprecatedFeaturedAlias,
  installPublicMarketplaceMocks,
  MOCK_PRODUCT_ID,
  publicProductDetailResponse,
} from "../fixtures/api-mocks";
import { test, expect } from "../fixtures/test-base";

test.describe("Public marketplace", () => {
  test.beforeEach(async ({ page }) => {
    await assertNoDeprecatedFeaturedAlias(page);
    await installPublicMarketplaceMocks(page);
  });

  test("homepage loads hero and marketplace CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Shop the Marketplace" })
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByRole("link", { name: "Become a Vendor" }).first()
    ).toBeVisible();
  });

  test("homepage requests canonical GET /api/featured-products", async ({ page }) => {
    const featuredRequest = page.waitForRequest((req) =>
      req.url().includes("/api/featured-products")
    );
    await page.goto("/");
    const request = await featuredRequest;
    expect(request.method()).toBe("GET");
    expect(request.url()).not.toContain("/api/products/featured");
  });

  test("products page renders Shop hero", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("#public-page-hero-title")).toHaveText("Shop");
  });

  test("services page renders Services hero", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("#public-page-hero-title")).toHaveText("Services");
  });

  test("food page renders Food & Grocery hero", async ({ page }) => {
    await page.goto("/foods");
    await expect(page.getByRole("heading", { name: "Food & Grocery" })).toBeVisible();
  });

  test("vendors directory renders Our Vendors hero", async ({ page }) => {
    await page.goto("/vendors");
    await expect(page.getByRole("heading", { name: "Our Vendors" })).toBeVisible();
  });

  test("search page renders Search hero and empty-state copy", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();
    await expect(page.getByText("Start with a keyword, state, or business type")).toBeVisible();
  });

  test("product detail route loads for mocked product", async ({ page }) => {
    await page.route(`**/api/public/product/${MOCK_PRODUCT_ID}**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(publicProductDetailResponse),
      })
    );

    await page.goto(`/product/${MOCK_PRODUCT_ID}`);
    await expect(page.getByRole("heading", { name: "E2E Test Product" }).last()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("missing product detail shows safe not-found or empty state", async ({ page }) => {
    await page.route("**/api/products/**", (route) =>
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Product not found" }),
      })
    );

    await page.goto("/product/000000000000000000000000");
    await expect(page.getByText("Product unavailable")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("become-a-vendor funnel entry loads", async ({ page }) => {
    await page.goto("/become-a-vendor");
    await expect(page).toHaveURL(/become-a-vendor/);
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
