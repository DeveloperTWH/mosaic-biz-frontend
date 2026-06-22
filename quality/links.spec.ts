import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { PUBLIC_QUALITY_ROUTES, QUALITY_SCAN_BASE_URL } from "./publicRoutes";
import { installPublicApiMocks } from "./helpers/mockPublicApi";

const REPORT_DIR = path.join(process.cwd(), "quality-reports", "links");

type BrokenLink = {
  sourceRoute: string;
  href: string;
  status: number | "network-error";
};

function isInternalHref(href: string): boolean {
  if (!href || href.startsWith("#")) return false;
  if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return false;
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href, QUALITY_SCAN_BASE_URL);
    const base = new URL(QUALITY_SCAN_BASE_URL);
    return url.origin === base.origin;
  } catch {
    return false;
  }
}

function normalizeInternalPath(href: string): string {
  const url = new URL(href, QUALITY_SCAN_BASE_URL);
  return `${url.pathname}${url.search}`;
}

test.describe("Public internal links @quality", () => {
  test.beforeEach(async ({ page }) => {
    await installPublicApiMocks(page);
  });

  test("seed routes do not expose broken internal links", async ({ page, request }) => {
    const checked = new Set<string>();
    const broken: BrokenLink[] = [];

    for (const route of PUBLIC_QUALITY_ROUTES) {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors
          .map((anchor) => anchor.getAttribute("href"))
          .filter((href): href is string => Boolean(href))
      );

      for (const href of hrefs) {
        if (!isInternalHref(href)) continue;

        const targetPath = normalizeInternalPath(href);
        if (checked.has(targetPath)) continue;
        checked.add(targetPath);

        if (
          targetPath.startsWith("/login") ||
          targetPath.startsWith("/signup") ||
          targetPath.startsWith("/checkout") ||
          targetPath.startsWith("/payment") ||
          targetPath.startsWith("/cart") ||
          targetPath.startsWith("/admin") ||
          targetPath.startsWith("/partners") ||
          targetPath.startsWith("/customer")
        ) {
          continue;
        }

        try {
          const response = await request.get(targetPath, { maxRedirects: 5 });
          if (response.status() >= 400) {
            broken.push({
              sourceRoute: route.path,
              href: targetPath,
              status: response.status(),
            });
          }
        } catch {
          broken.push({
            sourceRoute: route.path,
            href: targetPath,
            status: "network-error",
          });
        }
      }
    }

    mkdirSync(REPORT_DIR, { recursive: true });
    writeFileSync(path.join(REPORT_DIR, "broken-links.json"), JSON.stringify(broken, null, 2));

    expect(
      broken,
      `Broken internal links found:\n${broken
        .map((entry) => `- ${entry.href} (${entry.status}) from ${entry.sourceRoute}`)
        .join("\n")}`
    ).toEqual([]);
  });
});
