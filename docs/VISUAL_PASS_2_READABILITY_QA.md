# Visual Pass 2 Readability QA — Issue #74

**Epic:** [#73](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/73)  
**Issue:** [#74](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/74) — Public readability regression audit and repair  
**Branch:** `sprint/epic-73-visual-pass-2-readability`  
**Last updated:** 2026-06-17

## Root cause

`body.market-page` sets global `text-market-text` (`#EDE7FF`). Light surfaces (`bg-white`, `market-card-light`, `market-accordion-light`, cart panels) without explicit dark tokens inherit pale copy — headings may remain visible while body/bullets disappear.

## Grep audit summary (public scope)

Patterns searched under `app/(home)` excluding `partners/`, `checkout/`, `customer/`, `admin/`:

| Pattern | Approx. files | Action in #74 |
|---------|---------------|---------------|
| `text-market-text` / `text-market-muted` | ~50 | Fixed light-surface pairings; dark-shell usage left intact |
| `market-card-light` / `market-accordion-light` | Shared CSS + targeted components | Extended accordion + surface utilities |
| `Services 01/02/03` | Legacy `vendors/[vendor_id]/*` | Display relabel to `Service group N`; deferred full inventory → #84 |
| `Lorem ipsum` | foods/service mock FAQ, BookServices hero | Documented only — not rewritten in #74 |
| `opacity-40/50/60` | Decorative/disabled states | No body-text changes |

## Audit matrix

| Route / component | File | Problem | Fix | Issue |
|-------------------|------|---------|-----|-------|
| Legacy vendor “Book Your Services” | `vendors/[vendor_id]/component/Overview.tsx` | Accordion bullets could inherit pale text | CSS `li` rules + empty-state copy | #74 |
| Demo service labels | `Overview.tsx` | `Services 01/02/03` | `formatServiceTitle()` → `Service group N` | #74 |
| Cart | `cart/page.tsx`, `AddressComponent.tsx` | White cards inherited market-page text | Explicit `text-brand-navy` / `text-brand-muted` | #74 |
| Shared accordions | `globals.css` | Missing `li`/`ol` selectors | Extended `.market-accordion-light` | #74 |
| Light page shell | `globals.css` | Surface children on vendor pages | `.market-surface-light` child guard | #74 |
| Product description HTML | `product/[id]/page.tsx` | API HTML on white card | `.market-prose-light` utility | #74 |
| Homepage FAQ expand | `Components/FaQ.tsx` | Answer panel lacked light wrapper | `bg-white` + `market-card-light-body` | #74 |
| Vendor profile testimonials | `ClientTestimonials.tsx` | Section `text-white` on light page | `text-brand-navy` on section | #74 |
| Live vendor profile | `vendor-profile/product-vendor/*` | Already explicit hex/gray tokens | QA verify only | #83 if gaps found |

## Files changed

| File | Change |
|------|--------|
| `app/globals.css` | Accordion `li`/`ol`, `market-surface-light` guards, `market-prose-light` |
| `app/(home)/vendors/[vendor_id]/component/Overview.tsx` | Service title fallback, empty states |
| `app/(home)/cart/page.tsx` | Light-surface text tokens on cart UI |
| `app/(home)/cart/Component/AddressComponent.tsx` | Modal/panel readable text |
| `app/(home)/product/[id]/page.tsx` | Product description prose contrast |
| `app/(home)/Components/FaQ.tsx` | Expanded FAQ answer panel |
| `app/(home)/Components/ClientTestimonials.tsx` | Section text color on light vendor pages |

## Routes checked

| Route | Notes |
|-------|-------|
| `/` | Dark shell + homepage FAQ section |
| `/vendors/satya-electronics` | Redirects → `/vendor-profile/product-vendor/satya-electronics` |
| `/vendor-profile/product-vendor/*` | Light shell, product grid, testimonials |
| `/vendors` | Grid links to vendor profiles |
| `/products`, `/services`, `/foods` | Dark listing cards — no regression |
| `/product/[id]` | White card body + description HTML |
| `/cart` | Tabs, line items, summary on white |
| `/how-to-use-this-app`, `/faq` | Light cards / accordions |
| `/consumer/trustbadge` | Light badge cards (unchanged, verified pattern) |

## Viewports

320, 375, 390, 414, 768, 1024, desktop — manual screenshot QA recommended.

## Screenshot checklist

- [ ] Legacy vendor Overview — Book Your Services accordion open @ 375px (bullet text visible)
- [ ] `/vendor-profile/product-vendor/[id]` — business panel + product grid @ 375px
- [ ] `/cart` — Items tab + line item text @ 375px
- [ ] `/product/[id]` — description block @ desktop
- [ ] Homepage FAQ expanded answer @ 375px

## Build proof

```bash
npm run build
```

| Gate | Result | Date |
|------|--------|------|
| `npm run build` | **Pass** | 2026-06-17 |

## Guardrails confirmed

- No backend/API/auth/payment/Stripe changes
- `GET /api/featured-products` preserved
- No `/api/products/featured` created
- No legal/policy meaning rewritten
- No fake vendor/service data invented

## Remaining risks

- API-served product HTML may include inline light colors; `market-prose-light` mitigates most cases but cannot override all inline styles
- Partner/dashboard light surfaces still use `text-market-*` on dark shells — out of #74 scope
- Lorem/demo FAQ copy in legacy service/food routes remains — tracked under #84

## Intentionally deferred

| Issue | Scope |
|-------|-------|
| #75 | Header / hamburger nav (stashed local nav work) |
| #78–#79 | Detail page redesign, homepage Cultural Discovery |
| #83 | Vendor storefront hierarchy redesign |
| #84 | Full placeholder/demo content inventory |

---

## Issue #80 — About and public dark-surface readability

**Issue:** [#80](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/80)  
**Branch:** `sprint/epic-73-about-readability`  
**Last updated:** 2026-06-17

### Root cause

Dark `market-page` shell with light-surface tokens misapplied: `text-gray-700` and `.public-prose` (`text-brand-muted`) on purple backgrounds made body copy and breadcrumbs nearly invisible. About sections lacked consistent `container-page` width.

### Files changed

| File | Change |
|------|--------|
| `app/globals.css` | `.market-page-prose`, `.market-page-prose-muted`, `.public-prose` → `text-market-text/90` |
| `app/(home)/Components/PublicPageHero.tsx` | Full-bleed `min-w-full`, breadcrumb contrast |
| `app/(home)/about/components/*` | Container wrappers, dark-surface prose tokens, section dividers |
| `app/(home)/contact/page.tsx` | Dark-surface labels + intro prose |
| `app/(home)/Components/nav/MobileNavDrawer.tsx` | MORE links `text-market-text/90` |

### Routes checked

| Route | Notes |
|-------|-------|
| `/about` | Hero full width; Mission/About body readable on purple |
| `/faq`, `/privacy`, `/terms`, `/dispute`, `/refund-return` | `PublicContentLayout` inherits fixed `.public-prose` |
| `/contact` | Form labels + intro on dark shell |
| Mobile nav MORE drawer | Link contrast improved |

### Screenshot checklist (#80)

- [ ] `/about` hero @ 375px and desktop — full viewport width
- [ ] `/about` Mission + About Us body — readable without squinting
- [ ] Breadcrumbs on `/about` and `/contact`
- [ ] Mobile MORE menu links @ 375px
- [ ] Community Development gray cards — no regression (light surface)

### Build proof (#80)

| Gate | Result | Date |
|------|--------|------|
| `npm run build` | **Pass** | 2026-06-17 |
