import type { Page, Route } from "@playwright/test";
import { apiUrl } from "./env";

export const MOCK_PRODUCT_ID = "507f1f77bcf86cd799439011";
export const MOCK_BUSINESS_ID = "507f1f77bcf86cd799439012";
export const MOCK_SERVICE_ID = "507f1f77bcf86cd799439013";
export const MOCK_FOOD_ID = "507f1f77bcf86cd799439014";

const MOCK_IMAGE = "/bgdetailpage.png";

export const featuredProductsResponse = {
  products: [
    {
      _id: MOCK_PRODUCT_ID,
      title: "E2E Featured Product",
      description: "Deterministic featured product for Playwright",
      categoryId: { _id: "cat1", name: "Handmade" },
      subcategoryId: null,
      coverImage: MOCK_IMAGE,
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
      coverImage: MOCK_IMAGE,
      price: 1999,
      slug: "e2e-test-product",
      businessId: MOCK_BUSINESS_ID,
      businessDetails: { badge: "Gold" },
      status: "published",
    },
  ],
  data: [
    {
      _id: MOCK_PRODUCT_ID,
      title: "E2E Test Product",
      coverImage: MOCK_IMAGE,
      price: 1999,
      slug: "e2e-test-product",
      businessId: MOCK_BUSINESS_ID,
      businessDetails: { badge: "Gold" },
      status: "published",
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
  pagination: { currentPage: 1, totalPages: 1, totalProducts: 1 },
};

export const serviceListResponse = {
  success: true,
  data: [
    {
      _id: MOCK_SERVICE_ID,
      title: "E2E Strategy Session",
      description: "Deterministic service listing for launch evidence",
      coverImage: MOCK_IMAGE,
      averageRating: 0,
      totalReviews: 0,
      price: 7500,
      businessDetails: {
        businessName: "E2E Vendor Shop",
        description: "Launch evidence service provider",
        logo: MOCK_IMAGE,
        badge: "Gold",
      },
      businessId: {
        _id: MOCK_BUSINESS_ID,
        businessName: "E2E Vendor Shop",
        badge: "Gold",
        logo: MOCK_IMAGE,
      },
    },
  ],
  total: 1,
  page: 1,
  totalPages: 1,
  limit: 10,
};

export const foodListResponse = {
  success: true,
  data: [
    {
      _id: MOCK_FOOD_ID,
      title: "E2E Pantry Box",
      description: "Deterministic food listing for launch evidence",
      coverImage: MOCK_IMAGE,
      businessName: "E2E Food Market",
      badge: "Gold",
      businessId: {
        _id: MOCK_BUSINESS_ID,
        businessName: "E2E Food Market",
        description: "Food vendor profile fixture",
        badge: "Gold",
        logo: MOCK_IMAGE,
      },
    },
  ],
  total: 1,
  page: 1,
  totalPages: 1,
  limit: 10,
};

export const publicProductDetailResponse = {
  data: {
    _id: MOCK_PRODUCT_ID,
    title: "E2E Test Product",
    description: "Product detail fixture",
    coverImage: MOCK_IMAGE,
    images: [MOCK_IMAGE],
    price: 1999,
    slug: "e2e-test-product",
    businessId: {
      _id: MOCK_BUSINESS_ID,
      businessName: "E2E Vendor Shop",
      logo: MOCK_IMAGE,
      badge: "Gold",
    },
    variants: [
      {
        _id: "var1",
        sku: "E2E-SKU-1",
        stock: 10,
        attributes: { Size: "M", Color: "Blue" },
        price: 1999,
        images: [MOCK_IMAGE],
      },
    ],
    status: "published",
    totalReviews: 0,
    averageRating: 0,
  },
};

export const publicServiceDetailResponse = {
  success: true,
  data: {
    service: {
      _id: MOCK_SERVICE_ID,
      title: "E2E Strategy Session",
      description: "Service detail fixture",
      coverImage: MOCK_IMAGE,
      images: [MOCK_IMAGE],
      services: [
        {
          _id: "service-child-1",
          name: "Launch Readiness Review",
          description: "A focused service for launch preparation.",
          image: MOCK_IMAGE,
          durationMinutes: 60,
          price: 7500,
        },
      ],
      contact: {
        phone: "555-0100",
        email: "service@example.test",
        address: "100 Market St, Atlanta, GA",
        website: "https://mosaicbizhub.com",
      },
      businessHours: [
        { day: "Monday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Tuesday", hours: "9:00 AM - 5:00 PM", closed: false },
      ],
      averageRating: 0,
      totalReviews: 0,
      categoryId: { _id: "scat1", name: "Consulting" },
      subcategoryId: { _id: "ssub1", name: "Business Strategy" },
    },
    business: {
      _id: MOCK_BUSINESS_ID,
      businessName: "E2E Vendor Shop",
      description: "Launch evidence service provider",
      logo: MOCK_IMAGE,
      coverImage: MOCK_IMAGE,
      email: "vendor@example.test",
      phone: "555-0101",
      badge: "Gold",
      address: {
        street: "100 Market St",
        city: "Atlanta",
        state: "GA",
        country: "United States",
        zipCode: "30303",
      },
      website: "https://mosaicbizhub.com",
      socialLinks: { website: "https://mosaicbizhub.com" },
    },
  },
};

export const publicFoodDetailResponse = {
  success: true,
  data: {
    food: {
      _id: MOCK_FOOD_ID,
      businessName: "E2E Food Market",
      brand: "E2E Pantry Box",
      foodType: "Prepared foods",
      coverImage: MOCK_IMAGE,
      images: [MOCK_IMAGE],
      menuImage: MOCK_IMAGE,
      tableTypes: ["No of Seats - Up to 4"],
      bookingTimeSlots: ["9:00 AM", "10:00 AM"],
      businessHours: [
        { day: "Monday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Tuesday", hours: "9:00 AM - 5:00 PM", closed: false },
      ],
      averageRating: 0,
      totalReviews: 0,
      location: {
        address: "200 Pantry Ave, Atlanta, GA",
        coordinates: [-84.388, 33.749],
      },
      categoryId: { _id: "fcat1", name: "Restaurants" },
      subcategoryId: { _id: "fsub1", name: "Prepared Meals" },
      badge: "Gold",
    },
    business: {
      _id: MOCK_BUSINESS_ID,
      businessName: "E2E Food Market",
      description: "Launch evidence food vendor",
      logo: MOCK_IMAGE,
      coverImage: MOCK_IMAGE,
      email: "food@example.test",
      phone: "555-0102",
      badge: "Gold",
      address: {
        street: "200 Pantry Ave",
        city: "Atlanta",
        state: "GA",
        country: "United States",
        zipCode: "30303",
      },
      website: "https://mosaicbizhub.com",
      socialLinks: { website: "https://mosaicbizhub.com" },
    },
  },
};

export const rankedListResponse = {
  items: [
    {
      _id: MOCK_PRODUCT_ID,
      title: "E2E Test Product",
      coverImage: MOCK_IMAGE,
      firstEligible: { images: [MOCK_IMAGE] },
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
      logo: MOCK_IMAGE,
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
      return mockJson(route, 200, serviceListResponse);
    }
    if (matchesApiPath(url, "/api/foods/list") || matchesApiPath(url, "/api/food/list")) {
      return mockJson(route, 200, foodListResponse);
    }
    if (matchesApiPath(url, "/api/categories/services")) {
      return mockJson(route, 200, {
        data: {
          serviceCategories: [
            { _id: "scat1", name: "Consulting", slug: "consulting", img: MOCK_IMAGE },
          ],
        },
      });
    }
    if (matchesApiPath(url, "/api/admin/category/service")) {
      return mockJson(route, 200, [{ _id: "scat1", name: "Consulting" }]);
    }
    if (matchesApiPath(url, "/api/business") && !matchesApiPath(url, "/api/business/my")) {
      return mockJson(route, 200, vendorsListResponse);
    }
    if (matchesApiPath(url, "/api/categories/products")) {
      return mockJson(route, 200, {
        data: {
          productCategories: [
            { _id: "cat1", name: "Handmade", slug: "handmade", img: MOCK_IMAGE },
          ],
        },
      });
    }
    if (matchesApiPath(url, "/api/categories/foods")) {
      return mockJson(route, 200, {
        data: {
          foodCategories: [
            { _id: "fcat1", name: "Restaurants", slug: "restaurants", img: MOCK_IMAGE },
          ],
        },
      });
    }
    if (matchesApiPath(url, "/api/products/subcategories/")) {
      return mockJson(route, 200, { data: [{ _id: "psub1", name: "Accessories" }] });
    }
    if (matchesApiPath(url, "/api/services/subcategories/")) {
      return mockJson(route, 200, { data: [{ _id: "ssub1", name: "Business Strategy" }] });
    }
    if (matchesApiPath(url, "/api/foods/subcategories/")) {
      return mockJson(route, 200, { data: [{ _id: "fsub1", name: "Prepared Meals" }] });
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
    if (matchesApiPath(url, `/api/public/services/${MOCK_SERVICE_ID}`)) {
      return mockJson(route, 200, publicServiceDetailResponse);
    }
    if (matchesApiPath(url, `/api/service/${MOCK_SERVICE_ID}/reviews`)) {
      return mockJson(route, 200, {
        success: true,
        data: {
          reviews: [],
          summary: { totalReviews: 0, averageRating: 0, ratingBreakdown: {} },
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
      });
    }
    if (matchesApiPath(url, `/api/public/foods/${MOCK_FOOD_ID}`)) {
      return mockJson(route, 200, publicFoodDetailResponse);
    }
    if (matchesApiPath(url, `/api/food/${MOCK_FOOD_ID}/reviews`)) {
      return mockJson(route, 200, {
        success: true,
        data: {
          reviews: [],
          summary: { totalReviews: 0, averageRating: 0, ratingBreakdown: {} },
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
      });
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
