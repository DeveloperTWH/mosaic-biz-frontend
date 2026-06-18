# Visual Polish QA Report

**Type:** Living QA document  
**Last updated:** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`

Full Epic #54 closeout: [EPIC_54_SPRINT_CLOSEOUT.md](EPIC_54_SPRINT_CLOSEOUT.md)

---

## Epic #54 sprint summary (2026-06-18)

| Batch | PR | Issues | Status |
|-------|-----|--------|--------|
| 1 | [#64](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/64) | #51, #55, #58, #62 | Merged |
| 2 | [#65](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/65) | #52, #53 | Merged |
| 3 | [#66](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/66) | #59, #60 | Merged |
| 4 | [#67](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/67) | #56, #57, #61 | Merged |
| 5 | [#68](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/68) | Docs closeout | Merged |

**Build:** `npm run build` PASS on all batch branches  
**Production:** Vercel auto-deploy on merge to `main`

---

## Prior release batch summary

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
| `/consumer/trustbadge` | Pass (Epic #54 B4) | Pass | Pass |
| `/how-to-use-this-app` | Pass (Epic #54 B4) | Pass | Pass |

---

## Epic #54 Batch 4 — Trust, how-to, content (#56, #57, #61)

### Changes
- Consumer/vendor trust badge pages: `PublicPageHero`, scannable badge cards, accurate disclaimers
- Removed automated score framing from vendor trust page
- How-to page: customer/vendor path cards; removed placeholder testimonials
- Softened unsupported feature promises in vendor step copy

### Legal/content items flagged
- Legal pages (`/terms`, `/privacy`, etc.) — structure-only overflow fix; **full legal copy needs approval**
- Vendor stories section — explicitly marked coming soon

### Guardrails
- No legal/policy meaning rewritten
- No API/auth/checkout changes

---

**Chrome:** Navbar mobile menu, footer link grouping, public filter bars, hero breadcrumbs, marketplace cards.

---

## Epic #54 Batch 1 — Vendor readability & CTA (#51, #55, #58, #62)

**Branch:** `polish/vendor-readability-global-cta`

### Changes

- `/become-a-vendor`: `PublicPageHero`, readable light step/resource cards, `market-btn-primary` CTA, dusk support callout
- `VendorExpandCta` shared component (replaces `w-screen` overflow band)
- `globals.css`: `.market-card-light-*`, `.market-step-badge`, disabled CTA states
- Navbar: vendor link uses `text-market-text` for contrast
- `STYLE_GUIDE.md`: light-card rules, CTA hierarchy, house patterns

### Manual QA checklist

- [ ] Step card titles readable (navy on white) at 375px
- [ ] Resource card titles readable at 375px
- [ ] Primary CTA links to `/signup?type=vendor`
- [ ] Bottom band CTA links to `/signup?type=vendor` (not self-referential)
- [ ] No horizontal overflow on `/become-a-vendor`

### Guardrails

- No API/auth/checkout/Stripe/middleware changes
- `/api/featured-products` remains canonical

---

---

## Epic #54 Batch 2 — Mobile & navigation (#52, #53)

**Branch:** `polish/mobile-nav-responsive-pass`

### Mobile widths checked

320, 360, 375, 390, 414, 430, 768, 1024 (code review + layout utilities; manual DevTools QA recommended)

### Changes

- Announcement bar: dismiss-button clearance on 320px (`px-12 pr-14`)
- Navbar: tighter mobile padding; scrollable mobile menu; Vendors + Search in SHOP; trust links in MORE
- Dropdown links: `min-h-11` tap targets + focus rings
- Removed `w-screen ml-[-50vw]` overflow bands on FAQ, how-to, trust, and legal pages
- FAQ/how-to: `VendorExpandCta` shared band

### Navigation / link matrix

| Link | Location | Expected destination | Result | Status |
|------|----------|---------------------|--------|--------|
| Home | Header / Footer logo | `/` | Route exists | Pass |
| Products | Header SHOP / Footer | `/products` | Route exists | Pass |
| Foods | Header SHOP / Footer | `/foods` | Route exists | Pass |
| Services | Header SHOP / Footer | `/services` | Route exists | Pass |
| Vendors | Header SHOP / Footer | `/vendors` | Route exists | Pass |
| Search | Header SHOP / Footer | `/search` | Route exists | Pass |
| Become a vendor | Header / Footer | `/become-a-vendor` | Route exists | Pass |
| How to use | Header / Footer | `/how-to-use-this-app` | Route exists | Pass |
| About | Header / Footer | `/about` | Route exists | Pass |
| Contact | Header / Footer | `/contact` | Route exists | Pass |
| FAQ | Header MORE / Footer | `/faq` | Route exists | Pass |
| Trust badges – consumer | Header MORE / Footer | `/consumer/trustbadge` | Route exists | Pass |
| Trust badges – vendor | Header MORE / Footer | `/vendor/trustbadge` | Route exists | Pass |
| Terms / Privacy / Refunds / Dispute | Header MORE / Footer | Legal routes | Routes exist | Pass |
| Vendor signup | Footer | `/signup?type=vendor` | Route exists | Pass |
| Customer login | Footer | `/login?type=customer` | Route exists | Pass |
| Cart | Header icon | `/cart` | Route exists | Pass |
| `/foods/shop/[id]` | Listing deep link | Shop detail | Stub/minimal | **Deferred** |
| Mock product detail `/products/[productid]/[id]` | Legacy route | Alternate detail | Coexists with `/product/[id]` | **Deferred** |

### Deferred links / pages

- `/foods/shop/[id]` — stub page; document only
- Dual detail route strategy — no reroute without approval

### Guardrails

- No protected-route or API behavior changed
- Production was not manually deployed

---

## Mobile fixes (Batch 2 — prior release)

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
| Commit | `c8ab0e31` |
| PR | [#68](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/68) — Epic #54 closeout merge (2026-06-18) |
| Vercel production | **Ready** — https://mosaic-biz-frontend-launch.vercel.app |
| GitHub deployment SHA | `9536950` (Production) |
| API gate | `GET https://api.mosaicbizhub.com/api/products/list` → 200 |
| Featured endpoint | `/api/featured-products` (canonical) |
