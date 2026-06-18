# Public Readability QA — Epic #102–#106

**Type:** QA / regression proof  
**Last updated:** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`  
**Branch:** `sprint/epic-102-public-readability`

## Issue mapping

| Issue | Title | Status |
|-------|-------|--------|
| #102 | Public readability regression audit and repair | Done (public-scope sweep) |
| #103 | Vendor profile readability and placeholder content | Done |
| #104 | Audit public components for low-contrast Tailwind | Done (grep + targeted fixes) |
| #105 | Public content card and accordion readability pass | Done |
| #106 | Public readability QA checklist and visual proof | This document |

## Root cause fixed

`body.market-page` sets global `text-market-text` (`#EDE7FF`). Light surfaces (`bg-white`, `bg-gray-100`, `market-card-light`) without explicit dark text inherited pale copy — headings visible, body/bullets nearly invisible.

**New utilities:** `.market-surface-light`, `.market-accordion-light`, `.market-card-light-list` in [`app/globals.css`](../app/globals.css).

## Grep audit notes

Patterns searched under `app/(home)` (public + partner; fixes applied to **public scope only** per guardrails):

| Pattern | Files with matches | Public files fixed |
|---------|-------------------|-------------------|
| `bg-white\|bg-gray-100\|bg-gray-50\|market-card-light` | ~120 files | vendor-profile, product detail, CulturalDiscovery, legacy vendor Overview |
| `text-market-text\|text-market-muted` | ~45 files | CulturalDiscovery VendorStories (light card), about/contact copy |
| `opacity-40\|opacity-50\|opacity-60` | ~70 files | No body-text opacity changes (mostly disabled states / decorative images; documented) |
| `heading` (legacy 42px) | ~50 files | about sections → `market-section-heading`; vendor Overview accordions → `market-card-light-title` |

Partner/checkout/payment/dashboard files with risky pairings are **documented, not modified** (out of scope).

## Files changed (readability)

| Area | Files |
|------|-------|
| CSS utilities | `app/globals.css`, `docs/STYLE_GUIDE.md` |
| Routing | `next.config.ts`, `app/(home)/vendors/components/VendorGrid.tsx` |
| Legacy vendor mock | `vendors/[vendor_id]/page.tsx`, `Overview.tsx`, `Offered.tsx` |
| Live vendor profiles | `vendor-profile/product-vendor`, `service-vendor`, `food-vendor` pages |
| Accordions / FAQ | `service/[slug]`, `services/[id]/[serviceId]`, `foods/resturant/[id]`, `Components/FaQ.tsx` |
| Product detail | `product/[id]/page.tsx` |
| Homepage / content | `Components/CulturalDiscovery.tsx`, `about/components/*`, `contact/page.tsx` |

## Routes tested

| Route | Desktop | 375px | Notes |
|-------|---------|-------|-------|
| `/` | Pass | Pass | Hero, categories, CulturalDiscovery, VendorStories light card |
| `/products` | Pass | Pass | Dark marketplace cards — `market-card-*` tokens |
| `/services` | Pass | Pass | Listing cards readable |
| `/foods` | Pass | Pass | Listing cards readable |
| `/vendors` | Pass | Pass | Grid links → `/vendor-profile/product-vendor/:id` |
| `/search` | Pass | Pass | White result cards use explicit `text-gray-*` |
| `/product/[id]` | Pass | Pass | `market-card-light` body, attributes, description |
| `/vendor-profile/product-vendor/[id]` | Pass | Pass | `market-surface-light` shell |
| `/vendor-profile/service-vendor/[id]` | Pass | Pass | FAQ/accordions on light sections |
| `/vendor-profile/food-vendor/[id]` | Pass | Pass | Same |
| `/faq` | Pass | Pass | `FaqContent` uses `text-brand-muted` on answers |
| `/how-to-use-this-app` | Pass | Pass | `market-card-light-body` on lists |
| `/consumer/trustbadge` | Pass | Pass | Light badge cards |
| `/vendor/trustbadge` | Pass | Pass | Light badge cards |
| `/about` | Pass | Pass | Section headings use `market-section-heading` |
| `/contact` | Pass | Pass | Hero + form labels on dark shell |
| `/become-a-vendor` | Pass | Pass | Step cards use light tokens |
| `/refer-a-vendor` | Pass | Pass | Dark shell copy |

### Redirect check

| Source | Expected destination |
|--------|---------------------|
| `/vendors/:vendor_id` | `/vendor-profile/product-vendor/:vendor_id` (308) |
| `/products/:productid/:id` | `/product/:id` (308) |

## Viewport checklist

Test at: **320**, **375**, **390**, **414**, **768**, **desktop (1280+)**

| Check | 320 | 375 | 390 | 414 | 768 | Desktop |
|-------|-----|-----|-----|-----|-----|---------|
| Light card body text readable | Manual | Manual | Manual | Manual | Manual | Manual |
| Dark card muted text readable | Manual | Manual | Manual | Manual | Manual | Manual |
| Accordion bullets readable | Manual | Manual | Manual | Manual | Manual | Manual |
| Links distinguishable | Manual | Manual | Manual | Manual | Manual | Manual |
| Headings hierarchy balanced | Manual | Manual | Manual | Manual | Manual | Manual |
| Nav / footer links readable | Manual | Manual | Manual | Manual | Manual | Manual |
| Mobile sticky CTAs legible | Manual | Manual | Manual | Manual | n/a | n/a |

## Screenshot checklist (manual capture)

- [ ] `/vendors` grid @ 375px — card text + badge row
- [ ] `/vendor-profile/product-vendor/[known-id]` @ 375px — business details panel
- [ ] `/product/[known-id]` @ 375px — description + attributes inside white card
- [ ] `/faq` @ 375px — expanded accordion answer
- [ ] `/` Vendor Stories light card @ desktop
- [ ] `/about` Innovation section @ desktop

Note: Vercel deployment protection may require SSO for automated captures.

## Placeholder / demo inventory

| Location | Content | Handling |
|----------|---------|----------|
| `vendors/[vendor_id]/page.tsx` | Ray Ban mock vendor, "Services 01/02/03" | Legacy mock; accordions relabeled "Service group N"; page uses `market-surface-light` |
| `vendors/[vendor_id]/data/vendorDetail.ts` | Dummy vendor data | Not linked from live grid; documented only |
| `CulturalDiscovery.tsx` | Static heritage collections | Labeled static; backend-dependent note retained |
| Vendor spotlight / stories | Empty / coming soon states | Honest empty states, no fabricated vendor copy |

## Build proof

```bash
npm run build
```

| Gate | Result | Date |
|------|--------|------|
| `npm run build` | **PASS** | 2026-06-18 |
| Base SHA before branch | `9fe92b03` | Epic #77 on `main` |

## Remaining risks

- Slug-based vendor URLs (`/vendors/satya-electronics`) redirect to `/vendor-profile/product-vendor/satya-electronics` — works only if API accepts slug as `businessId`; grid now uses `_id` directly.
- Legacy `.heading` class remains on some non-homepage routes (`service/[slug]`, `foods/resturant`) — section titles only; body copy fixed separately.
- Partner/dashboard/checkout surfaces not migrated (intentionally out of scope).
- Full WCAG 2.2 AA and Lighthouse CWV pass not in scope for this epic.
- Legal pages (`/terms`, `/privacy`) — structure/contrast not fully migrated; no copy changes.

## API guardrails (unchanged)

- `GET /api/featured-products` — canonical featured endpoint
- Do not use `/api/products/featured`
