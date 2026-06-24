import fs from "node:fs/promises";
import path from "node:path";
import type { Page, Route } from "@playwright/test";
import {
  MOCK_BUSINESS_ID,
  MOCK_FOOD_ID,
  MOCK_PRODUCT_ID,
  MOCK_SERVICE_ID,
  assertNoDeprecatedFeaturedAlias,
  authCheckUser,
  installPublicMarketplaceMocks,
  mockJson,
} from "../fixtures/api-mocks";
import { test, expect } from "../fixtures/test-base";

const screenshotDir = path.join(
  process.cwd(),
  "docs",
  "qa-screenshots",
  "final-frontend-precutover"
);

const launchViewports = [
  { name: "320", width: 320, height: 844 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

function matchesApiPath(url: string, suffix: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.pathname.endsWith(suffix) || parsed.pathname.includes(suffix);
  } catch {
    return url.includes(suffix);
  }
}

async function continueOrFallback(route: Route) {
  const maybeFallback = route as Route & { fallback?: () => Promise<void> };
  if (typeof maybeFallback.fallback === "function") {
    return maybeFallback.fallback();
  }

  return route.continue();
}

function getRefererPath(route: Route) {
  const referer = route.request().headers().referer;
  if (!referer) return "";

  try {
    return new URL(referer).pathname;
  } catch {
    return referer;
  }
}

function getRoleForRequest(route: Route): "customer" | "business_owner" | "admin" {
  const currentPath = new URL(route.request().frame().page().url()).pathname;
  const refererPath = getRefererPath(route);
  const path = currentPath || refererPath;
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/partners")) return "business_owner";
  return "customer";
}

const activeBusiness = {
  _id: MOCK_BUSINESS_ID,
  businessName: "E2E Vendor Shop",
  listingType: "product",
  isActive: true,
  isApproved: true,
  badge: "Gold",
  address: {
    street: "100 Market St",
    city: "Atlanta",
    state: "GA",
    country: "United States",
    zipCode: "30303",
  },
};

const vendorApplication = {
  _id: "507f1f77bcf86cd799439088",
  applicationId: "MBH-E2E-001",
  businessName: "E2E Test Business",
  status: "submitted",
  totalVerificationPoints: 35,
  isMinorityOwned: true,
  minorityCategories: ["Black-owned"],
  hasEIN: true,
  hasBusinessLicense: true,
  einNumber: "12-3456789",
  licenseNumber: "LIC-E2E-001",
  ssnLast9: "",
  yearsInBusiness: "3",
  isFranchise: false,
  franchiseName: null,
  businessType: "LLC",
  hasPhysicalLocation: true,
  primaryContactName: "E2E Vendor",
  primaryContactDesignation: "Owner",
  secondaryBusinessEmail: "vendor@example.test",
  usesThirdPartyBooking: false,
  ownershipType: "Sole owner",
  employeesCount: "1-10",
  website: "https://mosaicbizhub.com",
  facebook: "",
  instagram: "",
  linkedin: null,
  tiktok: null,
  businessBio: "Sanitized vendor application used for launch evidence.",
  googleReviewLink: "",
  communityServiceLink: "",
  businessProfileImage: { url: "/bgdetailpage.png", verified: false },
  refundPolicyDocument: { url: "/bgdetailpage.png", verified: false },
  termsDocument: { url: "/bgdetailpage.png", verified: false },
  userId: {
    _id: "507f1f77bcf86cd799439099",
    name: "E2E Vendor",
    email: "vendor@example.test",
  },
  address: {
    street: "100 Market St",
    city: "Atlanta",
    state: "GA",
    country: "United States",
    zipCode: "30303",
  },
  verificationPayment: { status: "paid" },
  verificationChecklist: {
    minorityDocs: false,
    taxDocs: false,
    businessLicense: false,
    website: false,
    facebook: false,
    instagram: false,
    linkedin: false,
    tiktok: false,
    businessProfileImage: false,
    businessBio: true,
    refundPolicyDocument: false,
    termsDocument: false,
    googleReviewLink: false,
    communityServiceLink: false,
  },
  minorityProofDocuments: [
    { _id: "doc-minority-1", url: "/bgdetailpage.png", verified: false },
  ],
  taxDocuments: [{ _id: "doc-tax-1", url: "/bgdetailpage.png", verified: false }],
  businessLicenseDocuments: [
    { _id: "doc-license-1", url: "/bgdetailpage.png", verified: false },
  ],
  acceptedTerms: true,
  declarationAccepted: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  badge: "Silver",
  primaryPhone: "555-0100",
  businessEmail: "vendor@example.test",
};

async function installFinalEvidenceMocks(page: Page) {
  await assertNoDeprecatedFeaturedAlias(page);
  await installPublicMarketplaceMocks(page);

  await page.route("**/*", async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (matchesApiPath(url, "/api/users/auth/check")) {
      return mockJson(route, 200, authCheckUser(getRoleForRequest(route)));
    }

    if (matchesApiPath(url, "/api/users/logout")) {
      return mockJson(route, 200, { success: true });
    }

    if (matchesApiPath(url, "/api/business/my")) {
      const currentPath = new URL(page.url()).pathname;
      const refererPath = getRefererPath(route);
      const path = currentPath || refererPath;
      const shouldHaveBusiness =
        path.startsWith("/partners/dashboard") ||
        path.startsWith("/partners/products") ||
        path.startsWith("/partners/payout-setup") ||
        path.startsWith("/checkout");

      return mockJson(route, 200, {
        businesses: shouldHaveBusiness ? [activeBusiness] : [],
      });
    }

    if (matchesApiPath(url, "/api/vendor-onboarding/applicationId")) {
      return mockJson(route, 200, {
        success: true,
        applicationId: "MBH-E2E-001",
      });
    }

    if (matchesApiPath(url, "/api/vendor-onboarding/status/")) {
      return mockJson(route, 200, {
        success: true,
        data: {
          applicationId: "MBH-E2E-001",
          businessName: "E2E Test Business",
          currentStage: 1,
          status: "draft",
          nextAction: "continue",
          details: {
            stage1: { status: "draft", points: 0, paymentStatus: "paid" },
            stage2: { status: "pending" },
            stage3: { status: "not_started", totalPoints: 0 },
          },
        },
      });
    }

    if (matchesApiPath(url, "/api/vendor-onboarding/pending")) {
      return mockJson(route, 200, { success: true, data: [vendorApplication] });
    }

    if (
      method === "GET" &&
      matchesApiPath(url, "/api/vendor-onboarding/MBH-E2E-001")
    ) {
      return mockJson(route, 200, { success: true, data: vendorApplication });
    }

    if (matchesApiPath(url, `/api/product/business/${MOCK_BUSINESS_ID}`)) {
      return mockJson(route, 200, {
        success: true,
        products: [
          {
            _id: MOCK_PRODUCT_ID,
            title: "E2E Test Product",
            coverImage: "/bgdetailpage.png",
            categoryId: { _id: "cat1", name: "Handmade" },
            subcategoryId: { _id: "psub1", name: "Accessories" },
            totalStock: 12,
            status: "published",
            price: 1999,
            priceRange: { min: 1999, max: 1999 },
            businessId: MOCK_BUSINESS_ID,
            createdAt: "2026-01-01T00:00:00.000Z",
            variants: [],
          },
        ],
      });
    }

    if (matchesApiPath(url, `/api/product/delete-product/${MOCK_PRODUCT_ID}`)) {
      return mockJson(route, 200, {
        success: true,
        message: "Product deleted successfully",
      });
    }

    if (matchesApiPath(url, "/api/cart") && !matchesApiPath(url, "/api/cart/")) {
      return mockJson(route, 200, {
        cart: {
          items: [
            {
              _id: "cart-item-1",
              productId: MOCK_PRODUCT_ID,
              variantId: "var1",
              size: "M",
              quantity: 1,
              title: "E2E Test Product",
              price: 1999,
              selectedSizePrice: 1999,
            },
          ],
        },
        pricing: { subtotal: 1999, total: 1999, tax: 0, shipping: 0 },
      });
    }

    if (matchesApiPath(url, "/api/cart/products/mini")) {
      return mockJson(route, 200, {
        products: [
          {
            _id: MOCK_PRODUCT_ID,
            title: "E2E Test Product",
            coverImage: "/bgdetailpage.png",
            businessId: MOCK_BUSINESS_ID,
          },
        ],
      });
    }

    if (matchesApiPath(url, "/api/cart/variants/mini")) {
      return mockJson(route, 200, {
        variants: [
          {
            _id: "var1",
            productId: MOCK_PRODUCT_ID,
            price: 1999,
            size: "M",
            stock: 12,
          },
        ],
      });
    }

    if (matchesApiPath(url, "/api/orders/initiate")) {
      return mockJson(route, 200, {
        clientSecret: "pi_e2e_mock_secret",
        paymentIntentId: "pi_e2e_mock_intent",
      });
    }

    if (matchesApiPath(url, "/api/enquiries/vendor")) {
      return mockJson(route, 200, { success: true, data: [] });
    }

    if (matchesApiPath(url, "/api/orders/vendor")) {
      return mockJson(route, 200, { success: true, orders: [] });
    }

    if (matchesApiPath(url, "/api/business/") && matchesApiPath(url, "/tax-settings")) {
      return mockJson(route, 200, {
        success: true,
        data: { registeredState: "GA", collectTax: false, nexusStates: [] },
      });
    }

    if (matchesApiPath(url, "/api/business/") && matchesApiPath(url, "/shipping-settings")) {
      return mockJson(route, 200, {
        success: true,
        data: { shipsFromState: "GA", freeShippingThreshold: null },
      });
    }

    if (matchesApiPath(url, "/api/connect/")) {
      return mockJson(route, 200, {
        success: true,
        data: {
          isConnected: false,
          onboardingStatus: "requirements_due",
          chargesEnabled: false,
          payoutsEnabled: false,
        },
      });
    }

    return continueOrFallback(route);
  });

  await page.addInitScript(([productId]) => {
    window.localStorage.setItem("user_session", "true");
    window.localStorage.setItem("cart", JSON.stringify([
      {
        productId,
        variantId: "var1",
        size: "M",
        quantity: 1,
        price: 1999,
        selectedSizePrice: 1999,
        image: "/bgdetailpage.png",
        title: "E2E Test Product",
        color: "Blue",
        label: "E2E-SKU-1",
      },
    ]));
  }, [MOCK_PRODUCT_ID]);
}

