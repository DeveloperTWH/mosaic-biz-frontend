# Frontend Documentation Evidence Log

**Type:** Launch evidence (control pack index)  
**Last updated:** 2026-06-19  
**Pack:** Frontend as-built documentation — Mosaic Biz Hub launch readiness

---

## Branch and commits

| Item | Value |
|------|-------|
| Branch | `docs/frontend-as-built-documentation-pack` |
| Base commit (launch `main`) | `ebf3f4dcfe57dd56f74a38d5169bdbf4968f95aa` |
| Documentation commit SHA | See git log after push |
| Remote | `launch` → `Digital-Builders-757/mosaic-biz-frontend-launch` |
| PR link | See pull request on launch repo (created after push) |

---

## Files created

All under `docs/frontend/`:

| File | Purpose |
|------|---------|
| [FRONTEND_ARCHITECTURE_AS_BUILT.md](FRONTEND_ARCHITECTURE_AS_BUILT.md) | System boundary, stack, folders, API patterns |
| [FRONTEND_ROUTE_MAP.md](FRONTEND_ROUTE_MAP.md) | 95 pages → public URLs, layouts, auth notes |
| [FRONTEND_API_USAGE_INVENTORY.md](FRONTEND_API_USAGE_INVENTORY.md) | API call inventory by domain |
| [FRONTEND_ENVIRONMENT_VARIABLES_NAMES_ONLY.md](FRONTEND_ENVIRONMENT_VARIABLES_NAMES_ONLY.md) | Env var names and purpose (no values) |
| [FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md) | Session model, middleware, guards |
| [FRONTEND_MARKETPLACE_SURFACE_MAP.md](FRONTEND_MARKETPLACE_SURFACE_MAP.md) | Consumer browse/cart/checkout surfaces |
| [FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md](FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md) | Admin, vendor, customer surfaces |
| [FRONTEND_VISUAL_QA_SURFACE.md](FRONTEND_VISUAL_QA_SURFACE.md) | Human QA surface checklist |
| [FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md](FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md) | This file |

**Updated:** [../README.md](../README.md) — doc map + launch readiness reading path

---

## Commands run

```powershell
git fetch launch main
git checkout main
git pull launch main
git checkout -b docs/frontend-as-built-documentation-pack
npm run build
npm run lint
```

Grep verification (app code `*.{ts,tsx}` only):

| Pattern | Result |
|---------|--------|
| `/api/products/featured` | **0 matches** |
| `/api/featured-products` | **3 files** (`lib/api/featured-products.ts`, `ShopProducts.tsx`, `FeaturedProducts.tsx`) |
| `LEGACY_ADMIN_USERS` / `LEGACY_ADMIN_PRODUCTS` / `STRIPE_CONNECT_DASHBOARD` | Used in `routeContract.ts`, admin users, products-admin, finance page |

---

## Build / lint results

| Command | Result | Summary |
|---------|--------|---------|
| `npm run build` | **PASS** | Next.js 16.1.2; compiled in ~12.4s; 69 routes in build table; TypeScript OK |
| `npm run lint` | **FAIL** | 662 problems (345 errors, 317 warnings) — pre-existing debt; not introduced by this docs pack |
| `npm test` | **N/A** | No test script in `package.json` |

Build warnings noted (non-blocking):

- Multiple lockfiles / turbopack root inference
- Middleware file convention deprecated (Next.js proxy migration message)

---

## Key API usage findings

1. **Featured products canonical:** `GET /api/featured-products` only; `/api/products/featured` not referenced in app code.
2. **Legacy admin mounts active:** `GET /admin/users`, `GET/PATCH /admin/api/products` via `lib/api/routeContract.ts`.
3. **Legacy Stripe mounts active:** `/stripe/account-session`, `/stripe/express-login-link`, `/stripe/account-balance`, `/stripe/last-payout` on partner finance page; Connect onboarding uses `/api/connect/:businessId/*`.
4. **Three API patterns coexist:** inline fetch/axios, `lib/api.ts`, `lib/api/*` domain modules.
5. **No Next.js API routes** in repo (`app/**/route.ts` = 0).

---

## Frontend / backend route mismatches

| Topic | Finding |
|-------|---------|
| `/api/admin/users` vs `/admin/users` | Frontend uses **legacy** `/admin/users`; routeContract documents `/api/admin/users` returns 404 on live probe |
| `/api/stripe/*` vs `/stripe/*` | Frontend finance page uses **legacy** `/stripe/*` root mount |
| Admin featured toggle vs public featured | Admin: `PATCH /admin/api/products/:id/featured`; Public: `GET /api/featured-products` — different endpoints by design |
| `NEXT_PUBLIC_APP_URL` vs `NEXT_PUBLIC_CLIENT_BASE_URL` | Both used; checkout return URLs use `CLIENT_BASE_URL`; metadata uses `APP_URL` — **Evidence Needed** for Vercel parity |

---

## Key risks / unknowns

| Risk | Status |
|------|--------|
| Cross-origin API cookies vs middleware | Documented; preview vs local behavior **Evidence Needed** |
| Dual partner surfaces (onboarding vs dashboard) | Documented; stage routing **Evidence Needed** for edge cases |
| Lint debt (662 issues) | Pre-existing; not blocking build |
| UI loading/error/empty states | Many inventory rows marked **Evidence Needed** — requires per-page read or QA |
| `/dashboard` route purpose | Middleware matched; role redirect **Evidence Needed** |
| Sentry production DSN | See PROJECT_STATUS — may be blocked on Vercel env |

---

## What was NOT tested

- Production or preview deployment
- Browser E2E / visual QA
- Live API probing against `api.mosaicbizhub.com`
- Stripe live payments
- Auth flows with real credentials on preview
- Backend schema validation

---

## Recommended next step

1. Human QA on Vercel RC preview using [../FRONTEND_SMOKE_CHECKLIST.md](../FRONTEND_SMOKE_CHECKLIST.md) and [FRONTEND_VISUAL_QA_SURFACE.md](FRONTEND_VISUAL_QA_SURFACE.md).
2. Cross-repo review with `Techware-Hut/mosaic-backend` to confirm legacy path mounts (`/admin/users`, `/stripe/*`) remain supported at launch.
3. Align Vercel env: `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_CLIENT_BASE_URL` to same frontend origin.
4. Triage lint debt separately — not part of this documentation pack.

---

## Stop conditions respected

No production deploy, auth architecture changes, Next.js API routes, checkout changes, route contract edits, route deletions, or new features were made.
