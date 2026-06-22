import { test as base, expect } from "@playwright/test";
import {
  apiUrl,
  E2E_CREDENTIAL_VARS,
  hasAdminCredentials,
  hasCustomerCredentials,
  hasVendorCredentials,
} from "./env";

export const test = base;

export { expect };

export function skipUnlessCustomerCredentials() {
  test.skip(
    !hasCustomerCredentials(),
    `Set ${E2E_CREDENTIAL_VARS.customer.email} and ${E2E_CREDENTIAL_VARS.customer.password} for live auth tests`
  );
}

export function skipUnlessVendorCredentials() {
  test.skip(
    !hasVendorCredentials(),
    `Set ${E2E_CREDENTIAL_VARS.vendor.email} and ${E2E_CREDENTIAL_VARS.vendor.password} for live auth tests`
  );
}

export function skipUnlessAdminCredentials() {
  test.skip(
    !hasAdminCredentials(),
    `Set ${E2E_CREDENTIAL_VARS.admin.email} and ${E2E_CREDENTIAL_VARS.admin.password} for live auth tests`
  );
}

export async function loginViaUi(
  page: import("@playwright/test").Page,
  type: "customer" | "vendor",
  email: string,
  password: string
) {
  await page.goto(`/login?type=${type}`);
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
}

export async function loginAdminViaUi(
  page: import("@playwright/test").Page,
  email: string,
  password: string
) {
  await page.goto("/signin");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
}

export { apiUrl };
