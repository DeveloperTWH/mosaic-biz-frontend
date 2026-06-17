# Homepage Marketplace Redesign — QA Report

> **Type:** QA evidence  
> **Living section:** [Post-merge sign-off](#post-merge-sign-off-pr-30-merged) (2026-06-17)  
> **Status hub:** [PROJECT_STATUS.md](PROJECT_STATUS.md)

**Branch:** `feat/homepage-redesign`  
**PR:** https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/30  
**Preview:** https://mosaic-biz-frontend-launch-git-feat-hom-4afb18-digital-builders.vercel.app  
**Base (PR target):** `sprint/frontend-release-candidate`  
**Report date:** 2026-06-17  
**Production deployed:** No

---

## QA method

| Method | Result |
|--------|--------|
| Vercel preview (automated) | **Blocked** — deployment protection / SSO (401). Manual browser QA required on preview URL. |
| Local `localhost:3000` (automated) | **Partial** — layout/chrome verified; API calls fail without backend on `:3001`. |
| Code verification | **Complete** — in-scope files checked for API paths, legacy tokens, and out-of-scope diffs. |
| `npm run build` | **Passed** (pre-QA and post-fix) |

---

## Routes checked

| Route | Desktop | Mobile | Visual (styling) | Functional (API) |
|-------|---------|--------|------------------|------------------|
| `/` | Yes (local) | Yes (local) | Pass — dusk hero, announcement bar, trust bar, market sections | Blocked locally (backend down); verify on Vercel preview |
| `/products` | Yes (local) | Yes (local) | Pass — dark shell, filter panel, category strip, cards | Blocked locally |
| `/foods` | Yes (local) | — | Pass — dark listing body, JoinVendorBanner | Blocked locally |
| `/services` | Yes (local) | — | Pass — main content dark; **fallback loader had white main (fixed)** | Blocked locally |
| `/services/[id]` | Not reached (no API data locally) | — | Verify on preview with live category slug | Blocked locally |
| `/vendors` | Yes (local) | — | Pass grid cards; **CustomSelect dropdown still white (deferred)** | Blocked locally |
| `/about` | Yes (local) | — | Pass — PublicPageHero + readable AboutContent | N/A |
| `/cart` | Yes (local) | — | Pass — navbar/footer chrome only (page out of redesign scope) | N/A |
| Product detail | Documented gap only | — | **Out of scope** — legacy light surfaces remain | N/A |

---

## Checklist results

| Check | Result |
|-------|--------|
| Homepage hero — premium dusk style | **Pass** (local visual) |
| Navbar does not overlap content | **Pass** |
| Announcement bar spacing | **Pass** |
| Mobile menu usable | **Pass** (hamburger + nav present; full tap test on Vercel preview) |
| No white/cream legacy blocks on primary marketplace routes | **Pass** (main content); Suspense fallback on `/services` was white — **fixed** |
| No legacy orange accents in redesigned areas | **Pass** (grep + visual) |
| Cards, filters, inputs, buttons use `market-*` palette | **Pass** on in-scope listing components |
| Featured products via `/api/featured-products` | **Pass** (code) — `ShopProducts.tsx` → `getFeaturedProducts()` → `lib/api/featured-products.ts` |
| `/api/products/featured` not used | **Pass** (grep — no references in app code) |
| No fake stats/ratings/reviews | **Pass** — ratings only when API provides data |
| Cart icon/link works | **Pass** — `/cart` link present with badge |
| Login/account links work | **Pass** — links to `/login?type=customer` and `/login?type=vendor` |
| Vendor CTA routes correctly | **Pass** — `/become-a-vendor` links verified |
| Search/filter behavior unchanged | **Pass** (code — no handler/logic changes in PR) |
| No horizontal scroll on mobile | **Pass** (local 390px viewport audit) |
| No hydration errors on homepage | **Pass** — no hydration errors observed; fetch errors only from missing backend |
| Missing images/content do not break layout | **Pass** — error/empty states use market dusk panels |
| Footer links usable | **Pass** |

---

## Bugs found

| ID | Severity | Route | Description |
|----|----------|-------|-------------|
| QA-1 | Low | `/services` | `ServicePageFallback` Suspense fallback used `bg-white text-black` — brief white flash while loading |
| QA-2 | Info | Preview QA | Vercel preview SSO blocks headless/automated access |
| QA-3 | Info | Local QA | Backend not running — cannot confirm live featured products / listings on localhost |
| QA-4 | Deferred | `/vendors` | `CustomSelect` dropdown panel still `bg-white` (pre-existing, documented gap) |

---

## Bugs fixed

| ID | Fix | Commit |
|----|-----|--------|
| QA-1 | Removed `bg-white text-black` from `ServicePageFallback` in `services/page.tsx` | `6fc1360a` |

---

## Screenshots

Automated screenshot capture to `docs/qa-screenshots/` was attempted but Playwright MCP wrote outside the workspace in some runs. **Manual capture recommended on Vercel preview:**

- [ ] Homepage desktop
- [ ] Homepage mobile
- [ ] Products desktop
- [ ] Foods desktop
- [ ] Services desktop
- [ ] Vendors desktop
- [ ] One mobile listing route (e.g. `/products` at 390px)

Local partial capture: homepage desktop structure verified via Playwright snapshot (dusk hero, announcement bar, featured products error state with market styling when API unavailable).

---

## Build result

| When | Result |
|------|--------|
| Pre-PR push | Passed |
| Post QA-1 fix | Passed (`npm run build`) |

---

## Remaining deferred gaps (not in this PR)

1. Product / food / vendor detail pages — legacy light UI
2. Legal / FAQ pages
3. `CustomSelect` white dropdown on `/vendors`
4. Duplicated listing components (`BookYourServices`, `FilterAccordion`, `ProductCard`)
5. Partner onboarding / dashboards / auth / checkout styling (reverted from branch)
6. `services/components/CategoryGrid.tsx` — white carousel controls (unused on main services page path; low priority)

---

## Final recommendation

**Ready to review** — with one minor fix (QA-1) pushed.

**Before merge into `sprint/frontend-release-candidate`:**
1. Human spot-check on Vercel preview (SSO access) for `/`, `/products`, `/foods`, `/services`, `/vendors`, `/about`
2. Confirm featured products load with live backend on preview
3. Merge PR #30 only (not `main`, not production)
4. Smoke test release-candidate preview after merge

**Production was not deployed.**

---

## Post-merge sign-off (PR #30 merged)

**Merge commit:** `3b168f397510b7861784906335ef2ac30ca29628` (2026-06-17T21:56:22Z)  
**Target branch:** `sprint/frontend-release-candidate`  
**Post-merge preview URL:** https://mosaic-biz-frontend-launch-n9lklmen7-digital-builders.vercel.app  
**Sign-off date:** 2026-06-17  
**Production deployed:** No

### Preview access

| Check | Result |
|-------|--------|
| Post-merge deployment resolved (GitHub deployment `5101311004`) | **Pass** |
| Automated browser access to Vercel preview | **Blocked** — HTTP 401; redirects to Vercel SSO login (same as QA-2) |
| Stale feature-branch preview | Not used for sign-off |

### Primary gate: `/products` API wiring

| Check | Result | Evidence |
|-------|--------|----------|
| Frontend calls canonical products list endpoint | **Pass** | Production build (`NEXT_PUBLIC_API_BASE_URL=https://api.mosaicbizhub.com`) issues `GET https://api.mosaicbizhub.com/api/products/list?search=&city=&minorityType=&page=1&limit=10` on `/products` load (Playwright network log) |
| Backend returns 200 with live product data | **Pass** | Direct API: `total=1`, first title **`TEST PRODUCT 17 jun`** |
| `/api/products/featured` not used | **Pass** | Unchanged from pre-merge grep |
| **`TEST PRODUCT 17 jun` visible in preview UI** | **Pending human** | Blocked by Vercel SSO; backend data confirmed; wiring confirmed in build |

**Network evidence (automated, production build on localhost:3005):**

```text
GET https://api.mosaicbizhub.com/api/products/list?search=&city=&minorityType=&page=1&limit=10
```

**Backend evidence (direct API, no browser):**

```text
GET https://api.mosaicbizhub.com/api/products/list?page=1&limit=10&search= → 200
total=1, title=TEST PRODUCT 17 jun
```

Note: Local production-build smoke against `api.mosaicbizhub.com` from `localhost:3005` shows CORS-blocked responses in the browser (expected for non-allowlisted origins). Vercel preview origins are the authoritative UI test surface.

### Homepage featured products

| Check | Result | Evidence |
|-------|--------|----------|
| Frontend calls canonical featured endpoint | **Pass** | `GET https://api.mosaicbizhub.com/api/featured-products?page=1&limit=12` on `/` load |
| Backend response | **200, empty array** | `pagination.totalProducts=0` — **backend/data issue, not a redesign or env blocker** |
| Homepage handles empty featured state | **Pass** (local build) | Styled error/empty panel with Retry; no crash or hydration error |

### Secondary visual smoke (local production build)

| Route | Result |
|-------|--------|
| `/` | Pass — dusk hero, announcement bar, trust bar, featured section empty/error state styled |
| `/products` | Pass — dark marketplace shell, filters, hero; listing empty only due to local CORS |

### Recommendation

**Conditional pass for release-candidate promotion** at the code + API-contract level.

Remaining **2-minute human step** (Vercel SSO required):

1. Open https://mosaic-biz-frontend-launch-n9lklmen7-digital-builders.vercel.app/products
2. Hard refresh (Ctrl+Shift+R)
3. Confirm Network → `api.mosaicbizhub.com/api/products/list` → **200**
4. Confirm **`TEST PRODUCT 17 jun`** appears in the product grid

Do **not** block promotion on empty homepage featured products until backend flags featured inventory via `/api/featured-products`.

**Production was not deployed.**

---

## Visual polish pass — Batch 1 readability (`polish/public-readability-marketplace-forms`)

**Branch:** `polish/public-readability-marketplace-forms`  
**Date:** 2026-06-18  
**Issues:** #41 readability, #42 cards/grids, #44 forms/filters  
**Scope:** Visual-only on public marketplace routes — no API, auth, checkout, Stripe, middleware, or dashboard changes

### Changes

| Area | Update |
|------|--------|
| `app/globals.css` | Stronger `market-card` borders; `market-select`/`market-label`/`market-card-*` utilities; button/filter focus rings |
| Shared filters | `PublicSearchFilterBar` — `market-label`, `market-select-wrap`, muted chevrons |
| Listing cards | Products, services, foods, vendors, homepage featured — shared title/price/placeholder/footer hierarchy |
| `/vendors` | `CustomSelect` dusk dropdown; vendor cards with logo placeholder; `SimilarProduct` strip migrated to `market-*` |
| Empty states | Clear titles + helper copy on products/services/foods listings |

### Guardrails verified

| Check | Result |
|-------|--------|
| `/api/featured-products` canonical | Pass — unchanged (`ShopProducts` → `getFeaturedProducts`) |
| `/api/products/featured` used | Pass — not referenced in app code |
| API / auth / checkout / Stripe / middleware logic | Pass — no changes |
| `npm run build` | Run at commit time |

### Manual visual QA checklist

- [ ] Desktop `/` — hero, search card, featured products carousel, category sections readable
- [ ] Desktop `/products` — filter sidebar, product grid cards, sort control, carousel chevrons
- [ ] Desktop `/foods` — food category tiles, listing cards, sort control
- [ ] Desktop `/services` — service cards, filters, sort control
- [ ] Desktop `/vendors` — `CustomSelect` dropdown, vendor grid, similar-products strip
- [ ] Mobile (~390px) — all five routes: no horizontal scroll; filters usable; card text readable
- [ ] Keyboard — Tab through search filters, sort selects, carousel buttons, category pills; visible focus rings
- [ ] Network — `/products` still calls `api.mosaicbizhub.com/api/products/list`; `/` still calls `/api/featured-products`
