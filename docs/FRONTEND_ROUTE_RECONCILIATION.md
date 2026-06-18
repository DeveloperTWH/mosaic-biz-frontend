# Frontend Route Reconciliation

**Date (UTC):** 2026-06-18  
**Branch:** `fix/frontend-route-contract-reconciliation`  
**Base:** `main` @ `76091ac1`  
**Backend contract:** [BACKEND_FRONTEND_ROUTE_CONTRACT.md](BACKEND_FRONTEND_ROUTE_CONTRACT.md) (mirrors `Techware-Hut/mosaic-backend` `docs/API_SURFACE.md`)

---

## Summary

Audit of known suspicious frontend API paths from #122. **None required route replacement** — production probes confirm the legacy paths are correct. Action taken: **document + centralize constants** in [`lib/api/routeContract.ts`](../lib/api/routeContract.ts) to prevent mistaken “normalization” to `/api/admin/...` or `/api/stripe/...`.

**Build:** `npm run build` pass (see PR).  
**Featured products:** unchanged — `GET /api/featured-products` only.  
**Credentials:** preserved on all touched call sites.

---

## Search results

| Pattern | App-code hits | Result |
|---------|---------------|--------|
| `/admin/users` | 1 | **Verified correct** — not stale |
| `/admin/api/products` | 2 (products-admin) | **Verified correct** |
| `/stripe/` | 4 (finance page) | **Verified correct** |
| `/api/products/featured` | 0 | **Not used** (canonical `/api/featured-products`) |
| `localhost:3001` | 0 | None in app code |
| Elastic Beanstalk domains | 0 | None in app code |
| `localhost` in API URLs | 0 | Comment-only in `lib/api.ts` fallback host |

---

## Reconciliation table

| Stale path (suspected) | File / location | Production probe | Action | Backend route used |
|------------------------|-----------------|------------------|--------|-------------------|
| `/admin/users` | [`app/(admin)/admin/users/page.tsx`](../app/(admin)/admin/users/page.tsx) | **401** (exists); `/api/admin/users` → **404** | **Kept** — wired via `LEGACY_ADMIN_USERS` constant | `GET /admin/users` |
| `/admin/api/products` | [`lib/api/products-admin.ts`](../lib/api/products-admin.ts) | **401**; `/api/admin/products` → **404** | **Kept** — wired via `LEGACY_ADMIN_PRODUCTS` constant | `GET /admin/api/products`, `PATCH …/:id/featured` |
| `/stripe/account-session` | [`finance/page.tsx`](../app/(partner)/partners/[businessid]/finance/page.tsx) | **400** POST; `/api/stripe/account-session` → **404** | **Kept** — wired via `STRIPE_CONNECT_DASHBOARD` constants | `POST /stripe/account-session` |
| `/stripe/express-login-link` | finance page | **400** POST | **Kept** | `POST /stripe/express-login-link` |
| `/stripe/account-balance` | finance page | **500** GET (invalid account; route exists) | **Kept** | `GET /stripe/account-balance` |
| `/stripe/last-payout` | finance page | **500** GET (invalid account; route exists) | **Kept** | `GET /stripe/last-payout` |

---

## Documentation fixes

| Item | Action |
|------|--------|
| Missing `docs/BACKEND_FRONTEND_ROUTE_CONTRACT.md` | **Created** — frontend mirror of backend API surface for legacy prefixes |
| `docs/API_CONTRACTS.md` food listing | **Corrected** `/api/foods/list` → `/api/food/list` (production: food **200**, foods **404**) |

---

## Remaining blockers (not frontend route bugs)

| Blocker | Owner | Notes |
|---------|-------|-------|
| Dual admin prefix styles (`/admin/...` vs `/api/admin/...`) | Backend | Frontend now documents both; long-term backend consolidation optional |
| Stripe dashboard routes auth hardening | Backend | API_SURFACE marks `/stripe/*` as P0-8 auth gap — not changed in this PR |
| Manual admin QA | QA | `/admin/users` and `/admin/products` require logged-in admin session on live API |

---

## Files changed

| File | Change |
|------|--------|
| `lib/api/routeContract.ts` | **Added** — documented legacy path constants |
| `lib/api/products-admin.ts` | Use `LEGACY_ADMIN_PRODUCTS` |
| `app/(admin)/admin/users/page.tsx` | Use `LEGACY_ADMIN_USERS` |
| `app/(partner)/partners/[businessid]/finance/page.tsx` | Use `STRIPE_CONNECT_DASHBOARD` |
| `docs/BACKEND_FRONTEND_ROUTE_CONTRACT.md` | **Added** |
| `docs/FRONTEND_ROUTE_RECONCILIATION.md` | **Added** (this file) |
| `docs/API_CONTRACTS.md` | Food list path correction |

---

## Manual smoke (post-merge)

1. Admin sign-in → `/admin/users` loads user table (or auth error, not 404)
2. Admin → `/admin/products` — list loads; featured toggle hits `PATCH /admin/api/products/:id/featured`
3. Partner finance → embedded Stripe components init (or auth error from backend, not 404 on `/stripe/account-session`)
4. Homepage → still calls `GET /api/featured-products`
