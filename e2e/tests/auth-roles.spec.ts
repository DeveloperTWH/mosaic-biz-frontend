import {
  installAuthMock,
  installPublicMarketplaceMocks,
} from "../fixtures/api-mocks";
import {
  E2E_CREDENTIAL_VARS,
  hasAdminCredentials,
  hasCustomerCredentials,
  hasVendorCredentials,
} from "../fixtures/env";
import {
  test,
  expect,
  skipUnlessAdminCredentials,
  skipUnlessCustomerCredentials,
  skipUnlessVendorCredentials,
  loginViaUi,
  loginAdminViaUi,
} from "../fixtures/test-base";

test.describe("Authentication pages (public)", () => {
  test.beforeEach(async ({ page }) => {
    await installPublicMarketplaceMocks(page);
  });

  test("customer login page renders", async ({ page }) => {
    await page.goto("/login?type=customer");
    await expect(page.getByRole("heading", { name: "SIGN IN" })).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
  });

  test("vendor login page renders", async ({ page }) => {
    await page.goto("/login?type=vendor");
    await expect(
      page.getByRole("heading", { name: "WELCOME BACK TO YOUR STOREFRONT" })
    ).toBeVisible();
    await expect(page.getByText("Vendor", { exact: true })).toBeVisible();
  });

  test("invalid login type shows error", async ({ page }) => {
    await page.goto("/login?type=invalid");
    await expect(page.getByText("Invalid login type.")).toBeVisible();
  });

  test("admin signin page renders", async ({ page }) => {
    await page.goto("/signin");
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });
});

test.describe("Protected route redirects (unauthenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await installPublicMarketplaceMocks(page);
  });

  test("unauthenticated admin route redirects to signin without loop", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/signin/);
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/\/signin/);
  });

  test("unauthenticated vendor hub redirects to vendor login", async ({
    page,
  }) => {
    await page.goto("/partners");
    await expect(page).toHaveURL(/\/login\?type=vendor/);
  });
});

test.describe("Role access with mocked session", () => {
  test("customer can reach customer orders with mocked auth", async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await installAuthMock(page, "customer");

    await page.route("**/api/orders/customer**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ orders: [] }),
      })
    );

    await page.goto("/customer/order");
    await expect(page.getByPlaceholder("Search by product or order details")).toBeVisible({ timeout: 20_000 });
  });

  test("vendor role reaches partners hub with mocked auth", async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await installAuthMock(page, "business_owner");

    await page.route("**/api/business/my**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ businesses: [] }),
      })
    );
    await page.route("**/api/vendor-onboarding/applicationId**", (route) =>
      route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Not found" }),
      })
    );

    await page.goto("/partners");
    await expect(page.getByText("Start Your Vendor Journey")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("wrong role rejected from admin with mocked customer session", async ({
    page,
  }) => {
    await installPublicMarketplaceMocks(page);
    await installAuthMock(page, "customer");

    await page.goto("/admin");
    await expect(page.getByText("Admin access required")).toBeVisible({
      timeout: 20_000,
    });
  });
});

test.describe("Live credential flows (explicit skip when unset)", () => {
  test("live customer login when credentials configured", async ({ page }) => {
    skipUnlessCustomerCredentials();
    await installPublicMarketplaceMocks(page);

    await loginViaUi(
      page,
      "customer",
      process.env[E2E_CREDENTIAL_VARS.customer.email]!,
      process.env[E2E_CREDENTIAL_VARS.customer.password]!
    );

    await expect(page).not.toHaveURL(/\/login/);
  });

  test("live vendor login when credentials configured", async ({ page }) => {
    skipUnlessVendorCredentials();
    await installPublicMarketplaceMocks(page);

    await loginViaUi(
      page,
      "vendor",
      process.env[E2E_CREDENTIAL_VARS.vendor.email]!,
      process.env[E2E_CREDENTIAL_VARS.vendor.password]!
    );

    await expect(page).toHaveURL(/\/partners/);
  });

  test("live admin login when credentials configured", async ({ page }) => {
    skipUnlessAdminCredentials();
    await installPublicMarketplaceMocks(page);

    await loginAdminViaUi(
      page,
      process.env[E2E_CREDENTIAL_VARS.admin.email]!,
      process.env[E2E_CREDENTIAL_VARS.admin.password]!
    );

    await expect(page).toHaveURL(/\/admin/);
  });

  test("reports skip reason when customer credentials missing", async () => {
    test.skip(hasCustomerCredentials(), "Only runs when credentials are absent");
    expect(hasCustomerCredentials()).toBe(false);
  });
});
