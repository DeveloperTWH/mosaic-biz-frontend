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
| `npm run build` | Pass (pre-merge + QA re-run 2026-06-18) |

### Manual visual QA checklist

- [x] Desktop `/` — hero, search card, featured products carousel, category sections readable (local prod build)
- [x] Desktop `/products` — filter sidebar, sort control, accordion filters present (local prod build; live data blocked by CORS on localhost)
- [x] Desktop `/foods` — filters, sort control, listing shell (local prod build)
- [x] Desktop `/services` — filters, sort control, listing shell (local prod build)
- [x] Desktop `/vendors` — `CustomSelect` dusk dropdown opens; `SimilarProduct` uses `market-*` (local prod build)
- [x] Mobile (~390px) — `/`, `/products`, `/foods`, `/services`, `/vendors`: no horizontal scroll (automated check)
- [x] Keyboard — `CustomSelect` and search inputs show focus/expanded states (spot check)
- [x] Network — client wiring unchanged: `ProductsClient` → `/api/products/list`; `ShopProducts` → `/api/featured-products`; backend direct API **200** for both

---

## Preview QA follow-up — Batch 1 (PR #48, pre-merge)

**PR:** https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/48  
**Branch:** `polish/public-readability-marketplace-forms`  
**Commit:** `616b2b799c86e8e8903df1f8044611fe659f6c27`  
**QA date:** 2026-06-18  
**Vercel deployment:** Ready (commit status success)

### Preview URL

| Surface | URL | Access |
|---------|-----|--------|
| **Vercel preview (authoritative)** | https://mosaic-biz-frontend-launch-git-polish-p-138a0f-digital-builders.vercel.app | **Blocked** — redirects to Vercel SSO login (HTTP 401 / login page) |
| Vercel inspector | https://vercel.com/digital-builders/mosaic-biz-frontend-launch/DJBR5H4jpVnxgVmWT4Jsnq1GgUBD | Team access only |
| Local production build (QA fallback) | http://localhost:3010 | Used for automated + manual route checks |

### Build

| Command | Result |
|---------|--------|
| `npm run build` | **Pass** (re-run during QA follow-up) |

### Route results (local prod @ `616b2b79`, mobile 390px unless noted)

| Route | Visual readability | Cards/surfaces | Filters/dropdowns | Mobile scroll | Notes |
|-------|-------------------|----------------|-------------------|---------------|-------|
| `/` | Pass | Pass — search card `border-white/15`, dusk sections | Pass — `market-label`, state/minority selects | Pass (390px) | Featured section loads; API empty/CORS expected on localhost |
| `/products` | Pass | Pass — filter panel + sort `market-select` | Pass — accordion + comboboxes | Pass (390px) | Minor desktop-only ~15px horizontal overflow (carousel offsets) — **deferred** |
| `/foods` | Pass | Pass — listing shell + sort control | Pass | Pass (390px) | Empty listing state styled |
| `/services` | Pass | Pass — listing shell + sort control | Pass | Pass (390px) | Empty listing state styled |
| `/vendors` | Pass | Pass — `SimilarProduct` dusk cards | Pass — `CustomSelect` listbox `rgb(33,23,71)` (`market-elevated`) | Pass (390px) | Dropdown options: Fashion, Electronics, Beauty, Home, Footwear |

### API / guardrails

| Check | Result | Evidence |
|-------|--------|----------|
| `/api/products/list` wiring | Pass | `ProductsClient.tsx` unchanged endpoint |
| `/api/featured-products` canonical | Pass | `ShopProducts.tsx` → `getFeaturedProducts()` |
| `/api/products/featured` | Pass | Not referenced in app code |
| Backend direct API | Pass | `GET /api/products/list` → **200**; `GET /api/featured-products` → **200** |
| Auth / checkout / Stripe / middleware | Pass | No files touched in those areas |
| Visual bugs requiring fix | **None** | No code changes in this QA pass |

### QA status

**Conditional pass — ready for merge** after optional human Vercel SSO spot-check on preview URL (confirm live product grid + featured section with production API origin).

**Production was not manually deployed.**

### Remaining visual gaps (deferred)

1. Product / service / vendor **detail** pages — legacy light UI (Phase 2)
2. Native `<select>` OS option menus — cannot fully theme (closed state uses `market-select`)
3. Desktop `/products` ~15px horizontal overflow from carousel nav offsets (low priority)
4. Legal / FAQ pages — legacy styling
5. Duplicated listing components (`FilterAccordion`, `BookYourServices`, `ProductCard` copies)
6. Human preview sign-off on Vercel SSO — pending ~2 min with team credentials
