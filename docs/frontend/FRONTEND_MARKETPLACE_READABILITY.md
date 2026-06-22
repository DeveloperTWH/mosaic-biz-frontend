# Frontend Marketplace Readability Pass (#155)

**Branch:** `fix/frontend-marketplace-readability-launch`  
**Issues:** #155 · parent #153 · epic #162  
**Scope:** Visual/contrast corrections only — no API, cart math, checkout, or payment behavior changes.

---

## Audit summary

| Route / area | Components | Issues found | Fix approach |
|--------------|------------|--------------|--------------|
| Homepage featured products | `ShopProducts.tsx`, market card classes | Error copy used low-contrast teal; card metadata relied on muted purple | Brighter `market-muted`, card desc/meta tokens, readable error text |
| Products listing | `ProductsClient.tsx`, `ProductServices.tsx`, filters | Filter chips OK on dark panel; result count faint | Global `market-result-count`, filter selected ring |
| Services / food listing | `services/components/ProductCard.tsx`, foods cards | Already on market cards | Inherited token improvements |
| Search | `search/page.tsx`, tabs | Error state low contrast on dark bg | `market-state-error` |
| Product detail | `product/[id]/page.tsx`, `SimilarProduct.tsx` | `text-gray-400/500` on white cards; weak variant selected/disabled states | `commerce-*` utilities + brand tokens |
| Vendor profiles | `vendor-profile/*` | Breadcrumb `text-gray-300` on hero | `text-white/85` |
| Cart | `cart/page.tsx`, `AddressComponent.tsx` | Shipping chips, qty controls, address modal grays | `commerce-chip*`, brand tokens |
| Payment result | `payment-success/page.tsx` | Body copy `text-gray-600` | `text-brand-muted`, navy CTAs |
| Shared states | `MarketLoadingBlock`, `MarketEmptyState`, `CardRatingRow` | Loading/empty meta too faint | Brighter secondary text |

**Preserved:** `GET /api/featured-products`, all checkout/payment logic, Stripe internals.

---

## Token / class changes

### Dark marketplace surfaces (`app/globals.css`)

- `--market-muted`: `#A9A2D8` → `#BDB5E8`
- `.market-card-desc`, `.market-card-rating-meta`, `.market-result-count`: higher contrast secondary text
- `.market-empty-state-desc`, `.market-state-error`: shared empty/error readability
- Filter `.filter-item-selected`: inset gold ring for visible selection
- Disabled market buttons: `opacity-60` + subtle ring (clearer than flat 50% fade)

### Light commerce surfaces (product detail, cart, receipt)

- `.commerce-text-body`, `.commerce-text-meta`, `.commerce-text-label`
- `.commerce-price-primary`, `.commerce-price-compare`
- `.commerce-option`, `.commerce-option-selected`, `.commerce-option-disabled`
- `.commerce-chip`, `.commerce-chip-selected`
- `.commerce-state-loading`

---

## Screenshots (evidence paths)

Capture after `npm run dev` (desktop ≥1280px and mobile 390px):

| Screen | Path | File |
|--------|------|------|
| Marketplace listing | `/products` | `docs/frontend/evidence/readability/products-desktop.png` |
| Marketplace listing (mobile) | `/products` | `docs/frontend/evidence/readability/products-mobile.png` |
| Product detail | `/product/{id}` | `docs/frontend/evidence/readability/detail-desktop.png` |
| Cart review | `/cart` | `docs/frontend/evidence/readability/cart-desktop.png` |
| Checkout-adjacent receipt | `/payment-success?...` (mock/staging) | `docs/frontend/evidence/readability/payment-result-desktop.png` |

> Use live product IDs from staging when capturing detail/cart flows.

---

## Verification

```bash
npm run build
npm run lint
```

E2E browse/cart: run Playwright subset from `#163` branch when merged (`test/frontend-critical-journey-playwright`).

---

## Manual smoke (browse → detail → cart)

1. `/products` — card titles, prices, filters readable on mobile + desktop
2. Open product detail — seller, price hierarchy, variant selection states visible
3. Add to cart (if authenticated) — cart line items, shipping chips, price summary readable
4. `/payment-success` failure/loading copy readable without zoom

---

## Risks

- Light-surface pages outside marketplace scope still use legacy gray utilities
- MUI filter slider labels inherit filter-panel CSS; verify on Windows high-contrast mode separately
- Vendor profile booking forms retain compact 11px fields (readability improved where touched, not fully redesigned)

## Rollback

Revert branch. CSS/token-only changes; no backend or purchase logic impact.

## Not tested

- Live Stripe redirect success path with real `payment_intent`
- Authenticated add-to-cart against production API
- Playwright E2E (not on `main` yet)
- Windows high-contrast / forced-colors modes
