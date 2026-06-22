import type { Page } from "@playwright/test";

export type AuthRole = "customer" | "business_owner" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  mobile: string;
  gender?: string;
}

const USERS: Record<AuthRole, SessionUser> = {
  customer: {
    id: "e2e-customer-id",
    name: "E2E Customer",
    email: "e2e-customer@example.test",
    role: "customer",
    mobile: "5550001000",
  },
  business_owner: {
    id: "e2e-vendor-id",
    name: "E2E Vendor",
    email: "e2e-vendor@example.test",
    role: "business_owner",
    mobile: "5550002000",
  },
  admin: {
    id: "e2e-admin-id",
    name: "E2E Admin",
    email: "e2e-admin@example.test",
    role: "admin",
    mobile: "5550003000",
  },
};

export function getSessionUser(role: AuthRole): SessionUser {
  return USERS[role];
}

/** Seed localStorage hints used by navbar and client guards. */
export async function seedClientSession(page: Page, role: AuthRole): Promise<void> {
  const user = getSessionUser(role);
  await page.addInitScript(
    ({ roleValue, gender }) => {
      localStorage.setItem("user_session", "true");
      localStorage.setItem("user_role", roleValue);
      localStorage.setItem("user_gender", gender);
    },
    { roleValue: user.role, gender: user.gender ?? "" }
  );
}

export async function clearClientSession(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_gender");
  });
}
