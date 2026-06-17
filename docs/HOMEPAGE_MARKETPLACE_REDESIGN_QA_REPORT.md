# Homepage Marketplace Redesign — QA Report

**Branch:** `feat/homepage-redesign`  
**Base (PR target):** `sprint/frontend-release-candidate`  
**Report date:** 2026-06-17  
**Production deployed:** No — local verification only

---

## Build result

| Check | Result |
|-------|--------|
| `npm run build` | **Passed** (Next.js 16.1.2, Turbopack) |
| TypeScript | Passed |
| Static generation | 66 routes generated |

**Post-revert fix:** Removed stale `HeroSection` import from `app/(home)/become-a-vendor/page.tsx` after legacy hero files were deleted (build collateral, not redesign scope).

---

## Commits on branch (5)

| # | SHA | Message |
|---|-----|---------|
| 1 | `ec022827` | `style: add Mosaic marketplace theme tokens` |
| 2 | `6e93f4cf` | `feat: redesign homepage and public chrome` |
| 3 | `619bccd7` | `feat: add shared public page hero styling` |
| 4 | `915ea0e8` | `style: align public marketplace listings with dusk palette` |
| 5 | *(this commit)* | `docs: add redesign QA and scope notes` |

---

## Scope summary

| Metric | Count |
|--------|-------|
| Files reverted (out of scope) | **43** |
| Files kept in scope | **65** (across 4 feature commits) |
| Out-of-scope areas excluded | Auth, checkout, partner onboarding, partner dashboard, admin |

See [`HOMEPAGE_REDESIGN_SCOPE_AUDIT.md`](./HOMEPAGE_REDESIGN_SCOPE_AUDIT.md) for the full file-by-file breakdown.

---

## Visual QA checklist (manual — not run on Vercel preview)

### Homepage and chrome

- [ ] `/` — Hero, announcement bar, trust bar, category browse, featured products, vendor CTA
- [ ] Navbar — logo, search, cart, auth links, mobile menu
- [ ] Footer — links, social, newsletter
- [ ] Responsive — mobile / tablet / desktop breakpoints

### Public page heroes (`PublicPageHero`)

- [ ] `/about`
- [ ] `/contact`
- [ ] `/foods`
- [ ] `/products`
- [ ] `/services`
- [ ] `/services/[id]` (category listing)
- [ ] `/vendors`
- [ ] `/how-to-use-this-app`

### Marketplace listing bodies

- [ ] `/products` — filters, category strip, product cards, join-vendor banner
- [ ] `/foods` — filters, food cards, book-services section
- [ ] `/services` — filters, service cards
- [ ] `/services/[id]` — service detail cards
- [ ] `/vendors` — vendor grid
- [ ] `/about` — AboutContent secondary styling

### Regression checks

- [ ] `/api/featured-products` still loads featured products on homepage (`ShopProducts`)
- [ ] No fake ratings or stats introduced
- [ ] Auth, checkout, `/partners/*`, partner dashboard unchanged from base (reverted)
- [ ] `middleware.ts` unchanged

---

## Deferred gaps (not in this PR)

1. **Product / food / vendor detail pages** — `/products/[productid]`, `/foods/resturant/[id]`, `/vendor-profile/*` (BannerSection overlay only touched)
2. **Legal / FAQ** — `/faq`, `/privacy`, `/terms`, consumer/vendor terms
3. **Partner onboarding** — `/partners/*` styling (reverted)
4. **Partner / admin / customer dashboards** — reverted
5. **Auth & checkout token migration** — reverted
6. **`CustomSelect` white dropdown** on `/vendors` filter
7. **Component consolidation** — duplicate `BookYourServices`, `FilterAccordion`, `ProductCard` across routes
8. **`JoinVendorBanner` layout refactor**

---

## Next steps (when requested)

1. Push branch to `launch` remote (`Digital-Builders-757/mosaic-biz-frontend-launch`)
2. Open PR into `sprint/frontend-release-candidate`
3. Run visual QA on Vercel preview for routes above
4. Fix only bugs caused by this branch — no new redesign scope
