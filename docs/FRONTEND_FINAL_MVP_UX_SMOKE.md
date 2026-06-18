# Frontend Final MVP UX Smoke Pass

**Branch:** `release/frontend-post-main-ux-smoke-consolidation`  
**Date:** 2026-06-18  
**Original PR #130 branch:** `fix/frontend-final-mvp-ux-smoke-pass` @ `e9a14dc0`  
**Consolidated commit:** `89acd1b0` (on top of `main` @ `76091ac1`)  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`

---

## Consolidation onto current main (2026-06-18)

| Item | Value |
|------|-------|
| Stale PR #130 base | `f47ffe0c` (~40 commits behind `main`) |
| Target main | `76091ac1` |
| Cherry-picked | `e9a14dc0` |
| Consolidated commit | `89acd1b0` |
| Release branch | `release/frontend-post-main-ux-smoke-consolidation` |
| Full release stack HEAD | `204068b9` (includes route reconciliation, Stripe refresh, live-domain proof docs) |

### Conflict resolution (10 files)

Cherry-pick conflicted on files touched by both stale PR #130 and post-redesign `main`. Resolution rule: **keep main layout/styling; apply PR #130 behavioral fixes only.**

| File | Resolution |
|------|------------|
| `Hero.tsx` | Main marketplace hero retained; logged-out CTAs → Explore Marketplace + Become a Vendor |
| `MarketEmptyState.tsx` | Main `market-*` styling + PR #130 `onRetry` / retry button |
| `MarketLoadingBlock.tsx` | Main version (a11y + market tokens) |
| `search/page.tsx` | Main search shell + discovery / no-results empty states |
| `product/[id]/page.tsx` | Main PDP shell + `loadState` error UI (Product unavailable) |
| `ProductServices.tsx` | Static "Featured" sort label (non-interactive) |
| `ServiceCard.tsx` | Main card styling + link → `/vendor-profile/service-vendor/[id]` |
| `services/[id]/page.tsx` | Empty check `length === 0` with main styling |
| `(auth)/layout.tsx` | Main `min-h-screen overflow-x-hidden` (already on main) |
| `partners/dashboard/page.tsx` | Main Suspense fallback (already on main) |

### Build / lint (consolidated branch)

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — Next.js 16.1.2, **68** routes (includes `/partners/connect/refresh`) |
| `npm run lint` | **Fail** — pre-existing repo-wide issues (661 problems); no new errors in consolidated UX files |
| `npm test` | N/A — no test script |

### Guardrails

| Check | Result |
|-------|--------|
| `/api/products/featured` in app code | **0** usages |
| `GET /api/featured-products` | **Unchanged** — `lib/api/featured-products.ts` |
| `NEXT_PUBLIC_API_URL` | **0** usages |
| `localhost:3001` / Elastic Beanstalk in app code | **0** |

---

## Build results

| Run | Result | Notes |
|-----|--------|-------|
| Baseline (pre-fix) | **Pass** (after minimal Suspense fix on `/partners/dashboard`) | Pre-existing `useSearchParams` prerender error on partner dashboard |
| Final (post-fix) | **Pass** | `npm run build` completed with no TypeScript errors |

---

## Pages audited

| Area | Routes / components | Viewports checked |
|------|---------------------|-------------------|
| Header / nav | `Navbar.tsx`, `Footer.tsx` | 375, 390, 768, 1280 |
| Homepage CTAs | `Hero.tsx`, `ShopProducts.tsx`, `page.tsx` | 375, 390, 1280 |
| Search / filters | `search/page.tsx`, `PublicSearchFilterBar.tsx` | 375, 390, 768 |
| Listings + cards | `products/ProductsClient.tsx`, `services/page.tsx`, `foods/page.tsx` | 390, 1280 |
| Product detail | `product/[id]/page.tsx` | 390, 1280 |
| Vendor profiles | `vendor-profile/*/[id]/page.tsx` (all 3) | 390, 1280 |
| Become-a-vendor | `become-a-vendor/page.tsx` | 1280 |
| Auth | `(auth)/login`, `(auth)/signup`, `(auth)/layout.tsx` | 390 |
| Empty / loading / error | New `MarketEmptyState.tsx`, `MarketLoadingBlock.tsx` | — |
| Mobile layout | Hero, search, auth signup button width | 390 |

---

## Issues found

### P0 — Launch embarrassers

| # | Issue | Before |
|---|-------|--------|
| 1 | Product detail infinite spinner on fetch failure | `product === null` always showed loading spinner |
| 2 | Service category page inverted empty logic | `services.length === 1` showed "Service not found" |
| 3 | Service category card wrong link | "Read More" linked to legacy `/service/[slug]` |
| 4 | Product review login redirect broken | Fallback used non-existent `/vendor-profile/product/[id]` |
| 5 | Bare `/search` felt broken | Empty white box with no guidance when no filters applied |
| 6 | Food "Book Table" dead button | Button enabled but had no handler |
| 7 | Partner dashboard build failure | `useSearchParams` without Suspense broke prerender |

### P1 — Coherence polish

| # | Issue | Before |
|---|-------|--------|
| 8 | Listing API failures looked like empty results | `services`, `foods`, `products` catch blocks only logged to console |
| 9 | Featured carousel on `/products` ignored errors | `useRankedProducts().error` never rendered |
| 10 | Vendor profile errors had no recovery | Red text only, no retry or browse CTA |
| 11 | Hero CTAs unclear for launch testers | Logged-out hero showed only login buttons |
| 12 | Search tab labels awkward | "Search For Food Item" etc. |
| 13 | Non-functional sort on `/products` | Sort dropdown had no handler |
| 14 | Vendor signup button overflow @ 390px | Fixed `px-[120px]` on register button |
| 15 | Auth pages horizontal scroll risk | No `overflow-x-hidden` on auth layout |

### P2 — Documented, not fixed

- URL param naming drift (`keyword` vs `q`, `location` vs `city`)
- Product PDP embedded search filter bar clutter on mobile
- Legacy mock routes (`/service/[slug]`, etc.) — redirects exist in `next.config.ts`
- Become-a-vendor → `/signup?type=vendor` extra hop vs direct `/partners/business/new`
- Full nav cleanup (bottom nav, hamburger IA) — on separate branch, not merged to `main` yet
- Partner dashboard tab horizontal overflow

---

## Fixes made

| File | Fix |
|------|-----|
| `app/(home)/Components/MarketEmptyState.tsx` | **Added** shared empty/error state with optional retry + CTA |
| `app/(home)/Components/MarketLoadingBlock.tsx` | **Added** shared loading spinner block |
| `app/(home)/product/[id]/page.tsx` | `loadState` machine; error UI; fixed review-login redirect |
| `app/(home)/services/[id]/page.tsx` | Fixed empty check `length === 0` |
| `app/(home)/services/[id]/components/ServiceCard.tsx` | Link to `/vendor-profile/service-vendor/[id]` |
| `app/(home)/search/page.tsx` | Discovery vs no-results empty states; tab labels; shared loading block |
| `app/(home)/vendor-profile/food-vendor/[foodId]/page.tsx` | Honest table-booking toast; error retry UI |
| `app/(home)/vendor-profile/service-vendor/[serviceId]/page.tsx` | Error retry UI + shared loading block |
| `app/(home)/vendor-profile/product-vendor/[businessId]/page.tsx` | Error retry UI + shared loading block |
| `app/(home)/Components/Hero.tsx` | "Explore Marketplace" + "Become a Vendor" CTAs; sign-in links below |
| `app/(home)/services/page.tsx` | `fetchError` banner with retry |
| `app/(home)/foods/page.tsx` | `fetchError` banner with retry |
| `app/(home)/products/ProductsClient.tsx` | List + carousel error banners with retry |
| `app/(home)/products/components/ProductServices.tsx` | Replaced non-functional sort dropdown with "Featured" label |
| `app/(auth)/signup/page.tsx` | Responsive register button width |
| `app/(auth)/layout.tsx` | `overflow-x-hidden` on auth shell |
| `app/(partner)/partners/dashboard/page.tsx` | Suspense wrapper for build prerender |

---

## Screenshots

Reused existing QA assets where still representative:

| Screenshot | Path | Relevance |
|------------|------|-----------|
| Homepage desktop | `docs/qa-screenshots/homepage-desktop.png` | Baseline homepage |
| Homepage mobile | `docs/qa-screenshots/homepage-mobile.png` | Mobile hero layout |
| Login @ 390px | `docs/qa-screenshots/mobile-nav-login-iphone-390.png` | Auth mobile reference |
| Products mobile | `docs/qa-screenshots/mobile-nav-products-iphone-390.png` | Listing mobile |
| Search mobile | `docs/qa-screenshots/mobile-nav-search-iphone-390.png` | Discover tab landing |
| Product detail | `docs/qa-screenshots/mobile-nav-product-detail-iphone-390.png` | PDP mobile |

New captures recommended on Vercel preview after merge: hero CTAs, `/search` discovery empty state, product unavailable state.

---

## Contract checks

| Check | Status |
|-------|--------|
| `GET /api/featured-products` preserved | **Pass** — `ShopProducts.tsx` + `lib/api/featured-products.ts` unchanged path |
| Route contract centralized | **Pass** — `lib/api/routeContract.ts` added on release branch (#129) |
| Stripe Connect refresh route | **Pass** — `/partners/connect/refresh` added (#128); no checkout/webhook changes |
| No payment / checkout / order logic changes | **Pass** |
| No backend API path renames | **Pass** |
| Food booking: UX honesty only (no new API) | **Pass** |

---

## Remaining non-launch improvements

1. Merge nav cleanup branch (bottom nav, simplified hamburger, footer-only legal)
2. Normalize search URL params (`keyword` / `q`, `location` / `city`)
3. Remove or hide legacy mock detail routes in dev
4. Wire food table booking when backend endpoint is MVP-ready
5. Product detail marketplace shell / sticky commerce bar (Phase 2)
6. Partner dashboard API blockers (`/api/business/my`, onboarding-data)

---

## Manual test checklist (PR #131 release)

**Release PR:** https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/131  
**Vercel preview URL:** https://mosaic-biz-frontend-launch-git-release-0b7777-digital-builders.vercel.app  
**Preview access:** SSO-protected (HTTP 401 without Vercel login) — browser QA run on local consolidated branch @ `9a625575`  
**Vercel build:** **Pass** (deployment `FsuMoFkcjHp6zEQMde55nqmF85Nk`)  
**Tested:** 2026-06-18

| Check | Preview (Vercel) | Local consolidated branch |
|-------|------------------|---------------------------|
| `/` hero CTAs (logged out) | Blocked (SSO) | **Pass** — Explore Marketplace + Become a Vendor |
| `/search` discovery empty state | Blocked (SSO) | **Pass** |
| `/product/[invalid-id]` unavailable UI | Blocked (SSO) | **Pass** — Product unavailable + retry |
| `/partners/dashboard` | Blocked (SSO) | **Pass** — renders, no prerender crash |
| `/partners/connect/refresh` | Blocked (SSO) | **Pass** — route exists, recovery UI loads |
| `GET /api/featured-products` | N/A (SSO) | **Pass** — direct API probe 200 |
| `/api/products/featured` usages | N/A | **Pass** — 0 in codebase |

**Deferred (post-merge bug-fix pass):** `/search?keyword=test` zero-results, `/services/[category]` single-result live check, food Book Table toast, auth @ 390px mobile viewport on production.

---

## Manual test checklist (local dev @ consolidated branch — prior run)

**Tested:** 2026-06-18 on `http://localhost:3000` (`release/frontend-post-main-ux-smoke-consolidation` @ `204068b9`)

- [x] `/` — hero shows **Explore Marketplace** + **Become a Vendor** when logged out (after hydration)
- [x] `/search` — discovery empty state ("Search the marketplace" + Browse products CTA)
- [ ] `/search?keyword=test` — no-results empty state when API returns zero (not re-run; logic present in `search/page.tsx`)
- [x] `/product/[invalid-id]` — **Product unavailable** state with retry + browse CTA (not infinite spinner)
- [ ] `/services/[category]` — single result renders (code fix verified; live category not re-run)
- [ ] `/vendor-profile/food-vendor/[id]` — Book Table toast (not re-run this pass)
- [ ] `/login?type=customer` @ 390px — no horizontal scroll (layout fix inherited from main)
- [x] `/partners/dashboard` — renders without prerender crash (Suspense wrapper)
- [x] `/partners/connect/refresh` — route exists; recovery UI loads (logged-out shows safe error path)
- [x] Network: `GET https://api.mosaicbizhub.com/api/featured-products` → **200** (direct probe)
- [x] No `/api/products/featured` in codebase grep

**Vercel preview:** pending deploy from `release/frontend-post-main-ux-smoke-consolidation` push — re-run mobile viewport checklist on preview URL when ready.

### PR #130 merge recommendation

**Recommend:** Force-update PR #130 branch (`fix/frontend-final-mvp-ux-smoke-pass`) with `--force-with-lease` from `release/frontend-post-main-ux-smoke-consolidation`, **or** close #130 and open one release PR from this branch (supersedes #127–#130).

**Do not merge stale PR #130 as-is** — it is based on pre-redesign `main` @ `f47ffe0c`.
