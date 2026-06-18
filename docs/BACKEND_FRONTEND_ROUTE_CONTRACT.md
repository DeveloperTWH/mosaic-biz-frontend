# Backend ↔ Frontend Route Contract

**Type:** Reference (frontend mirror)  
**Last updated:** 2026-06-18  
**Backend source of truth:** [Techware-Hut/mosaic-backend `docs/API_SURFACE.md`](https://github.com/Techware-Hut/mosaic-backend/blob/main/docs/API_SURFACE.md)  
**Reconciliation audit:** [FRONTEND_ROUTE_RECONCILIATION.md](FRONTEND_ROUTE_RECONCILIATION.md)

Base URL: `NEXT_PUBLIC_API_BASE_URL` (production: `https://api.mosaicbizhub.com`).

---

## Prefix conventions

The backend uses **two admin routing styles**. Both are valid on production API today.

| Style | Example | Used for |
|-------|---------|----------|
| **`/api/admin/...`** | `/api/admin/business`, `/api/admin/categories` | Most admin CRUD (businesses, categories, testimonials, category-requests) |
| **Legacy (no leading `/api`)** | `/admin/users`, `/admin/api/products` | Admin users list, admin featured-product toggle |
| **`/api/...` marketplace** | `/api/products/list`, `/api/featured-products` | Public marketplace |
| **Legacy Stripe dashboard** | `/stripe/account-session`, `/stripe/express-login-link` | Partner finance embedded Connect UI |
| **`/api/connect/...`** | `/api/connect/:businessId/account-link` | Stripe Connect onboarding (payout setup) |

**Do not** “fix” legacy paths to `/api/admin/users` or `/api/stripe/...` without a backend migration — those variants return **404** on production.

---

## Legacy admin routes (verified 2026-06-18)

| Method | Backend path | Frontend consumer | Auth |
|--------|--------------|-------------------|------|
| GET | `/admin/users` | [`app/(admin)/admin/users/page.tsx`](../app/(admin)/admin/users/page.tsx) via `LEGACY_ADMIN_USERS` | `withCredentials: true` |
| GET | `/admin/api/products` | [`lib/api/products-admin.ts`](../lib/api/products-admin.ts) | `withCredentials: true` |
| PATCH | `/admin/api/products/:productId/featured` | [`lib/api/products-admin.ts`](../lib/api/products-admin.ts) | `withCredentials: true` |

Production probe: `/admin/users` → **401** (exists); `/api/admin/users` → **404**.

---

## Stripe Connect routes

### Onboarding (payout setup)

| Method | Path | Frontend |
|--------|------|----------|
| GET | `/api/connect/:businessId/status` | [`lib/api/stripeConnect.ts`](../lib/api/stripeConnect.ts) |
| POST | `/api/connect/:businessId/account-link` | [`lib/api/stripeConnect.ts`](../lib/api/stripeConnect.ts), [`payout-setup/page.tsx`](../app/(home)/partners/payout-setup/page.tsx) |

Frontend return/refresh URLs (backend `CONNECT_RETURN_URL` / `CONNECT_REFRESH_URL`):

- `/partners/connect/return`
- `/partners/connect/refresh`

See [STRIPE_CONNECT_FRONTEND_FLOW.md](STRIPE_CONNECT_FRONTEND_FLOW.md).

### Embedded dashboard (partner finance)

| Method | Path | Frontend |
|--------|------|----------|
| POST | `/stripe/account-session` | [`finance/page.tsx`](../app/(partner)/partners/[businessid]/finance/page.tsx) |
| POST | `/stripe/express-login-link` | same |
| GET | `/stripe/account-balance?account=` | same |
| GET | `/stripe/last-payout?account=` | same |

All use `credentials: 'include'`. Constants: [`lib/api/routeContract.ts`](../lib/api/routeContract.ts) → `STRIPE_CONNECT_DASHBOARD`.

Production probe: `POST /stripe/account-session` → **400** (exists); `POST /api/stripe/account-session` → **404**.

---

## Marketplace guardrails

| Rule | Detail |
|------|--------|
| Featured products | **`GET /api/featured-products`** only — do not use `/api/products/featured` |
| Food listing | **`GET /api/food/list`** (not `/api/foods/list`) |
| Credentials | Authenticated calls use `credentials: 'include'` / `withCredentials: true` |

---

## Modern admin routes (representative)

| Path prefix | Frontend examples |
|-------------|-------------------|
| `/api/admin/business` | `admin/page.tsx`, `admin/businesses/page.tsx` |
| `/api/admin/categories` | `admin/categories-management/page.tsx` |
| `/api/admin/category-requests` | `admin/category-requests/page.tsx` |
| `/api/admin/testimonials` | `lib/api/testimonials.ts` |

---

## Out of scope (backend-owned)

- Webhooks: `/api/stripe/webhook`, `/api/stripe/payment/webhook`
- Checkout PaymentIntents on consumer checkout flows
- Backend env vars `CONNECT_RETURN_URL`, `CONNECT_REFRESH_URL`
