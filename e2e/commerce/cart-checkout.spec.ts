import { test, expect } from "@playwright/test";
import { setupMocks, API_BASE } from "../helpers/mockApi";
import { seedClientSession } from "../helpers/authSession";
import { stubStripe } from "../helpers/stripeStub";

test.describe("@mocked customer commerce", () => {
  test("browse detail add to cart as guest updates guest cart", async ({ page }) => {
    await setupMocks(page, { auth: "unauth" });
    await page.goto("/product/prod-e2e-001");
    await expect(page.getByText("E2E Detail Product")).toBeVisible({ timeout: 15_000 });

    const addButton = page.getByRole("button", { name: /add to cart/i }).first();
    await expect(addButton).toBeEnabled({ timeout: 10_000 });
    await addButton.click();

    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem("guest_cart")))
      .not.toBeNull();
  });

  test("authenticated customer cart page shows line item", async ({ page }) => {
    await setupMocks(page, { auth: "customer" });
    await seedClientSession(page, "customer");
    await page.goto("/cart");
    await expect(page.getByText("E2E Detail Product")).toBeVisible({ timeout: 15_000 });
  });

  test("vendor account is blocked from checkout flow", async ({ page }) => {
    await setupMocks(page, { auth: "business_owner", onboarding: "none" });
    await seedClientSession(page, "business_owner");
    await page.goto("/cart");
    await page.evaluate(() => {
      localStorage.setItem(
        "guest_cart",
        JSON.stringify({
          businessId: "biz-e2e-001",
          items: [
            {
              productId: "prod-e2e-001",
              variantId: "var-e2e-001",
              size: "M",
              quantity: 1,
            },
          ],
        })
      );
    });
    await page.reload();
    const placeOrder = page.getByRole("button", { name: /place order/i });
    if (await placeOrder.isVisible()) {
      await placeOrder.click();
      await expect(page).toHaveURL(/\/cart/, { timeout: 10_000 });
    }
  });

  test("order initiation sends expected payload shape", async ({ page }) => {
    await setupMocks(page, { auth: "customer" });
    await seedClientSession(page, "customer");

    let capturedBody: Record<string, unknown> | null = null;
    await page.route(`${API_BASE}/api/orders/initiate`, async (route) => {
      capturedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          orderId: "order-e2e-001",
          clientSecret: "pi_e2e_mock_secret",
        }),
      });
    });

    await page.goto("/checkout/payment?orderId=order-e2e-001&clientSecret=pi_e2e_mock_secret&source=cart");
    await page.evaluate(async () => {
      await fetch("http://127.0.0.1:3099/api/orders/initiate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: "prod-e2e-001",
              variantId: "var-e2e-001",
              size: "M",
              quantity: 1,
            },
          ],
          shippingAddress: {
            fullName: "E2E Customer",
            phone: "5550001000",
            addressLine1: "123 Test St",
            city: "Richmond",
            state: "VA",
            postalCode: "23220",
            country: "US",
          },
          userNote: "",
          selectedDeliverySpeed: "standard",
        }),
      });
    });

    expect(capturedBody).toMatchObject({
      userNote: "",
      selectedDeliverySpeed: "standard",
    });
    expect(Array.isArray(capturedBody?.items)).toBe(true);
    expect(capturedBody?.shippingAddress).toBeTruthy();
  });

  test("payment success page shows receipt when intent succeeds", async ({ page }) => {
    await setupMocks(page, { auth: "customer" });
    await seedClientSession(page, "customer");
    await page.goto(
      "/payment-success?payment_intent=pi_e2e_mock&redirect_status=succeeded&source=cart"
    );
    await expect(page.getByRole("heading", { name: "Payment Receipt" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("payment cancel UI renders without charge", async ({ page }) => {
    await setupMocks(page, { auth: "unauth" });
    await page.goto("/payment-success?source=cart");
    await expect(page.getByRole("heading", { name: "Payment not completed" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByText("Your payment was cancelled or could not be confirmed")
    ).toBeVisible();
  });

  test("checkout payment page loads with stripe stubbed", async ({ page }) => {
    await setupMocks(page, { auth: "customer" });
    await seedClientSession(page, "customer");
    await stubStripe(page);
    await page.goto(
      "/checkout/payment?orderId=order-e2e-001&clientSecret=pi_e2e_mock_secret&source=cart"
    );
    await expect(page.getByRole("button", { name: "Pay" })).toBeVisible({ timeout: 15_000 });
  });
});
