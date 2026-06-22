# Frontend Documentation Evidence Log

**Type:** Launch evidence (control pack index)  
**Last updated:** 2026-06-21  
**Pack:** Frontend as-built documentation — Mosaic Biz Hub launch readiness

---

## E2E automation evidence (#163)

| Item | Value |
|------|-------|
| Branch | `test/frontend-critical-journey-playwright` |
| Base commit (launch `main`) | `df3b1b198262ef298c52d503ece6702e3c9662dc` |
| Runbook | [FRONTEND_E2E_TEST_RUNBOOK.md](FRONTEND_E2E_TEST_RUNBOOK.md) |
| Test root | `e2e/` + [playwright.config.ts](../../playwright.config.ts) |
| Default mode | Mocked API via Playwright `page.route()` |
| Issues | #163, related #162 |

---

## Branch and commits

| Item | Value |
|------|-------|
| Branch | `docs/frontend-as-built-documentation-pack` |
| Base commit (launch `main`) | `ebf3f4dcfe57dd56f74a38d5169bdbf4968f95aa` |
| Documentation commit SHA | `2fe2d225ba59a82d941ce922942b39108b0b6798` |
| Remote | `launch` → `Digital-Builders-757/mosaic-biz-frontend-launch` |
| PR link | https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/147 |

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

---

## Issue #164 — API client phase 1

| Item | Value |
|------|-------|
| Branch | `refactor/frontend-api-client-phase1` |
| Base commit (`main`) | `df3b1b198262ef298c52d503ece6702e3c9662dc` |
| Doc | [FRONTEND_API_CLIENT_PHASE1.md](FRONTEND_API_CLIENT_PHASE1.md) |
| Unit tests | `npm run test:unit` (`lib/api/httpClient.test.ts`) |

Migrated: auth session/logout, vendor onboarding, admin vendor review, order initiation, Stripe Connect status/account-link.

## Issue #114 — Quality scan harness

| Item | Value |
|------|-------|
| Branch | `test/frontend-quality-scan-harness` |
| Base commit (`main`) | `df3b1b198262ef298c52d503ece6702e3c9662dc` |
| Runbook | [FRONTEND_QUALITY_SCAN_RUNBOOK.md](FRONTEND_QUALITY_SCAN_RUNBOOK.md) |
| Entry script | `npm run quality:scan` |
| Reports | `quality-reports/summary.{json,md}` |

Added: `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`, `lighthouse`, `quality/*`, `playwright.quality.config.ts`, `lighthouserc.cjs`, `lighthouserc.mobile.cjs`, `scripts/run-quality-scan.mjs`.

**Initial scan baselines (local, mocked API, 2026-06-22):**

| Target | Performance | Accessibility | Best practices | SEO |
|--------|-------------|---------------|----------------|-----|
| Desktop (avg) | ~0.75 | ~0.94 | ~0.96 | ~0.99 |
| Mobile (avg) | ~0.75 | ~0.94 | ~0.96 | ~0.99 |

**Blocking findings (documented debt, not fixed in harness PR):**

- axe critical/serious on marketplace filters (`button-name`, `select-name`, `label`) and legal pages (`color-contrast`)
- Fixed in harness PR: broken `/support` link on `/dispute` → `/contact`

**Playwright counts (first full run):** 17 passed, 26 failed (14 axe + 1 link + 11 mobile webkit missing — corrected to `mobile-chrome`/Chromium in config).
