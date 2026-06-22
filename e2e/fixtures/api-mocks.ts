import type { Page, Route } from "@playwright/test";
import { apiUrl } from "./env";

export const MOCK_PRODUCT_ID = "507f1f77bcf86cd799439011";
export const MOCK_BUSINESS_ID = "507f1f77bcf86cd799439012";

export const featuredProductsResponse = {
  products: [
    {
      _id: MOCK_PRODUCT_ID,
      title: "E2E Featured Product",
      description: "Deterministic featured product for Playwright",
      categoryId: { _id: "cat1", name: "Handmade" },
      subcategoryId: null,
      coverImage: "https://placehold.co/400x400/png",
      slug: "e2e-featured-product",
      createdAt: "2026-01-01T00:00:00.000Z",
      price: 2499,
      category: { _id: "cat1", name: "Handmade" },
      subcategory: null,
    },
  ],
  pagination: { currentPage: 1, totalPages: 1, totalProducts: 1 },
};

export const emptyListResponse = {
  products: [],
  pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 },
};

export const productListResponse = {
  products: [
    {
      _id: MOCK_PRODUCT_ID,
      title: "E2E Test Product",
      coverImage: "https://placehold.co/400x400/png",
      price: 1999,
      slug: "e2e-test-product",
      businessId: MOCK_BUSINESS_ID,
      status: "published",
    },
  ],
  pagination: { currentPage: 1, totalPages: 1, totalProducts: 1 },
};

export const publicProductDetailResponse = {
  data: {
    _id: MOCK_PRODUCT_ID,
    title: "E2E Test Product",
    description: "Product detail fixture",
    coverImage: "https://placehold.co/600x600/png",
    images: ["https://placehold.co/600x600/png"],
    price: 1999,
    slug: "e2e-test-product",
    businessId: {
      _id: MOCK_BUSINESS_ID,
      businessName: "E2E Vendor Shop",
      logo: "https://placehold.co/80x80/png",
    },
    variants: [
      {
        _id: "var1",
        sku: "E2E-SKU-1",
        stock: 10,
        attributes: { Size: "M", Color: "Blue" },
        price: 1999,
        images: ["https://placehold.co/600x600/png"],
      },
    ],
    status: "published",
    totalReviews: 0,
    averageRating: 0,
  },
};

export const rankedListResponse = {
  items: [
    {
      _id: MOCK_PRODUCT_ID,
      title: "E2E Test Product",
      coverImage: "https://placehold.co/400x400/png",
      firstEligible: { images: ["https://placehold.co/400x400/png"] },
    },
  ],
  pagination: { page: 1, pageSize: 8, total: 1 },
};

export const searchEmptyResponse = {
  products: [],
  services: [],
  foods: [],
  businesses: [],
  pagination: { page: 1, limit: 12, total: 0 },
};

export const vendorsListResponse = {
  businesses: [
    {
      _id: MOCK_BUSINESS_ID,
      businessName: "E2E Vendor Shop",
      logo: "https://placehold.co/80x80/png",
      listingType: "product",
      slug: "e2e-vendor-shop",
    },
  ],
  pagination: { currentPage: 1, totalPages: 1, totalBusinesses: 1 },
};

export const authCheckUnauthenticated = { message: "Unauthorized" };

export function authCheckUser(role: "customer" | "business_owner" | "admin") {
  return {
    user: {
      id: "507f1f77bcf86cd799439099",
      name: `E2E ${role}`,
      email: `e2e-${role}@example.test`,
      role,
      mobile: "5555550100",
    },
  };
}

export function mockJson(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

function matchesApiPath(url: string, suffix: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.pathname.endsWith(suffix) || parsed.pathname.includes(suffix);
  } catch {
    return url.includes(suffix);
  }
}

/** Intercept common public marketplace API calls with deterministic fixtures. */
export async function installPublicMarketplaceMocks(page: Page) {
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (matchesApiPath(url, "/api/featured-products")) {
      return mockJson(route, 200, featuredProductsResponse);
    }
    if (matchesApiPath(url, "/api/products/list")) {
      return mockJson(route, 200, productListResponse);
    }
    if (matchesApiPath(url, "/api/services/list")) {
      return mockJson(route, 200, emptyListResponse);
    }
    if (matchesApiPath(url, "/api/foods/list") || matchesApiPath(url, "/api/food/list")) {
      return mockJson(route, 200, emptyListResponse);
    }
    if (matchesApiPath(url, "/api/categories/services")) {
      return mockJson(route, 200, [{ _id: "scat1", name: "Consulting" }]);
    }
    if (matchesApiPath(url, "/api/admin/category/service")) {
      return mockJson(route, 200, [{ _id: "scat1", name: "Consulting" }]);
    }
    if (matchesApiPath(url, "/api/business") && !matchesApiPath(url, "/api/business/my")) {
      return mockJson(route, 200, vendorsListResponse);
    }
    if (matchesApiPath(url, "/api/categories/products")) {
      return mockJson(route, 200, [{ _id: "cat1", name: "Handmade" }]);
    }
    if (matchesApiPath(url, "/api/minority-types")) {
      return mockJson(route, 200, []);
    }
    if (matchesApiPath(url, "/api/business/list")) {
      return mockJson(route, 200, vendorsListResponse);
    }
    if (matchesApiPath(url, "/api/search")) {
      return mockJson(route, 200, searchEmptyResponse);
    }
    if (matchesApiPath(url, "/api/ranked")) {
      return mockJson(route, 200, rankedListResponse);
    }
    if (matchesApiPath(url, `/api/public/product/${MOCK_PRODUCT_ID}`)) {
      return mockJson(route, 200, publicProductDetailResponse);
    }
    if (matchesApiPath(url, `/api/product/${MOCK_PRODUCT_ID}/reviews`)) {
      return mockJson(route, 200, {
        data: {
          reviews: [],
          summary: { totalReviews: 0, averageRating: 0, ratingBreakdown: {} },
        },
      });
    }
    if (matchesApiPath(url, `/api/products/${MOCK_PRODUCT_ID}`)) {
      return mockJson(route, 200, publicProductDetailResponse);
    }
    if (matchesApiPath(url, "/api/users/auth/check")) {
      return mockJson(route, 401, authCheckUnauthenticated);
    }
    if (matchesApiPath(url, "/api/cart") && !matchesApiPath(url, "/api/cart/")) {
      return mockJson(route, 200, {
        cart: { items: [] },
        pricing: { subtotal: 0, total: 0 },
      });
    }

    return route.continue();
  });
}