async function assertNoBodyOverflow(page: Page, routeName = page.url()) {
  async function measure() {
    return page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const width = Math.max(doc.scrollWidth, body?.scrollWidth ?? 0);
      const viewport = window.innerWidth;
      return {
        width,
        viewport,
        overflowBy: width - viewport,
      };
    });
  }

  let result: Awaited<ReturnType<typeof measure>>;
  try {
    result = await measure();
  } catch (error) {
    if (String(error).includes("Execution context was destroyed")) {
      await page.waitForLoadState("domcontentloaded");
      result = await measure();
    } else {
      throw error;
    }
  }

  expect(
    result.overflowBy,
    `${routeName} body overflowed by ${result.overflowBy}px`
  ).toBeLessThanOrEqual(2);
}

async function capture(page: Page, name: string) {
  await expect(page.locator("body")).not.toBeEmpty();
  await page.waitForTimeout(350);
  await assertNoBodyOverflow(page, name);
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true,
    animations: "disabled",
  });
}

test.describe("Final frontend pre-cutover evidence", () => {
  test.setTimeout(120_000);

  test.beforeAll(async () => {
    await fs.mkdir(screenshotDir, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await installFinalEvidenceMocks(page);
  });

  test("captures required sanitized screenshot matrix", async ({ page }) => {
    const screenshots = [
      { name: "homepage-390", path: "/", viewport: "390" },
      { name: "homepage-1440", path: "/", viewport: "1440" },
      { name: "marketplace-products-390", path: "/products", viewport: "390" },
      { name: "marketplace-products-1440", path: "/products", viewport: "1440" },
      { name: "badge-filter-services-390", path: "/services?badge=gold", viewport: "390" },
      {
        name: "location-filter-services-390",
        path: "/services?state=Georgia&country=United+States",
        viewport: "390",
      },
      { name: "product-detail-390", path: `/product/${MOCK_PRODUCT_ID}`, viewport: "390" },
      {
        name: "service-detail-390",
        path: `/vendor-profile/service-vendor/${MOCK_SERVICE_ID}`,
        viewport: "390",
      },
      {
        name: "food-detail-390",
        path: `/vendor-profile/food-vendor/${MOCK_FOOD_ID}`,
        viewport: "390",
      },
      { name: "registration-390", path: "/signup?type=customer", viewport: "390" },
      {
        name: "otp-390",
        path: "/verify-otp?email=qa%40example.test&type=customer",
        viewport: "390",
      },
      { name: "vendor-onboarding-390", path: "/partners", viewport: "390" },
      {
        name: "vendor-dashboard-1440",
        path: "/partners/dashboard?tab=manage-listings",
        viewport: "1440",
      },
      {
        name: "cart-390",
        path: "/cart",
        viewport: "390",
      },
      {
        name: "checkout-entry-390",
        path: "/checkout/address?type=cart",
        viewport: "390",
      },
      {
        name: "admin-vendor-review-1440",
        path: "/admin/vendor-applications/MBH-E2E-001",
        viewport: "1440",
      },
    ] as const;

    for (const shot of screenshots) {
      const viewport = launchViewports.find((candidate) => candidate.name === shot.viewport);
      if (!viewport) throw new Error(`Unknown viewport ${shot.viewport}`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(shot.path, { waitUntil: "domcontentloaded" });

      if (shot.name === "product-delete-confirmation-390") {
        await page.locator('button[title="Delete"]').first().click();
      }

      await capture(page, shot.name);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/partners/dashboard?tab=manage-listings", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Added Products")).toBeVisible({ timeout: 20_000 });
    await page
      .getByRole("button", { name: /delete/i })
      .or(page.locator('button[title="Delete"]'))
      .first()
      .click();
    await expect(page.getByText("Delete Product")).toBeVisible();
    await capture(page, "product-delete-confirmation-390");
  });

  for (const viewport of launchViewports) {
    test(`checks no body overflow at ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const routes = [
        "/",
        "/products",
        "/services",
        "/foods",
        "/services?badge=gold",
        "/services?state=Georgia&country=United+States",
        `/product/${MOCK_PRODUCT_ID}`,
        `/vendor-profile/service-vendor/${MOCK_SERVICE_ID}`,
        `/vendor-profile/food-vendor/${MOCK_FOOD_ID}`,
        "/login?type=customer",
        "/signup?type=customer",
        "/verify-otp?email=qa%40example.test&type=customer",
        "/partners",
        "/partners/dashboard?tab=manage-listings",
        "/partners/products",
        "/cart",
        "/checkout/address?type=cart",
        "/admin/vendor-applications/MBH-E2E-001",
      ];

      for (const route of routes) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.locator("body"), `${route} body`).not.toBeEmpty();
        await page.waitForTimeout(150);
        await assertNoBodyOverflow(page, route);
      }
    });
  }
});
