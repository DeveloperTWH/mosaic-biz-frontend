# Visual Polish QA Report

**Type:** Living QA document  
**Last updated:** 2026-06-17  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`

---

## Release batch summary

| Batch | Branch | Issues | Status |
|-------|--------|--------|--------|
| Batch 1 | `polish/public-readability-marketplace-forms` | #41, #42, #44 | Merged into combined release PR |
| Batch 2 | `polish/mobile-accessibility-visual-qa` | #45, #39, #47 | Merged into combined release PR |

**Combined PR target:** `main`

---

## Pages checked

| Page | Desktop | Mobile (375/390/414) | Tablet (768) |
|------|---------|----------------------|--------------|
| `/` | Pass | Pass | Pass |
| `/products` | Pass | Pass | Pass |
| `/foods` | Pass | Pass | Pass |
| `/services` | Pass | Pass | Pass |
| `/vendors` | Pass | Pass | Pass |
| `/about` | Pass | Pass | Pass |
| `/contact` | Pass | Pass | Pass |
| `/how-to-use-this-app` | Pass | Pass | Pass |

**Chrome:** Navbar mobile menu, footer link grouping, public filter bars, hero breadcrumbs, marketplace cards.

---

## Mobile fixes (Batch 2)

- Removed horizontal overflow: `w-screen` → `w-full overflow-x-hidden` on layout; contact image `w-[600px]` → responsive
- `PublicFilterSection` padded wrapper on `/products`, `/foods`, `/services`
- Sort rows stack on mobile (`flex-col gap-3`)
- Footer/nav tap targets (`min-h-11`), focus rings (`market-footer-link`, `market-nav-link`)
- Vendor pagination windowing (no full page button overflow)
- `CustomSelect` dusk theme + 44px tap height on `/vendors`
- Header/footer logo: natural brand colors via `BrandLogo` (removed `brightness-0 invert`)

---

## Accessibility checks

| Check | Result |
|-------|--------|
| Visible focus states on nav, footer, pills, buttons | Pass |
| Hamburger `aria-label` / `aria-expanded` | Pass |
| Announcement dismiss 44px target | Pass |
| Hero breadcrumb keyboard focus | Pass |
| Form inputs min-height on `/contact` | Pass |
| Social link `aria-label`s on `/contact` | Pass |
| Accordion focus-visible | Pass |

---

## Desktop checks

| Check | Result |
|-------|--------|
| Marketplace card borders/readability | Pass (Batch 1) |
| Filter/search spacing | Pass |
| Hero text contrast | Pass |
| Logo renders in natural colors | Pass |

---

## Build result

```
npm run build — PASS (2026-06-17)
```

---

## Guardrails confirmed

- No API/data logic changes
- No auth/session, middleware, checkout, cart, or Stripe changes
- `/api/featured-products` remains canonical
- Production was not manually deployed from this workstation

---

## Remaining deferred gaps

| Gap | Priority | Notes |
|-----|----------|-------|
| White-text transparent logo variant for dark header | P2 | Dark wordmark has limited contrast; colorful icon visible |
| Desktop `/products` carousel ~15px overflow | P3 | From Batch 1 QA |
| Detail pages legacy light UI | P2 | Batch 4 scope |
| Content/legal readability pass | P2 | Batch 3 scope |
| Dashboard polish | P2 | Batch 5 scope — after public pages stable |

---

## Production deployment status

| Item | Value |
|------|-------|
| Branch | `main` |
| Commit | `95369503` |
| PR | [#49](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/49) — merged 2026-06-17, **no merge conflicts** |
| Vercel production | **Ready** — https://mosaic-biz-frontend-launch.vercel.app |
| GitHub deployment SHA | `9536950` (Production) |
| API gate | `GET https://api.mosaicbizhub.com/api/products/list` → 200 |
| Featured endpoint | `/api/featured-products` (canonical) |
