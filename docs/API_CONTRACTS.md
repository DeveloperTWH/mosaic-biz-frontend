# API Contracts (Frontend Consumption)

**Type:** Reference  
**Last updated:** 2026-06-23

This document lists endpoints **called by this frontend**. Request/response schemas and server behavior live in the backend repo (`Techware-Hut/mosaic-backend`).

Base URL: `NEXT_PUBLIC_API_BASE_URL` (default `https://api.mosaicbizhub.com`).

---

## Canonical rules

| Rule | Detail |
|------|--------|
| Featured products | Use **`GET /api/featured-products`** only |
| Do not use | `/api/products/featured` — **not referenced** in this codebase |
| Product router mount | Backend mounts at **`/api/product`** (singular); ignore stale plural comments in backend source |
| Vendor public listing | Business must have **`isApproved && isActive`** — see [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) |
| Checkout | **`POST /api/orders/initiate`** — single-vendor only; requires approved vendor + Stripe Connect |
| Credentials | Most authenticated calls use `withCredentials: true` / `credentials: 'include'` |
| Local CORS | Browser calls from `localhost` to production API may fail — QA on Vercel preview |

---

## Public marketplace

| Method | Endpoint | Used by | Notes |
|--------|----------|---------|-------|
| GET | `/api/featured-products` | `ShopProducts.tsx`, `lib/api/featured-products.ts` | Homepage featured carousel; may return empty array (backend data) |
| GET | `/api/products/list` | `ProductsClient.tsx` | Primary `/products` listing — **RC QA gate** |
| GET | `/api/services/list` | `services/page.tsx`, product pages | Services listing |
| GET | `/api/food/list` | Foods listing pages | Food listing |
| GET | `/api/ranked` | `ShopProducts.tsx` | Homepage ranked mix; optional `NEXT_PUBLIC_RANKED_PATH` |
| GET | `/api/categories/products` | Product filters, browse | Category tree |
| GET | `/api/categories/services` | Service filters | Category tree |
| GET | `/api/categories/foods` | Food filters | Category tree |
| GET | `/api/minority-types` | Search/filter bars | Minority type dropdown |
| GET | `/api/sub-categories` | Search/detail | Subcategory by slug |
| GET | `/api/public/product/:id` | Buy-now checkout | Public product payload |

---

## Search and detail (live routes)

| Method | Endpoint | Used by | Notes |
|--------|----------|---------|-------|
| GET | `/api/product/:id` | Checkout, detail flows | Live product detail |
| GET | `/api/ranked` | `/search`, product detail search | Ranked listing with filters |

Live UI routes: `/product/[id]`, `/service/[slug]`, `/vendor-profile/*`.

---

## Auth and users

| Method | Endpoint | Used by |
|--------|----------|---------|
| GET | `/api/users/auth/check` | Nav session state |
| POST | `/api/users/register` | Signup |
| POST | `/api/users/verify-otp` | OTP verification |
| POST | `/api/users/resend-otp` | OTP resend |
| GET | `/api/auth/google` | Google OAuth redirect |

Login pages: `/login?type=customer`, `/login?type=vendor`.

---

## Vendor onboarding and partner

| Method | Endpoint | Used by |
|--------|----------|---------|
| GET | `/api/business/my` | Partner hub, inventory |
| GET | `/api/vendor-onboarding/applicationId` | Onboarding progress |
| GET | `/api/vendor-onboarding/status/:id` | Stage status |
| GET | `/api/vendor-onboarding/onboarding-data` | Final review |
| GET | `/api/vendor-onboarding/stage1/upload-url` | Document upload |
| POST | `/api/vendor-onboarding/submit` | Application submit |
| GET | `/api/product/business/:businessId` | Partner products list |
| POST | `/api/service/parent` | Parent service creation — see [vendor/service-creation-flow.md](vendor/service-creation-flow.md) |
| GET | `/api/services/business-service/:businessId` | Service prefill — see [vendor/add-service-prefill.md](vendor/add-service-prefill.md) |

---

## Partner dashboard (private)

| Method | Endpoint | Used by |
|--------|----------|---------|
| GET | `/api/private/products/list` | Inventory |
| GET | `/api/private/services/list` | Inventory |
| GET | `/api/private/food/list` | Inventory |
| GET | `/api/orders/vendor` | Orders tab |
| POST | `/api/orders/:action/:orderId` | Order actions |
| GET/PATCH | `/api/business/:id/tax-settings` | Tax settings |
| GET/PATCH | `/api/business/:id/shipping-settings` | Shipping settings |

---

## Commerce / Stripe

| Method | Endpoint | Used by |
|--------|----------|---------|
| POST | `/api/orders/initiate` | Checkout |
| GET | `/api/orders/retrieve-intent/:paymentIntentId` | Payment success |

Webhook handling is **backend-only** — not in this repo.

---

## Admin

Admin pages under `/admin/*` call admin-scoped APIs. Legacy mounts (`/admin/users`, `/admin/api/products`) and modern mounts (`/api/admin/...`) both exist — see [BACKEND_FRONTEND_ROUTE_CONTRACT.md](BACKEND_FRONTEND_ROUTE_CONTRACT.md).

---

## QA verification commands (read-only)

```bash
# Products list (RC gate)
curl "https://api.mosaicbizhub.com/api/products/list?page=1&limit=10&search="

# Featured products (may be empty — not a frontend bug)
curl "https://api.mosaicbizhub.com/api/featured-products?page=1&limit=12"
```

As of 2026-06-17: list returns `TEST PRODUCT 17 jun`; featured returns `products: []`.

See [PROJECT_STATUS.md](PROJECT_STATUS.md) and [HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md](HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md) for sign-off evidence.
