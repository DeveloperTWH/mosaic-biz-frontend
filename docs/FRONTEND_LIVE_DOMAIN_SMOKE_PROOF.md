# Frontend Live-Domain Smoke Proof

**Issue:** [#125 — Vendor dashboard and onboarding live-domain smoke proof](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/125)  
**Type:** Audit / proof pack (docs only — no application code changes)  
**Date (UTC):** 2026-06-18T16:55:00Z  
**Branch:** `audit/frontend-live-domain-smoke-proof-125`  
**Base commit:** `76091ac1c12697cadbd09db43970d5af53797daf` (`docs: mark PR #108 merged in project status`)  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`

**Related static audits:** #122 (env vars), #123 (credentials)  
**Backend dependency:** CORS issue #80 merged/deployed (confirmed by user for this run)

---

## Test surfaces

| Surface | URL | Used in this proof |
|---------|-----|-------------------|
| **Production (primary)** | https://mosaic-biz-frontend-launch.vercel.app | Yes — all live route/network smoke |
| **Preview** | Vercel preview deployments (SSO-protected) | Skipped per test plan |
| **API** | https://api.mosaicbizhub.com | Yes — direct + browser-origin checks |

---

## Build result

| Check | Result | Evidence |
|-------|--------|----------|
| `npm install` | Skipped | `node_modules` present on `main` |
| `npm run build` | **Pass** | Exit code 0 · Next.js **16.1.2** (Turbopack) · **67** app routes compiled |

```text
✓ Compiled successfully
✓ Generating static pages (67/67)
```

---

## Env var status

| Variable | Preview | Production | Notes |
|----------|---------|------------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | **Confirmed** `https://api.mosaicbizhub.com` | **Effective pass** (see below) | Vercel project: `digital-builders/mosaic-biz-frontend-launch` |
| `NEXT_PUBLIC_API_URL` | N/A | N/A | **Not defined / not used** in app code |
| `process.env.API_BASE_URL` | N/A | N/A | **Not used** — only local aliases of `NEXT_PUBLIC_API_BASE_URL` |

### Preview (Vercel CLI)

```text
npx vercel env pull --environment=preview
NEXT_PUBLIC_API_BASE_URL="https://api.mosaicbizhub.com"
```

### Production (Vercel CLI)

```text
npx vercel env pull --environment=production
NEXT_PUBLIC_API_BASE_URL=""
```

CLI masks Sensitive/Encrypted production values as empty. **Manual dashboard confirmation still recommended**, but live production behavior confirms the effective value:

- Browser network calls from production origin hit `https://api.mosaicbizhub.com` (see Route smoke table).
- Deployed bundle scan: `43ee338dc372d668.js` on `/partners/dashboard` contains `api.mosaicbizhub.com` (1/10 sampled dashboard chunks).

Only [`lib/api.ts`](../lib/api.ts) hardcodes fallback `https://api.mosaicbizhub.com/`; most inline fetch/axios calls have no fallback and depend on build-time env.

---

## API base URL verification (#122 reconciliation)

Static grep audit on `main` @ `76091ac1`:

| Check | Command / scope | Result |
|-------|-----------------|--------|
| Canonical public env | `rg NEXT_PUBLIC_API_BASE_URL --glob '*.{ts,tsx}'` | **~107 files**, **100+ occurrences** — sole public API env |
| Dead env | `rg NEXT_PUBLIC_API_URL --glob '*.{ts,tsx,js,jsx}'` | **0** matches in app code |
| Wrong env | `rg 'process\.env\.API_BASE_URL'` | **0** matches |
| Local aliases | `const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL` | **25 files** (acceptable pattern) |
| Stale backend domains | `rg 'localhost:3001\|elasticbeanstalk'` in app code | **0** hardcoded backend URLs |
| Non-canonical featured path | `rg '/api/products/featured'` | **0** matches |
| Canonical featured path | `rg '/api/featured-products'` | **3** refs — [`lib/api/featured-products.ts`](../lib/api/featured-products.ts), [`ShopProducts.tsx`](../app/(home)/Components/ShopProducts.tsx) (active), orphaned `FeaturedProducts.tsx` |

**Live confirmation:** All browser-origin API requests observed on production used host `api.mosaicbizhub.com` — no localhost, Elastic Beanstalk, or stale API domains.

---

## Credential / CORS findings (#123 reconciliation)

### Static audit

| Check | Result |
|-------|--------|
| `credentials: 'include'` / `withCredentials: true` in app code | **~90 files**, **100+ occurrences** |
| Shared axios client [`lib/api.ts`](../lib/api.ts) | `withCredentials: true` + canonical base URL fallback |
| Auth-critical paths (spot-checked) | login, auth/check, OTP, `business/my`, vendor onboarding — all credentialed per #123 audit |

### CORS preflight (OPTIONS) from production origin

Origin: `https://mosaic-biz-frontend-launch.vercel.app`

| Endpoint | Preflight | Allow-Origin | Allow-Credentials |
|----------|-----------|--------------|-------------------|
| `GET /api/users/auth/check` | **204** | production Vercel alias | **true** |
| `GET /api/vendor-onboarding/onboarding-data` | **204** | production Vercel alias | **true** |
| `GET /api/business/my` | **204** | production Vercel alias | **true** |

### Credentialed GET (unauthenticated, no cookies pasted)

Origin: `https://mosaic-biz-frontend-launch.vercel.app`

| Endpoint | HTTP | CORS headers | Verdict |
|----------|------|--------------|---------|
| `GET /api/users/auth/check` | **401** | `Access-Control-Allow-Origin` + `Allow-Credentials: true` | **Pass** — auth rejection, not CORS failure |
| `GET /api/vendor-onboarding/onboarding-data` | **401** | same | **Pass** — clean unauthenticated behavior |

Direct (no browser): `GET /api/users/auth/check` → **401** (expected without session cookie).

### Browser network evidence (production, sanitized)

**Homepage `/` — Performance API resource entries:**

```text
GET https://api.mosaicbizhub.com/api/users/auth/check
GET https://api.mosaicbizhub.com/api/minority-types
GET https://api.mosaicbizhub.com/api/categories/services
GET https://api.mosaicbizhub.com/api/featured-products?page=1&limit=12
```

**`/products` — Performance API resource entries:**

```text
GET https://api.mosaicbizhub.com/api/users/auth/check
GET https://api.mosaicbizhub.com/api/minority-types
GET https://api.mosaicbizhub.com/api/categories/products
GET https://api.mosaicbizhub.com/api/ranked?page=1&pageSize=8&maxPerVendor=3
GET https://api.mosaicbizhub.com/api/products/list?search=&city=&minorityType=&page=1&limit=10
```

No CORS console errors observed during automated browser pass. Cookies/auth headers **not** recorded in this document.

---

## Route smoke table

Production URL base: `https://mosaic-biz-frontend-launch.vercel.app`

| Route | Page HTTP | Expected API | API HTTP (direct or browser) | UI / notes | Result |
|-------|-----------|--------------|------------------------------|------------|--------|
| `/` | 200 | `GET /api/featured-products?page=1&limit=12` | **200** (1 product) | Featured carousel shows **TEST PRODUCT 17 jun** | **Pass** |
| `/products` | 200 | `GET /api/products/list?...` | **200** (`total=1`) | Grid shows **TEST PRODUCT 17 jun** | **Pass** |
| `/services` | 200 | `GET /api/services/list?...` | **200** | Page shell loads | **Pass** |
| `/foods` | 200 | `GET /api/food/list?...` | **200** | Page shell loads | **Pass** |
| `/vendors` | 200 | `GET /api/business?...` | **200** | Page shell loads | **Pass** |
| `/product/6a32889af647330ba64cb605` | 200 | product detail fetch | page renders | Detail route loads | **Pass** |
| `/vendor-profile/product-vendor/6a2bb9568162793f8537945f` | 200 | vendor profile APIs | page renders | Vendor profile loads | **Pass** |
| `/login?type=customer` | 200 | — | — | Sign-in form visible | **Pass** |
| `/login?type=vendor` | 200 | — | — | (same route family) | **Pass** |
| `/partners` | 200 | onboarding APIs when authed | — | Public shell loads | **Pass** |
| `/partners/business-profile` | 200 | `GET /api/vendor-onboarding/onboarding-data` | **401** unauth + CORS OK | Shows loading state (no CORS error) | **Pass** (unauth) |
| Auth check (navbar) | — | `GET /api/users/auth/check` | **401** + CORS OK | No CORS failure when logged out | **Pass** |
| Logged-in vendor dashboard | — | `GET /api/business/my`, onboarding-data | **Not executed** | Requires test credentials — out of scope for automated proof | **Pending manual** |

### Direct API control checks (backend health)

```text
GET /api/featured-products?page=1&limit=12        → 200 (totalProducts=1)
GET /api/products/list?page=1&limit=10            → 200 (total=1, TEST PRODUCT 17 jun)
GET /api/services/list?page=1&limit=10            → 200
GET /api/food/list?page=1&limit=10                → 200
GET /api/business?page=1&limit=10                 → 200
```

---

## Canonical featured endpoint

**Preserved:** `GET /api/featured-products` via [`lib/api/featured-products.ts`](../lib/api/featured-products.ts) → [`ShopProducts.tsx`](../app/(home)/Components/ShopProducts.tsx).

**Not used:** `/api/products/featured`.

Live proof: homepage browser request `GET https://api.mosaicbizhub.com/api/featured-products?page=1&limit=12` → **200** with product data.

---

## #122 / #123 validation statement

| Issue | Static audit | Live-domain proof | Close recommendation |
|-------|--------------|-------------------|----------------------|
| **#122** Env canonicalization | Pass | **Validated** — production pages call `api.mosaicbizhub.com`; preview env confirmed; bundle embeds API host | **Yes** — env strategy confirmed live |
| **#123** Credentialed auth wiring | Pass | **Validated (unauthenticated path)** — auth/check and onboarding-data return **401 with CORS allowlist**, not network/CORS failures | **Yes** for frontend credential wiring; logged-in **200** flows remain optional manual sign-off |

---

## Blockers and follow-ups

| Item | Severity | Notes |
|------|----------|-------|
| Production env CLI shows empty `NEXT_PUBLIC_API_BASE_URL` | Low | Effective behavior correct; confirm value in Vercel dashboard for audit trail |
| Logged-in vendor dashboard / onboarding **200** | Medium | Not tested without test account — unauthenticated CORS/auth behavior passes |
| Vercel preview SSO | Info | Skipped; production alias used instead |
| Stale admin API paths (#122 notes) | Low | `admin/users`, inconsistent admin prefix — out of live smoke scope; no live failure observed |
| Missing `/partners/connect/refresh` | Info | Tracked in #126 — not in #125 scope |

**No frontend code changes required** from this smoke proof.

---

## Commands executed

```bash
git checkout main && git pull && git checkout -b audit/frontend-live-domain-smoke-proof-125
npm run build
rg NEXT_PUBLIC_API_BASE_URL --glob '*.{ts,tsx}'
rg NEXT_PUBLIC_API_URL --glob '*.{ts,tsx,js,jsx}'
rg 'process\.env\.API_BASE_URL'
rg "credentials:\s*['\"]include['\"]|withCredentials:\s*true" --glob '*.{ts,tsx}'
rg '/api/featured-products'
npx vercel env pull --environment=preview
npx vercel env pull --environment=production
```

Cross-links: [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md) · [FRONTEND_LAUNCH_WORK_ORDER.md](FRONTEND_LAUNCH_WORK_ORDER.md)
