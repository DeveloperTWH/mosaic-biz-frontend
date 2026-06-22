/**
 * Shared E2E environment helpers. Variable names only — never commit values.
 */
export function getApiBaseUrl(): string {
  return (
    process.env.E2E_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.mosaicbizhub.com"
  ).replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalized}`;
}

export function hasCredentialPair(emailVar: string, passwordVar: string): boolean {
  return Boolean(process.env[emailVar]?.trim() && process.env[passwordVar]?.trim());
}

export const E2E_CREDENTIAL_VARS = {
  customer: {
    email: "E2E_CUSTOMER_EMAIL",
    password: "E2E_CUSTOMER_PASSWORD",
  },
  vendor: {
    email: "E2E_VENDOR_EMAIL",
    password: "E2E_VENDOR_PASSWORD",
  },
  admin: {
    email: "E2E_ADMIN_EMAIL",
    password: "E2E_ADMIN_PASSWORD",
  },
} as const;

export function hasCustomerCredentials(): boolean {
  const { email, password } = E2E_CREDENTIAL_VARS.customer;
  return hasCredentialPair(email, password);
}

export function hasVendorCredentials(): boolean {
  const { email, password } = E2E_CREDENTIAL_VARS.vendor;
  return hasCredentialPair(email, password);
}

export function hasAdminCredentials(): boolean {
  const { email, password } = E2E_CREDENTIAL_VARS.admin;
  return hasCredentialPair(email, password);
}
