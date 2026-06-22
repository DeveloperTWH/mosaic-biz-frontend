# Visual Pass 4 — Marketplace Uniformity & Readability

**Issues:** [#83](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/83) vendor profiles · [#118](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/118) checkout trust (partial) · [#84](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/84) (deferred demo content)  
**Branch:** `polish/visual-pass-4-marketplace-uniformity`  
**Last updated:** 2026-06-22

---

## Goal

Deliver a uniform, professional look across public marketplace surfaces — especially vendor storefronts, cart/checkout, and legacy homepage/foods sections — using shared design tokens instead of one-off hex and gray utility classes.

---

## Shared utilities added (`app/globals.css`)

| Family | Classes |
|--------|---------|
| Commerce | `.commerce-shell`, `.commerce-panel`, `.commerce-panel-muted`, `.commerce-tab-active`, `.commerce-trust-note` |
| Vendor profile | `.vendor-profile-hero-band`, `.vendor-profile-detail-card`, `.vendor-profile-product-card`, `.vendor-profile-booking-panel`, etc. |

Documented in [STYLE_GUIDE.md](STYLE_GUIDE.md).

---

## Surfaces updated

| Area | Files | Changes |
|------|-------|---------|
| Product vendor storefront (#83) | `vendor-profile/product-vendor/[businessId]/page.tsx` | Hero band, detail card, product grid cards, readable labels, brand tokens |
| Service + food vendor profiles | `vendor-profile/service-vendor/`, `food-vendor/` | Bulk hex → `brand-*` / `surface-*`; 10–11px labels → `text-xs` |
| Cart + checkout (#118 partial) | `cart/page.tsx`, `checkout/buy-now/page.tsx`, `checkout/address/ClientForm.tsx`, `checkout/page.tsx`, `checkout/payment/page.tsx`, `payment-success/page.tsx` | Commerce shell, trust notes, navy CTAs, fulfillment disclaimer on success |
| Homepage legacy | `WhyChooseUs.tsx`, `FeatureBlogs.tsx` | Light-surface cards, brand typography, removed inline hex/Roboto Slab |
| Foods listing cards | `RestaurantCard.tsx`, `ShopProductCard.tsx`, `TabsHeadingSection.tsx` | `market-listing-card` + `market-*` tokens |

---

## Guardrails

- No API, Stripe, auth, or route changes
- No fake vendor/review/inventory data
- Build gate: `npm run build`

---

## Placeholder inventory (#84) — 2026-06-22

| Route / surface | Status | Notes |
|-----------------|--------|-------|
| `/vendors` Similar Products stub | **Removed** | Fake carousel deleted; vendors page ends at grid |
| `products/[productid]/[id]/SimilarProduct.tsx` | **Deleted** | Hardcoded "Feature Product" stub removed |
| `/vendors/[vendor_id]` TopSellingProduct | **Replaced** | Honest empty state → `/vendors` |
| `/foods/resturant/[id]` | **Replaced** | Lorem mock removed; honest empty state → `/foods` |
| Homepage VendorSpotlight / VendorStories | Backend-dependent | `MarketEmptyState` + honest copy (keep) |
| `FeatureBlogs` | Static preview | "Stories coming soon" — no fake articles |
| `ClientTestimonials` | Curated copy | Placeholder names until CMS/API |
| `/products/[productid]/[id]` mock catalog | **Redirect** | Sends to canonical `/product/[id]` |
| Partner onboarding modals | **Open** | Gray/blue legacy — dashboard scope |

---

## Deferred (next pass)

| Item | Issue |
|------|-------|
| Legacy `/vendors/[vendor_id]` mock data | #84 |
| Full restaurant detail page (`foods/resturant/[id]`) | Follow-up |
| Admin surface token audit | #110 |
| Automated screenshot regression | #115 |

---

## Commands

```powershell
npm run build
```

Build: **Pass** on branch tip.
