# Homepage Marketplace Redesign — QA Report

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
| QA-1 | Removed `bg-white text-black` from `ServicePageFallback` in `services/page.tsx` | See commit on `feat/homepage-redesign` |

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
