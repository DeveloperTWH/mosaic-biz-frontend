import fs from "fs";
import path from "path";
import type { Page, Route } from "@playwright/test";
import type { AuthRole } from "./authSession";
import { getSessionUser } from "./authSession";

export const API_BASE = "http://127.0.0.1:3099";

export type OnboardingState =
  | "none"
  | "draft"
  | "payment-pending"
  | "submitted"
  | "verified"
  | "rejected";

export interface MockOptions {
  auth?: AuthRole | "unauth";
  onboarding?: OnboardingState;
  /** When true, unmatched API calls return 404 instead of empty JSON. */
  strict?: boolean;
}

const FIXTURES_DIR = path.join(__dirname, "../fixtures/api");

function loadFixture<T = unknown>(filename: string): T {
  const filePath = path.join(FIXTURES_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function jsonResponse(route: Route, body: unknown, status = 200): Promise<void> {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

function matchPath(pathname: string, pattern: string): boolean {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return false;
  return patternParts.every((part, i) =>
    part.startsWith(":") ? true : part === pathParts[i]
  );
}

function onboardingStatusFixture(state: OnboardingState) {
  const map: Record<OnboardingState, string> = {
    none: "vendor-onboarding-none.json",
    draft: "vendor-onboarding-draft.json",
    "payment-pending": "vendor-onboarding-payment-pending.json",
    submitted: "vendor-onboarding-submitted.json",
    verified: "vendor-onboarding-verified.json",
    rejected: "vendor-onboarding-rejected.json",
  };
  return loadFixture(map[state]);
}

export interface MockTracker {
  requests: { method: string; pathname: string }[];
  forbiddenHits: string[];
}

export async function setupMocks(
  page: Page,
  options: MockOptions = {}
): Promise<MockTracker> {
  const auth = options.auth ?? "unauth";
  const onboarding = options.onboarding ?? "none";
  const strict = options.strict ?? false;
  const tracker: MockTracker = { requests: [], forbiddenHits: [] };

  await page.route(`${API_BASE}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const method = request.method();

    tracker.requests.push({ method, pathname });

    if (pathname.includes("/api/products/featured")) {
      tracker.forbiddenHits.push(pathname);
      return jsonResponse(route, { message: "Forbidden route in E2E" }, 404);
    }

    // Auth
    if (method === "GET" && matchPath(pathname, "/api/users/auth/check")) {
      if (auth === "unauth") {
        return jsonResponse(route, { message: "Unauthorized" }, 401);
      }
      return jsonResponse(route, { user: getSessionUser(auth) });
    }

    if (method === "POST" && matchPath(pathname, "/api/users/logout")) {
      return jsonResponse(route, { success: true });
    }

    // Marketplace — public reads
    if (method === "GET" && pathname.startsWith("/api/featured-products")) {
      return jsonResponse(route, loadFixture("featured-products.json"));
    }

    if (method === "GET" && pathname.startsWith("/api/ranked")) {
      return jsonResponse(route, loadFixture("ranked.json"));
    }

    if (method === "GET" && pathname.startsWith("/api/products/list")) {
      return jsonResponse(route, loadFixture("products-list.json"));
    }

    if (method === "GET" && pathname.startsWith("/api/services/list")) {
      return jsonResponse(route, loadFixture("services-list.json"));
    }

    if (method === "GET" && pathname.startsWith("/api/food/list")) {
      return jsonResponse(route, loadFixture("food-list.json"));
    }

    if (method === "GET" && matchPath(pathname, "/api/categories/products")) {
      return jsonResponse(route, loadFixture("categories-products.json"));
    }

    if (method === "GET" && matchPath(pathname, "/api/categories/services")) {
      return jsonResponse(route, loadFixture("categories-services.json"));
    }

    if (method === "GET" && matchPath(pathname, "/api/minority-types")) {
      const fixture = loadFixture<unknown>("minority-types.json");
      return jsonResponse(route, fixture);
    }

    if (method === "GET" && pathname.startsWith("/api/business")) {
      if (pathname === "/api/business/my") {
        if (auth === "business_owner" && onboarding === "none") {
          return jsonResponse(route, loadFixture("business-my-empty.json"));
        }
        if (auth === "business_owner") {
          return jsonResponse(route, loadFixture("business-my-ok.json"));
        }
        if (auth === "unauth") {
          return jsonResponse(route, { message: "Unauthorized" }, 401);
        }
        return jsonResponse(route, { message: "Forbidden" }, 403);
      }
      return jsonResponse(route, loadFixture("business-directory.json"));
    }

    if (method === "GET" && pathname.startsWith("/api/public/search")) {
      return jsonResponse(route, loadFixture("public-search.json"));
    }

    if (method === "GET" && pathname.startsWith("/api/public/product/")) {
      const id = pathname.split("/").pop() ?? "";
      if (id === "nonexistent-id") {
        return jsonResponse(route, { message: "Not found" }, 404);
      }
      return jsonResponse(route, loadFixture("product-detail.json"));
    }

    if (method === "GET" && pathname.includes("/reviews")) {
      return jsonResponse(route, { reviews: [], total: 0, page: 1 });
    }

    if (method === "GET" && matchPath(pathname, "/api/cart/count")) {
      return jsonResponse(route, { count: auth === "customer" ? 1 : 0 });
    }

    // Vendor onboarding
    if (method === "GET" && matchPath(pathname, "/api/vendor-onboarding/applicationId")) {
      if (onboarding === "none") {
        return jsonResponse(route, { success: false }, 404);
      }
      return jsonResponse(route, {
        success: true,
        applicationId: "e2e-app-001",
      });
    }

    if (method === "GET" && pathname.startsWith("/api/vendor-onboarding/status/")) {
      if (onboarding === "none") {
        return jsonResponse(route, { message: "Not found" }, 404);
      }
      return jsonResponse(route, onboardingStatusFixture(onboarding));
    }

    if (method === "GET" && matchPath(pathname, "/api/vendor-onboarding/pending")) {
      return jsonResponse(route, loadFixture("admin-vendor-applications.json"));
    }

    if (
      method === "GET" &&
      pathname.startsWith("/api/vendor-onboarding/") &&
      !pathname.includes("/status/") &&
      pathname !== "/api/vendor-onboarding/applicationId" &&
      pathname !== "/api/vendor-onboarding/pending" &&
      pathname !== "/api/vendor-onboarding/draft"
    ) {
      return jsonResponse(route, loadFixture("admin-vendor-application-detail.json"));
    }

    if (method === "GET" && matchPath(pathname, "/api/vendor-onboarding/draft")) {
      return jsonResponse(route, loadFixture("vendor-onboarding-draft-payload.json"));
    }

    if (
      method === "POST" &&
      pathname.startsWith("/api/vendor-onboarding/stage1/create-payment")
    ) {
      return jsonResponse(route, {
        success: true,
        clientSecret: "pi_mock_secret",
        paymentIntentId: "pi_mock",
      });
    }

    // Commerce
    if (method === "GET" && matchPath(pathname, "/api/cart")) {
      return jsonResponse(route, loadFixture("cart-with-item.json"));
    }

    if (method === "POST" && matchPath(pathname, "/api/cart/add")) {
      return jsonResponse(route, { success: true, count: 1 });
    }

    if (method === "GET" && pathname.startsWith("/api/cart/products/mini")) {
      return jsonResponse(route, loadFixture("cart-products-mini.json"));
    }

    if (method === "POST" && matchPath(pathname, "/api/cart/variants/mini")) {
      return jsonResponse(route, { variants: [] });
    }

    if (method === "POST" && matchPath(pathname, "/api/orders/initiate")) {
      const body = request.postDataJSON() as Record<string, unknown> | null;
      if (!body?.items || !body?.shippingAddress) {
        return jsonResponse(route, { message: "Validation failed" }, 422);
      }
      return jsonResponse(route, loadFixture("order-initiate-success.json"));
    }

    if (method === "GET" && pathname.startsWith("/api/orders/retrieve-intent/")) {
      return jsonResponse(route, loadFixture("order-retrieve-intent.json"));
    }

    if (method === "GET" && matchPath(pathname, "/api/orders/user")) {
      return jsonResponse(route, { orders: [] });
    }

    if (method === "GET" && matchPath(pathname, "/api/admin/business")) {
      return jsonResponse(route, { data: [], total: 0, page: 1, limit: 4 });
    }

    if (strict) {
      return jsonResponse(route, { message: `Unmocked: ${method} ${pathname}` }, 404);
    }

    return jsonResponse(route, {});
  });

  return tracker;
}

export function assertNoForbiddenRoutes(tracker: MockTracker): void {
  if (tracker.forbiddenHits.length > 0) {
    throw new Error(
      `Forbidden route(s) called: ${tracker.forbiddenHits.join(", ")}`
    );
  }
}

export function assertFeaturedProductsCalled(tracker: MockTracker): void {
  const hit = tracker.requests.some(
    (r) => r.method === "GET" && r.pathname.startsWith("/api/featured-products")
  );
  if (!hit) {
    throw new Error("Expected GET /api/featured-products to be called");
  }
}
