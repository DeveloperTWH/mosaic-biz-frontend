# Frontend Launch Contract Alignment

> **Archive note (2026-06-23):** Launch evidence from June 2026 contract audit. Canonical rules live in [../API_CONTRACTS.md](../API_CONTRACTS.md). See [../archive/README.md](../archive/README.md).

**Type:** Launch evidence (contract alignment)  
**Last updated:** 2026-06-19  
**Branch:** `fix/frontend-launch-contract-env-and-legacy-route-audit`  
**Base `main` SHA:** `9543778130c0c39c42362d637f9e2ee3380d1345`  
**Remote:** `launch` → `Digital-Builders-757/mosaic-biz-frontend-launch`

**Sources:**

- [FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md](FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md) — as-built pack index
- [FRONTEND_API_USAGE_INVENTORY.md](FRONTEND_API_USAGE_INVENTORY.md) — API call inventory
- [FRONTEND_ROUTE_MAP.md](FRONTEND_ROUTE_MAP.md) — page routes
- [FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md) — session model
- [FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md](FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md) — admin/vendor/customer surfaces
- [FRONTEND_VISUAL_QA_SURFACE.md](FRONTEND_VISUAL_QA_SURFACE.md) — visual QA URLs
- [../BACKEND_FRONTEND_ROUTE_CONTRACT.md](../BACKEND_FRONTEND_ROUTE_CONTRACT.md) — frontend mirror of backend API surface
- Backend source of truth: [Techware-Hut/mosaic-backend `docs/API_SURFACE.md`](https://github.com/Techware-Hut/mosaic-backend/blob/main/docs/API_SURFACE.md)

**Rule:** Env var **names only** in this document — no values.

---

## Executive summary

The frontend as-built documentation pack (merged to `main` via PR #147) and prior route reconciliation (`lib/api/routeContract.ts`) confirm:

1. **Canonical featured products:** `GET /api/featured-products` only — `/api/products/featured` is not used in app code.
2. **Legacy admin and Stripe dashboard mounts remain active** and must not be “normalized” to `/api/admin/users` or `/api/stripe/*` without a backend migration (live probes: modern paths return **404**).
3. **Checkout** uses `POST /api/orders/initiate` + Stripe Elements; `return_url` depends on `NEXT_PUBLIC_CLIENT_BASE_URL` (not `NEXT_PUBLIC_APP_URL`).
4. **No code route migrations** are required in this PR — constants are already centralized; primary deliverable is contract documentation + grep re-verification.

---

## Grep verification (app `*.{ts,tsx}` only)

Run on branch `fix/frontend-launch-contract-env-and-legacy-route-audit` @ `95437781`:

| Pattern | Matches | Result |
|---------|---------|--------|
| `/api/products/featured` | **0** | Not used — canonical path preserved |
| `/api/featured-products` | **3 files** | `lib/api/featured-products.ts`, `ShopProducts.tsx`, `FeaturedProducts.tsx` |
| `/api/admin/users` | **1** (comment only) | `lib/api/routeContract.ts` — not called from app |
| `/api/stripe/account-session` | **1** (comment only) | `lib/api/routeContract.ts` — not called from app |
| `/api/orders/initiate` | **3** (2 files) | `utils/cartUtils.ts`, `checkout/address/ClientForm.tsx` |
| `/api/payments/create-payment-intent` | **0** | Not used |
| `LEGACY_ADMIN_USERS` / `LEGACY_ADMIN_PRODUCTS` / `STRIPE_CONNECT_DASHBOARD` | **4 files** | `routeContract.ts`, `admin/users/page.tsx`, `products-admin.ts`, `finance/page.tsx` |
| `NEXT_PUBLIC_API_BASE_URL` | **~107 files**, **~130 occurrences** | Sole public API root |
| `NEXT_PUBLIC_APP_URL` | **1 file** | `app/(home)/layout.tsx` (metadata) |
| `NEXT_PUBLIC_CLIENT_BASE_URL` | **2 files**, **3 occurrences** | Checkout `return_url` only |

---

## Confirmed aligned API calls

Grouped by domain. Full inventory: [FRONTEND_API_USAGE_INVENTORY.md](FRONTEND_API_USAGE_INVENTORY.md).

### Featured products (canonical)

| Method | Endpoint | Consumer | Credentials |
|--------|----------|----------|-------------|
| GET | `/api/featured-products?page=&limit=` | `lib/api/featured-products.ts` → homepage components | `withCredentials` |

### Marketplace browse / search

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/products/list` | Primary `/products` gate |
| GET | `/api/product/:id`, `/api/public/product/:id` | Product detail |
| GET | `/api/services/list`, `/api/services/:slug` | Services catalog + detail |
| GET | `/api/food/list` | Food catalog (**not** `/api/foods/list`) |
| GET | `/api/public/search` | Global search |
| GET | `/api/business` | Vendor directory |
| GET | `/api/ranked` or `NEXT_PUBLIC_RANKED_PATH` | Homepage ranked mix |

### Cart and checkout

| Method | Endpoint | Consumer | Credentials |
|--------|----------|----------|-------------|
| GET | `/api/cart`, `/api/cart/count` | `utils/cartUtils.ts`, `utils/cartApi.ts` | `include` |
| POST | `/api/cart/add`, `/api/cart/merge` | Cart utilities | `include` |
| PUT | `/api/cart/update/:id` | `utils/cartUtils.ts` | `include` |
| DELETE | `/api/cart/remove/:id` | `utils/cartUtils.ts` | `include` |
| POST | `/api/orders/initiate` | `utils/cartUtils.ts`, `checkout/address/ClientForm.tsx` | `include` |
| GET | `/api/orders/retrieve-intent/:paymentIntentId` | `payment-success/page.tsx` | `include` |
| GET | `/api/public/product/:productId` | `checkout/buy-now/page.tsx` | none |

Stripe Elements client payment confirmation uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`; no `POST /api/payments/create-payment-intent` in frontend.

### Auth and users

| Method | Endpoint | Consumer |
|--------|----------|----------|
| POST | `/api/users/login` | `login/page.tsx`, `admin/signin/page.tsx` |
| GET | `/api/users/auth/check` | `authUtils.ts`, `admin/layout.tsx` |
| POST | `/api/users/register`, `/api/users/verify-otp`, `/api/users/logout` | Auth pages, `logoutUser.ts` |
| GET | `/api/auth/google?role=` | Google OAuth redirect |

### Stripe Connect onboarding (modern `/api/connect`)

| Method | Endpoint | Consumer |
|--------|----------|----------|
| GET | `/api/connect/:businessId/status` | `lib/api/stripeConnect.ts`, `payout-setup/page.tsx` |
| POST | `/api/connect/:businessId/account-link` | `lib/api/stripeConnect.ts`, `connect/refresh/page.tsx` |

Frontend return URLs: `/partners/connect/return`, `/partners/connect/refresh` (backend `CONNECT_RETURN_URL` / `CONNECT_REFRESH_URL` must match).

### Modern admin (`/api/admin/*`)

| Method | Endpoint | Consumer |
|--------|----------|----------|
| GET | `/api/admin/business` | `admin/page.tsx`, `admin/businesses/page.tsx` |
| PATCH | `/api/admin/business/status/:id` | `admin/page.tsx` |
| GET/DELETE | `/api/admin/categories`, `/api/admin/category/*` | `admin/categories-management/page.tsx` |
| GET | `/api/admin/category-requests` | `admin/category-requests/page.tsx` |
| GET | `/api/cms/admin`, `/api/cms/admin/:type` | `admin/cms/page.tsx` |
| GET | `/api/orders/admin` | `admin/orders/page.tsx` |
| GET/PATCH | `/api/vendor-onboarding/:id/*` | `admin/vendor-applications/[id]/page.tsx` |

### Vendor onboarding

| Method | Endpoint | Consumer |
|--------|----------|----------|
| GET | `/api/vendor-onboarding/applicationId`, `status/:id` | `partners/page.tsx` |
| POST | `/api/vendor-onboarding/stage1/create-payment` | Stage-1 payment |
| GET/PUT | `/api/vendor-onboarding/onboarding-data`, `business-profile` | Business profile flow |
| POST | `/api/subscriptions/create` | Tier checkout |

---

## Legacy paths still active

**Do not normalize** these to `/api/admin/...` or `/api/stripe/...` without backend migration. Constants: [`lib/api/routeContract.ts`](../../lib/api/routeContract.ts).

| Method | Legacy path | Constant | Consumer | Live probe (2026-06-18) |
|--------|-------------|----------|----------|-------------------------|
| GET | `/admin/users` | `LEGACY_ADMIN_USERS` | `app/(admin)/admin/users/page.tsx` | **401** (exists); `/api/admin/users` → **404** |
| GET | `/admin/api/products` | `LEGACY_ADMIN_PRODUCTS` | `lib/api/products-admin.ts` | **401** (exists) |
| PATCH | `/admin/api/products/:id/featured` | `LEGACY_ADMIN_PRODUCTS` | `lib/api/products-admin.ts` | Admin featured toggle (separate from public featured) |
| POST | `/stripe/account-session` | `STRIPE_CONNECT_DASHBOARD.accountSession` | `finance/page.tsx` | **400** POST (exists); `/api/stripe/account-session` → **404** |
| POST | `/stripe/express-login-link` | `STRIPE_CONNECT_DASHBOARD.expressLoginLink` | `finance/page.tsx` | **400** POST (exists) |
| GET | `/stripe/account-balance?account=` | `STRIPE_CONNECT_DASHBOARD.accountBalance` | `finance/page.tsx` | **500** with invalid account (route exists) |
| GET | `/stripe/last-payout?account=` | `STRIPE_CONNECT_DASHBOARD.lastPayout` | `finance/page.tsx` | **500** with invalid account (route exists) |
| POST | `/upload/presigned-url` | — (inline) | `utils/s3Uploader.ts` | Legacy upload fallback |
| POST | `/api/s3-presigned-url` | — (inline) | `utils/s3Uploader.ts` | Primary presign path |

**Backend-owned (not called from frontend):** `/api/stripe/webhook`, `/api/stripe/payment/webhook`.

---

## Admin route usage

Page URLs from [FRONTEND_ROUTE_MAP.md](FRONTEND_ROUTE_MAP.md) and [FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md](FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md).

| Page URL | API style | Key endpoints |
|----------|-----------|---------------|
| `/signin` | Modern | `POST /api/users/login` (role: admin) |
| `/admin` | Modern | `GET /api/admin/business`, `PATCH /api/admin/business/status/:id` |
| `/admin/businesses` | Modern | `GET /api/admin/business` |
| `/admin/products` | **Legacy** | `GET/PATCH /admin/api/products` via `LEGACY_ADMIN_PRODUCTS` |
| `/admin/users` | **Legacy** | `GET /admin/users` via `LEGACY_ADMIN_USERS` |
| `/admin/orders` | Modern | `GET /api/orders/admin` |
| `/admin/vendor-applications` | Modern | Vendor onboarding admin APIs |
| `/admin/vendor-applications/[id]` | Modern | `GET/PATCH /api/vendor-onboarding/:id/*` |
| `/admin/categories-management` | Modern | `/api/admin/categories`, `/api/admin/category/*` |
| `/admin/category-requests` | Modern | `/api/admin/category-requests` |
| `/admin/subscription` | Modern | `/api/subscription-plans` |
| `/admin/cms` | Modern | `/api/cms/admin` |
| `/admin/testimonials` | Modern | `lib/api/testimonials.ts` |

**Guard:** `app/(admin)/admin/layout.tsx` — `GET /api/users/auth/check`, role must be `admin`.

**Dual prefix note:** Backend uses both `/api/admin/*` (most CRUD) and legacy `/admin/*` (users list, product featured toggle). This is intentional on production API today — not a frontend bug.

---

## Stripe / partner finance route usage

### Connect onboarding (payout setup)

| UI route | API | File |
|----------|-----|------|
| `/partners/payout-setup` | `GET /api/connect/:businessId/status`, `POST .../account-link` | `payout-setup/page.tsx` |
| `/partners/connect/return` | Client redirect → `/partners/payout-setup?refresh=1` | Connect return handler |
| `/partners/connect/refresh` | `POST /api/connect/:businessId/account-link` | `connect/refresh/page.tsx` |

Module: `lib/api/stripeConnect.ts` — `credentials: "include"`, optional Bearer from localStorage.

### Embedded dashboard (partner finance)

| UI route | API | File |
|----------|-----|------|
| `/partners/[businessid]/finance` | `POST /stripe/account-session`, `POST /stripe/express-login-link`, `GET /stripe/account-balance`, `GET /stripe/last-payout` | `finance/page.tsx` |

Uses `STRIPE_CONNECT_DASHBOARD` constants + `@stripe/connect-js` embedded components.

**Backend decision:** API_SURFACE marks `/stripe/*` dashboard routes as P0-8 auth hardening gap — not changed in frontend.

---

## Checkout route / env usage

### Frontend routes

| URL | Purpose |
|-----|---------|
| `/cart` | Cart review |
| `/checkout/address` | Shipping address + order initiate |
| `/checkout` | Stripe Elements checkout (legacy path) |
| `/checkout/payment` | Payment step with `return_url` |
| `/checkout/buy-now` | Direct purchase |
| `/payment-success` | Post-payment confirmation (`GET /api/orders/retrieve-intent/:id`) |

### API contract

| Step | Endpoint | Env vars (names only) |
|------|----------|----------------------|
| Initiate order | `POST /api/orders/initiate` | `NEXT_PUBLIC_API_BASE_URL` |
| Stripe confirm | Stripe Elements `confirmPayment` | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLIENT_BASE_URL` (for `return_url` → `/payment-success`) |
| Retrieve intent | `GET /api/orders/retrieve-intent/:paymentIntentId` | `NEXT_PUBLIC_API_BASE_URL` |

**Important:** `NEXT_PUBLIC_APP_URL` is used for `metadataBase` in `app/(home)/layout.tsx` only — **not** for Stripe `return_url`. Checkout uses `NEXT_PUBLIC_CLIENT_BASE_URL` exclusively.

---

## Environment variables (names only)

| Name | Purpose | Referenced in | Vercel confirmation |
|------|---------|---------------|---------------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API root | ~107 files | **Required** — must point to production API host |
| `NEXT_PUBLIC_APP_URL` | Frontend origin for metadata / OG | `app/(home)/layout.tsx` | **Confirm** — should match deployed frontend origin |
| `NEXT_PUBLIC_CLIENT_BASE_URL` | Stripe `return_url` base | `checkout/page.tsx`, `checkout/payment/page.tsx` | **Confirm** — must match frontend origin for payment redirect |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements / Connect | checkout, `utils/stripe.ts`, tier checkout | **Required** for payment flows |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Maps / Places | cart address, inventory forms | Optional for non-map flows |
| `NEXT_PUBLIC_RANKED_PATH` | Override ranked API path | `ShopProducts.tsx`, `ProductsClient.tsx` | Optional |
| `JWT_SECRET` | Middleware JWT verification | `middleware.ts` | **Required** on Vercel |
| `NEXT_PUBLIC_SENTRY_DSN` | Client Sentry | `lib/sentry/config.ts` | Optional |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Build-time Sentry | `next.config.ts` | Optional |

**Evidence Needed:** Whether `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_CLIENT_BASE_URL` are set to the same frontend origin on Vercel preview and production. README documents `NEXT_PUBLIC_APP_URL` for local dev; `NEXT_PUBLIC_CLIENT_BASE_URL` is needed for checkout redirects.

---

## Fix-owner matrix

| Item | Owner | Action |
|------|-------|--------|
| Keep legacy `GET /admin/users` | **Decision** | Do not migrate to `/api/admin/users` until backend confirms replacement and frontend probes pass |
| Keep legacy `/admin/api/products` | **Decision** | Same — `/api/admin/products` returns 404 on live probe |
| Keep legacy `/stripe/*` dashboard routes | **Decision** | Do not migrate to `/api/stripe/*` until backend migration |
| `/stripe/*` auth hardening (P0-8) | **Backend** | API_SURFACE security gap — not frontend route fix |
| Dual admin prefix styles long-term | **Backend** | Optional consolidation timeline |
| Admin featured toggle vs public featured | **Aligned** | Different endpoints by design — no change |
| `/api/products/featured` | **Aligned** | Not used — keep `GET /api/featured-products` |
| `NEXT_PUBLIC_APP_URL` vs `NEXT_PUBLIC_CLIENT_BASE_URL` parity | **Vercel env** | Confirm both set to same frontend origin on preview + prod |
| `NEXT_PUBLIC_API_BASE_URL` on Vercel | **Vercel env** | Confirm points to `api.mosaicbizhub.com` (names only in dashboard) |
| Cross-origin cookies / middleware on preview | **Evidence Needed** | Preview vs local CORS/cookie behavior |
| Partner onboarding stage edge routing | **Evidence Needed** | Dual partner surfaces documented |
| Lint debt (~662 issues) | **Frontend** (separate PR) | Do not block launch on lint cleanup |
| UI loading/error states per page | **Evidence Needed** | Requires per-page QA |

---

## Frontend / backend mismatches remaining

| Topic | Status |
|-------|--------|
| `/api/admin/users` vs `/admin/users` | Frontend uses **legacy**; modern path **404** on live probe |
| `/api/stripe/account-session` vs `/stripe/account-session` | Frontend uses **legacy**; modern path **404** |
| `/api/admin/products` vs `/admin/api/products` | Frontend uses **legacy**; modern path **404** |
| Public featured vs admin featured toggle | **Not a mismatch** — `GET /api/featured-products` vs `PATCH /admin/api/products/:id/featured` |
| Food list path | **Aligned** — `GET /api/food/list` (not `/api/foods/list`) |
| Upload presign dual paths | **Legacy + primary** — `/upload/presigned-url` and `/api/s3-presigned-url` both in `s3Uploader.ts` |

---

## Vercel preview smoke steps

Target: Vercel **release-candidate preview** (not localhost alone — CORS may block production API from local origin).

Reference: [../FRONTEND_SMOKE_CHECKLIST.md](../FRONTEND_SMOKE_CHECKLIST.md), [FRONTEND_VISUAL_QA_SURFACE.md](FRONTEND_VISUAL_QA_SURFACE.md).

### P0 — API contract gates

1. Hard refresh `/products` — Network: `GET /api/products/list` → **200**
2. Homepage — Network: `GET /api/featured-products` → **200** (empty array OK)
3. Confirm **no** requests to `/api/products/featured` in Network tab

### P0 — Legacy path probes (authenticated)

4. Admin sign-in → `/admin/users` — Network: `GET /admin/users` → **401/200** (not **404**)
5. Admin → `/admin/products` — list loads; toggle → `PATCH /admin/api/products/:id/featured` (not **404**)
6. Partner finance → `/partners/[businessid]/finance` — `POST /stripe/account-session` → **400/401** acceptable (not **404**)

### P0 — Checkout path (no live payment)

7. `/cart` loads (empty and with items)
8. `/checkout/address` reachable from cart
9. `/checkout/payment` shows loading / Stripe Elements shell
10. `/payment-success?payment_intent=...&redirect_status=succeeded` shows receipt or clear error

### P1 — Env name checks (Vercel dashboard, names only)

11. `NEXT_PUBLIC_API_BASE_URL` present
12. `NEXT_PUBLIC_APP_URL` present
13. `NEXT_PUBLIC_CLIENT_BASE_URL` present and matches frontend preview origin
14. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` present
15. `JWT_SECRET` present

### P1 — Surfaces

16. `/login?type=customer`, `/login?type=vendor` render
17. `/partners` hub loads for vendor account
18. `/partners/dashboard` loads for approved vendor
19. `/admin` dashboard loads after admin sign-in

**404 on legacy paths = fail.** **401/400 on legacy paths = route exists** (auth/validation).

---

## Commands run

```powershell
git fetch launch main
git checkout main
git pull launch main
git checkout -b fix/frontend-launch-contract-env-and-legacy-route-audit

# Grep verification
rg "/api/products/featured" --glob "*.{ts,tsx}"
rg "/api/featured-products" --glob "*.{ts,tsx}"
rg "/api/admin/users" --glob "*.{ts,tsx}"
rg "/api/stripe/account-session" --glob "*.{ts,tsx}"
rg "/api/orders/initiate" --glob "*.{ts,tsx}"
rg "/api/payments/create-payment-intent" --glob "*.{ts,tsx}"
rg "LEGACY_ADMIN|STRIPE_CONNECT_DASHBOARD" --glob "*.{ts,tsx}"
rg "NEXT_PUBLIC_CLIENT_BASE_URL|NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_API_BASE_URL" --glob "*.{ts,tsx}"

npm run build
npm run lint
```

### Build / lint results

| Command | Result | Notes |
|---------|--------|-------|
| `npm run build` | **PASS** | Next.js 16.1.2; compiled ~19.5s; 69 routes; TypeScript OK |
| `npm run lint` | **FAIL** | 662 problems (345 errors, 317 warnings) — pre-existing debt; not fixed in this PR |
| `npm test` | N/A | No test script in `package.json` |

Build warnings (non-blocking): multiple lockfiles / turbopack root inference; middleware file convention deprecated (Next.js proxy migration message).

---

## What was NOT tested

- Production or preview deployment
- Browser E2E / visual QA on Vercel preview
- Live API probing against `api.mosaicbizhub.com` in this session
- Stripe live payments
- Auth flows with real credentials on preview
- Admin SSO on Vercel preview
- Backend schema validation

---

## Recommended next PR

1. **Human QA on Vercel RC preview** — execute smoke steps above; capture Network tab evidence for legacy paths.
2. **Vercel env parity audit** — confirm `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_CLIENT_BASE_URL` match deployed origin (names only in ticket).
3. **Backend cross-repo confirmation** — `Techware-Hut/mosaic-backend` confirms legacy mounts (`/admin/users`, `/stripe/*`) remain supported at launch; timeline for optional migration.
4. **Lint debt triage** — separate PR; do not mix with contract work.

---

## Stop conditions respected

No production deploy, auth architecture changes, Next.js API routes, checkout/payment behavior changes, route deletions, admin/Stripe route migrations, or large lint cleanup in this PR.
