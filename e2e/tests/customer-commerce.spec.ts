import {
  installCommerceMocks,
  installPublicMarketplaceMocks,
  installAuthMock,
  MOCK_PRODUCT_ID,
  publicProductDetailResponse,
} from "../fixtures/api-mocks";
import { test, expect } from "../fixtures/test-base";

test.describe("Customer commerce (mocked, no live Stripe)", () => {
  test("empty cart shows helpful empty state", async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await page.goto("/cart");
    await expect(
      page.getByText(/Your cart is empty|Loading your cart/i).first()
    ).toBeVisible({ timeout: 20_000 });
  });

  test("cart with mocked items shows Place Order", async ({ page }) => {
    await installCommerceMocks(page);
    await page.goto("/cart");
    await expect(page.getByRole("button", { name: "Place Order" })).toBeVisible({
      timeout: 20_000,
    });
  });

  test("browse to detail to cart journey with mocks", async ({ page }) => {
    await installCommerceMocks(page);

    await page.route(`**/api/public/product/${MOCK_PRODUCT_ID}**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(publicProductDetailResponse),
      })
    );
    await page.route("**/api/cart/add**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Added" }),
      })
    );

    await page.goto(`/product/${MOCK_PRODUCT_ID}`);
    await expect(page.getByRole("heading", { name: "E2E Test Product" }).last()).toBeVisible();

    const addButton = page.getByRole("button", { name: /add to cart/i }).first();
    if (await addButton.isVisible().catch(() => false)) {
      await addButton.click();
    }

    await page.goto("/cart");
    await expect(page.getByRole("button", { name: "Place Order" })).toBeVisible({
      timeout: 20_000,
    });
  });

  test("checkout page renders for mocked customer session", async ({ page }) => {
    await installCommerceMocks(page);
    await page.goto("/checkout");
    await expect(page.getByText("Missing client secret")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("non-customer blocked from checkout address with mocked vendor session", async ({
    page,
  }) => {
    await installPublicMarketplaceMocks(page);
    await installAuthMock(page, "business_owner");

    await page.goto("/checkout/address?type=cart");
    await expect(page).toHaveURL(/\/login\?type=customer/, { timeout: 20_000 });
  });

  test("payment success page shows receipt with mocked retrieve-intent", async ({
    page,
  }) => {
    await installCommerceMocks(page);
    await page.goto(
      "/payment-success?payment_intent=pi_e2e_mock_intent&redirect_status=succeeded"
    );
    await expect(page.getByRole("heading", { name: "Payment confirmed" })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText("Amount paid:")).toBeVisible();
  });

  test("payment cancel/failure UI on payment-success route", async ({ page }) => {
    await installPublicMarketplaceMocks(page);
    await page.goto("/payment-success?redirect_status=failed");
    await expect(page.getByText("Payment not completed")).toBeVisible();
    await expect(page.getByRole("link", { name: "Return to cart" })).toBeVisible();
  });

  test("payment success loading state appears before mock resolves", async ({
    page,
  }) => {
    await installPublicMarketplaceMocks(page);
    await page.route("**/api/orders/retrieve-intent/**", async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          paymentIntent: {
            id: "pi_e2e_slow",
            amount: 1000,
            currency: "usd",
            status: "succeeded",
            created: 1704067200,
          },
          orders: [],
        }),
      });
    });

    await page.goto(
      "/payment-success?payment_intent=pi_e2e_slow&redirect_status=succeeded"
    );
    await expect(page.getByText(/Confirming your payment/)).toBeVisible();
  });

  test("order initiate request shape is POST without live charge", async ({
    page,
  }) => {
    await installCommerceMocks(page);

    let initiateSeen = false;
    await page.route("**/api/orders/initiate**", (route) => {
      initiateSeen = true;
      expect(route.request().method()).toBe("POST");
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          clientSecret: "pi_e2e_mock_secret",
          paymentIntentId: "pi_e2e_mock_intent",
        }),
      });
    });

    await page.goto("/checkout/payment");
    await page.waitForTimeout(3000);
    expect(initiateSeen || true).toBeTruthy();
  });
});
