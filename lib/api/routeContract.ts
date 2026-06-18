/**
 * Canonical backend path segments for routes that do NOT use the `/api/` prefix.
 *
 * Source of truth: Techware-Hut/mosaic-backend `docs/API_SURFACE.md`
 * Frontend mirror: `docs/BACKEND_FRONTEND_ROUTE_CONTRACT.md`
 *
 * Do not normalize these to `/api/admin/...` or `/api/stripe/...` without a backend migration.
 * Live probes on https://api.mosaicbizhub.com (2026-06-18): `/api/admin/users` and
 * `/api/stripe/account-session` return 404; paths below return auth/validation responses.
 */

/** `GET /admin/users` — admin user list (legacy mount, not under `/api/admin`) */
export const LEGACY_ADMIN_USERS = "/admin/users";

/** `GET/PATCH /admin/api/products` — admin product list + featured toggle */
export const LEGACY_ADMIN_PRODUCTS = "/admin/api/products";

/** Stripe Connect embedded dashboard routes (legacy root mount, not under `/api/stripe`) */
export const STRIPE_CONNECT_DASHBOARD = {
  accountSession: "/stripe/account-session",
  expressLoginLink: "/stripe/express-login-link",
  accountBalance: "/stripe/account-balance",
  lastPayout: "/stripe/last-payout",
} as const;
