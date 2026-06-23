import {
  assertNoDeprecatedFeaturedAlias,
  installPublicMarketplaceMocks,
} from "../fixtures/api-mocks";
import { test, expect } from "../fixtures/test-base";

const pilotRoutes = [
  { name: "home", path: "/" },
  { name: "products", path: "/products" },
  { name: "services", path: "/services" },
  { name: "vendors", path: "/vendors" },
  { name: "search", path: "/search" },
];

const pilotViewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1366", width: 1366, height: 768 },
];

test.describe("Public screenshot pilot", () => {
  test.beforeEach(async ({ page }) => {
    await assertNoDeprecatedFeaturedAlias(page);
    await installPublicMarketplaceMocks(page);
  });

  for (const viewport of pilotViewports) {
    for (const route of pilotRoutes) {
      test(`${route.name} ${viewport.name}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route.path);
        await expect(page.locator("body")).not.toBeEmpty();

        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach(`${route.name}-${viewport.name}.png`, {
          body: screenshot,
          contentType: "image/png",
        });
      });
    }
  }
});
