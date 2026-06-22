import {
  authCheckUser,
  installAuthMock,
  installPublicMarketplaceMocks,
  installVendorOnboardingMocks,
  mockJson,
} from "../fixtures/api-mocks";
import { test, expect } from "../fixtures/test-base";

test.describe("Vendor onboarding hub", () => {
  test("unauthenticated /partners redirects to vendor login", async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await page.goto("/partners");
    await expect(page).toHaveURL(/\/login\?type=vendor/);
  });

  test("new vendor state shows Start Your Vendor Journey", async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await installAuthMock(page, "business_owner");
    await page.route("**/*", async (route) => {
      const url = route.request().url();
      if (url.includes("/api/users/auth/check")) {
        return mockJson(route, 200, authCheckUser("business_owner"));
      }
      if (url.includes("/api/business/my")) {
        return mockJson(route, 200, { businesses: [] });
      }
      if (url.includes("/api/vendor-onboarding/applicationId")) {
        return mockJson(route, 404, { message: "Not found" });
      }
      return route.continue();
    });
    await page.goto("/partners");
    await expect(page.getByText("Start Your Vendor Journey")).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.getByRole("button", { name: "Start Vendor Onboarding" })
    ).toBeVisible();
  });

  test("draft onboarding state shows Onboarding Status", async ({ page }) => {
    await installVendorOnboardingMocks(page, "draft", "pending");
    await page.goto("/partners");
    await expect(page.getByText("Onboarding Status")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("payment-pending state shows payment context", async ({ page }) => {
    await installVendorOnboardingMocks(page, "draft", "pending");
    await page.goto("/partners");
    await expect(page.getByText("Onboarding Status")).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/payment|verification/i).first()).toBeVisible();
  });

  test("submitted state shows submitted label", async ({ page }) => {
    await installVendorOnboardingMocks(page, "submitted", "paid");
    await page.goto("/partners");
    await expect(page.getByText("Submitted").first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("verified state shows verified label", async ({ page }) => {
    await installVendorOnboardingMocks(page, "verified", "paid");
    await page.goto("/partners");
    await expect(page.getByText("Verified").first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("rejected state shows rejected label", async ({ page }) => {
    await installVendorOnboardingMocks(page, "rejected", "paid");
    await page.goto("/partners");
    await expect(page.getByText("Rejected").first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("onboarding stepper is present when application exists", async ({
    page,
  }) => {
    await installVendorOnboardingMocks(page, "draft", "paid");
    await page.goto("/partners");
    await expect(
      page.getByRole("button", { name: "1 Business Verification" })
    ).toBeVisible({ timeout: 20_000 });
  });
});

test.describe("Admin vendor applications (mocked admin session)", () => {
  test.beforeEach(async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await installAuthMock(page, "admin");
  });

  test("admin vendor-applications list renders with mocked data", async ({
    page,
  }) => {
    await page.route("**/api/vendor-onboarding/pending**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: "507f1f77bcf86cd799439088",
              applicationId: "MBH-E2E-001",
              businessName: "E2E Test Business",
              status: "submitted",
              totalVerificationPoints: 0,
              isMinorityOwned: false,
              minorityCategories: [],
              userId: {
                _id: "507f1f77bcf86cd799439099",
                name: "E2E Vendor",
                email: "e2e-vendor@example.test",
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
              },
              createdAt: "2026-01-01T00:00:00.000Z",
            },
          ],
        }),
      })
    );

    await page.goto("/admin/vendor-applications");
    await expect(page.getByText("E2E Test Business")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("admin vendor-application detail route renders", async ({ page }) => {
    await page.route("**/api/vendor-onboarding/pending**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          applications: [
            {
              _id: "507f1f77bcf86cd799439088",
              applicationId: "MBH-E2E-001",
              businessName: "E2E Detail Business",
              status: "submitted",
            },
          ],
        }),
      })
    );
    await page.route("**/api/vendor-onboarding/**/MBH-E2E-001**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          applicationId: "MBH-E2E-001",
          businessName: "E2E Detail Business",
          status: "submitted",
        }),
      })
    );

    await page.goto("/admin/vendor-applications/MBH-E2E-001");
    await expect(page.locator("body")).not.toBeEmpty();
  });
});

test.describe("/partners funnel entry", () => {
  test("become-a-vendor page loads vendor funnel entry", async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await page.goto("/become-a-vendor");
    await expect(page).toHaveURL(/become-a-vendor/);
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
