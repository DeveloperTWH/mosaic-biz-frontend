import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { PUBLIC_QUALITY_ROUTES } from "./publicRoutes";
import { installPublicApiMocks } from "./helpers/mockPublicApi";

const REPORT_DIR = path.join(process.cwd(), "quality-reports", "axe");

test.describe("Public route accessibility @quality", () => {
  test.beforeEach(async ({ page }) => {
    await installPublicApiMocks(page);
  });

  for (const route of PUBLIC_QUALITY_ROUTES) {
    test(`${route.label} (${route.path}) has no severe axe violations`, async ({ page }, testInfo) => {
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response, `Route should respond for ${route.path}`).not.toBeNull();
      expect(response?.status() ?? 500, `Route status for ${route.path}`).toBeLessThan(400);

      await page.waitForTimeout(500);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      mkdirSync(REPORT_DIR, { recursive: true });
      writeFileSync(
        path.join(REPORT_DIR, `${route.id}.json`),
        JSON.stringify(results, null, 2)
      );

      const severe = results.violations.filter((violation) =>
        violation.impact === "critical" || violation.impact === "serious"
      );

      if (severe.length) {
        await testInfo.attach(`${route.id}-axe-violations`, {
          body: JSON.stringify(severe, null, 2),
          contentType: "application/json",
        });
      }

      expect(
        severe.length,
        `Severe accessibility violations on ${route.path}: ${severe
          .map((v) => `${v.id} (${v.nodes.length} nodes)`)
          .join("; ")}`
      ).toBe(0);
    });
  }
});
