import type { Page } from "@playwright/test";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3099";

const json = (body: unknown) => ({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify(body),
});

/**
 * Stub marketplace reads so public pages render without live backend mutations.
 */
export async function installPublicApiMocks(page: Page): Promise<void> {
  const apiPattern = `${API_BASE.replace(/\/$/, "")}/**`;

  await page.route(apiPattern, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (method !== "GET") {
      await route.fulfill(json({ success: true }));
      return;
    }

    if (url.includes("/api/featured-products")) {
      await route.fulfill(json({ success: true, data: [] }));
      return;
    }

    if (url.includes("/api/products")) {
      await route.fulfill(json({ success: true, data: { products: [], total: 0 } }));
      return;
    }

    if (url.includes("/api/services")) {
      await route.fulfill(json({ success: true, data: { services: [], total: 0 } }));
      return;
    }

    if (url.includes("/api/food")) {
      await route.fulfill(json({ success: true, data: { foods: [], total: 0 } }));
      return;
    }

    if (url.includes("/api/vendors") || url.includes("/api/business")) {
      await route.fulfill(json({ success: true, data: { businesses: [], vendors: [], total: 0 } }));
      return;
    }

    if (url.includes("/api/search")) {
      await route.fulfill(json({ success: true, data: { results: [], total: 0 } }));
      return;
    }

    if (url.includes("/api/categories")) {
      await route.fulfill(json({ success: true, data: { productCategories: [], serviceCategories: [] } }));
      return;
    }

    if (url.includes("/api/users/auth/check")) {
      await route.fulfill({ status: 401, contentType: "application/json", body: '{"success":false}' });
      return;
    }

    await route.fulfill(json({ success: true, data: [] }));
  });
}
