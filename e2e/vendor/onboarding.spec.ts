import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { setupMocks, type OnboardingState } from "../helpers/mockApi";
import { seedClientSession } from "../helpers/authSession";

async function openPartnersHub(page: Page, onboarding: OnboardingState) {
  await setupMocks(page, { auth: "business_owner", onboarding });
  await seedClientSession(page, "business_owner");
  await page.goto("/partners");
  await expect(page).toHaveURL(/\/partners/, { timeout: 15_000 });
}

test.describe("@mocked vendor onboarding", () => {
  test("no-business vendor sees hub without login redirect", async ({ page }) => {
    await openPartnersHub(page, "none");
    await expect(page.getByText("Start Vendor Onboarding")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("draft state shows continue draft action", async ({ page }) => {
    await openPartnersHub(page, "draft");
    await expect(page.getByRole("button", { name: "Continue Draft" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("payment-pending state shows pending payment label", async ({ page }) => {
    await openPartnersHub(page, "payment-pending");
    await expect(page.getByText("pending", { exact: false }).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: "Continue application" })).toBeVisible();
  });

  test("submitted state shows awaiting review copy", async ({ page }) => {
    await openPartnersHub(page, "submitted");
    await expect(page.getByText("Awaiting admin review")).toBeVisible({ timeout: 15_000 });
  });

  test("verified state shows verification complete message", async ({ page }) => {
    await openPartnersHub(page, "verified");
    await page.getByRole("button", { name: "Business Verification" }).click();
    await expect(page.getByText("Verification complete")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Verified", { exact: true })).toBeVisible();
  });

  test("rejected state shows rejection messaging", async ({ page }) => {
    await openPartnersHub(page, "rejected");
    await expect(
      page.getByText("Your application is rejected due to not meeting verification criteria")
    ).toBeVisible({ timeout: 15_000 });
  });

  test("admin vendor applications list renders", async ({ page }) => {
    await setupMocks(page, { auth: "admin" });
    await seedClientSession(page, "admin");
    await page.goto("/admin/vendor-applications");
    await expect(page.getByRole("heading", { name: "Vendor Applications" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("E2E Vendor Shop")).toBeVisible();
  });

  test("admin vendor application detail renders", async ({ page }) => {
    await setupMocks(page, { auth: "admin" });
    await seedClientSession(page, "admin");
    await page.goto("/admin/vendor-applications/e2e-app-001");
    await expect(page.getByText("E2E Vendor Shop")).toBeVisible({ timeout: 15_000 });
  });
});
