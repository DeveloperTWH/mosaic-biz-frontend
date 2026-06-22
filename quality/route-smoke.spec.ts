import { test, expect } from "@playwright/test";
import { PUBLIC_QUALITY_ROUTES } from "./publicRoutes";
import { installPublicApiMocks } from "./helpers/mockPublicApi";

test.describe("Public route smoke @quality", () => {
  test.beforeEach(async ({ page }) => {
    await installPublicApiMocks(page);
  });

  for (const route of PUBLIC_QUALITY_ROUTES) {
    test(`${route.label} loads without crash`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response, `Missing response for ${route.path}`).not.toBeNull();
      expect(response?.status(), `HTTP status for ${route.path}`).toBeLessThan(400);

      await expect(page.locator("text=Application error")).toHaveCount(0);
      await expect(page.locator('[data-nextjs-dialog-overlay="true"]')).toHaveCount(0);

      expect(
        consoleErrors.filter((message) => !/favicon|404.*icon/i.test(message)),
        `Uncaught errors on ${route.path}`
      ).toEqual([]);
    });
  }
});