export async function installAuthMock(page: Page, role: "customer" | "business_owner" | "admin") {
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (matchesApiPath(url, "/api/users/auth/check")) {
      return mockJson(route, 200, authCheckUser(role));
    }

    return route.continue();
  });
}

export function buildOnboardingStatusFixture(
  stage1Status: string,
  paymentStatus: "pending" | "paid" | "failed" = "paid"
) {
  return {
    success: true,
    data: {
      applicationId: "MBH-E2E-001",
      businessName: "E2E Test Business",
      currentStage: 1,
      status: stage1Status,
      nextAction: "continue",
      details: {
        stage1: {
          status: stage1Status,
          points: 0,
          paymentStatus,
        },
        stage2: { status: "pending" },
        stage3: { status: "not_started", totalPoints: 0 },
      },
    },
  };
}

export async function installVendorOnboardingMocks(
  page: Page,
  stage1Status: string,
  paymentStatus: "pending" | "paid" | "failed" = "paid"
) {
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (matchesApiPath(url, "/api/users/auth/check")) {
      return mockJson(route, 200, authCheckUser("business_owner"));
    }
    if (matchesApiPath(url, "/api/business/my")) {
      return mockJson(route, 200, { businesses: [] });
    }
    if (matchesApiPath(url, "/api/vendor-onboarding/applicationId")) {
      return mockJson(route, 200, {
        success: true,
        applicationId: "MBH-E2E-001",
      });
    }
    if (matchesApiPath(url, "/api/vendor-onboarding/status/")) {
      return mockJson(
        route,
        200,
        buildOnboardingStatusFixture(stage1Status, paymentStatus)
      );
    }
    if (matchesApiPath(url, "/api/vendor-onboarding/pending")) {
      return mockJson(route, 200, {
        success: true,
        data: [
          {
            _id: "507f1f77bcf86cd799439088",
            applicationId: "MBH-E2E-001",
            businessName: "E2E Test Business",
            status: stage1Status,
            totalVerificationPoints: 0,
            isMinorityOwned: false,
            minorityCategories: [],
            userId: {
              _id: "507f1f77bcf86cd799439099",
              name: "E2E Vendor",
              email: "e2e-vendor@example.test",
            },
            verificationPayment: { status: paymentStatus },
            verificationChecklist: {
              minorityDocs: false,
              taxDocs: false,
              businessLicense: false,
              website: false,
              facebook: false,
              instagram: false,
              linkedin: false,
              tiktok: false,
            },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      });
    }

    return route.continue();
  });
}

export async function installCommerceMocks(page: Page) {
  await installPublicMarketplaceMocks(page);

  await page.route("**/*", async (route) => {
    const url = route.request().url();

    if (matchesApiPath(url, "/api/users/auth/check")) {
      return mockJson(route, 200, authCheckUser("customer"));
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
    if (matchesApiPath(url, "/api/orders/initiate")) {
      return mockJson(route, 200, {
        clientSecret: "pi_e2e_mock_secret",
        paymentIntentId: "pi_e2e_mock_intent",
      });
    }
    if (matchesApiPath(url, "/api/orders/retrieve-intent/")) {
      return mockJson(route, 200, {
        paymentIntent: {
          id: "pi_e2e_mock_intent",
          amount: 1999,
          currency: "usd",
          status: "succeeded",
          created: 1704067200,
          receipt_email: "e2e-customer@example.test",
        },
        orders: [],
      });
    }

    return route.continue();
  });
}

/** Assert the app never calls the deprecated featured-products alias. */
export async function assertNoDeprecatedFeaturedAlias(page: Page) {
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("/api/products/featured")) {
      throw new Error(
        `Deprecated endpoint requested: ${url}. Use GET /api/featured-products.`
      );
    }
  });
}

export { apiUrl };
