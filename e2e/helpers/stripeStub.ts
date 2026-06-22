import type { Page } from "@playwright/test";

/** Block Stripe CDN and provide a no-op Stripe.js stub — no live charges. */
export async function stubStripe(page: Page): Promise<void> {
  await page.route("**/js.stripe.com/**", (route) => route.abort());

  await page.addInitScript(() => {
    const mockStripe = () => ({
      elements: () => ({
        create: () => ({
          mount: () => undefined,
          destroy: () => undefined,
          on: () => undefined,
        }),
      }),
      retrievePaymentIntent: async () => ({
        paymentIntent: { amount: 4999, status: "requires_payment_method" },
      }),
      confirmPayment: async () => ({
        error: { message: "Mock payment declined for E2E safety" },
      }),
    });

    Object.defineProperty(window, "Stripe", {
      configurable: true,
      writable: true,
      value: mockStripe,
    });
  });
}
