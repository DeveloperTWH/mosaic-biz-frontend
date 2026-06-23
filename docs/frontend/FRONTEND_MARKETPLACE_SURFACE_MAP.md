# Frontend Marketplace Surface Map — As Built

**Type:** Reference (launch evidence pack)  
**Last updated:** 2026-06-23  
**Evidence source:** Page components under `app/(home)/`, `lib/api/*`, grep for API paths

Consumer-facing surfaces: browse, search, filter, detail, vendor profile, cart, checkout, payment success.

**Platform behavior:** [../PLATFORM_OPERATING_MODEL.md](../PLATFORM_OPERATING_MODEL.md)  
**Vendor eligibility:** [../MARKETPLACE_VENDOR_ELIGIBILITY.md](../MARKETPLACE_VENDOR_ELIGIBILITY.md)

---

## Homepage `/`

| Aspect | As built |
|--------|----------|
| **Renders** | Hero, category browse, featured/ranked products, vendor CTAs |
| **APIs** | `GET /api/featured-products` via `ShopProducts.tsx` → `lib/api/featured-products.ts`; `GET /api/ranked` (or `NEXT_PUBLIC_RANKED_PATH`) |
| **Note** | `Components/FeaturedProducts.tsx` exists but is **not imported** by the homepage — use `ShopProducts.tsx` as the live consumer |
| **Credentials** | Featured: `withCredentials`; ranked: Evidence Needed |
| **Empty state** | Featured empty array documented as OK in smoke checklist (backend must flag products) |
| **Error state** | Evidence Needed per component |

---

## Product catalog `/products`

| Aspect | As built |
|--------|----------|
| **Renders** | Filter bar, product grid, category navigation |
| **APIs** | `GET /api/products/list` (primary RC QA gate); `GET /api/categories/products`; `GET /api/minority-types`; optional ranked path |
| **File** | `app/(home)/products/ProductsClient.tsx` |
| **Credentials** | axios/fetch mix — Evidence Needed per call |
| **Empty/error** | Evidence Needed |

---

## Services `/services`, `/services/[id]`

| Aspect | As built |
|--------|----------|
| **Renders** | Service listings with filters and map |
| **APIs** | `GET /api/services/list`; `GET /api/categories/services`; `GET /api/services/subcategories/:id`; `GET /api/minority-types` |
| **Files** | `services/page.tsx`, `services/[id]/page.tsx` |
| **Empty/error** | Evidence Needed |

---

## Food `/foods`

| Aspect | As built |
|--------|----------|
| **Renders** | Food/restaurant browse with filters |
| **APIs** | `GET /api/food/list`; `GET /api/categories/foods`; `GET /api/foods/subcategories/:id` |
| **File** | `app/(home)/foods/page.tsx` |
| **Empty/error** | Evidence Needed |

---

## Search `/search`

| Aspect | As built |
|--------|----------|
| **Renders** | Unified public search results |
| **APIs** | `GET /api/public/search?...` |
| **File** | `app/(home)/search/page.tsx` |
| **Empty/error** | Evidence Needed |

---

## Vendor directory `/vendors`

| Aspect | As built |
|--------|----------|
| **Renders** | Vendor grid with filters |
| **APIs** | `GET /api/business?...` |
| **File** | `app/(home)/vendors/components/VendorGrid.tsx` |
| **Eligibility** | Backend should return only `isApproved && isActive` businesses; UI explains public listing rules |
| **Redirect** | `/vendors/:id` → `/vendor-profile/product-vendor/:id` |

---

## Detail pages

### Product `/product/[id]` (canonical)

| Aspect | As built |
|--------|----------|
| **Renders** | Product detail, variants, add-to-cart, similar products |
| **APIs** | `GET /api/product/:id`; similar: `/api/:productId/similar`; cart add via `utils/cartUtils.ts` |
| **Eligibility** | `MarketplaceEligibilityBanner`; blocks add-to-cart when vendor not `isApproved && isActive` (`lib/marketplace/businessEligibility.ts`) |
| **File** | `app/(home)/product/[id]/page.tsx` |
| **Legacy** | `/products/[productid]/[id]` redirects here |

### Service `/service/[slug]` (detail by slug)

| Aspect | As built |
|--------|----------|
| **Renders** | Service detail + booking form |
| **APIs** | `GET /api/services/:slug`; `POST /api/bookings/create` |
| **File** | `app/(home)/service/[slug]/page.tsx` |
| **Public commerce URL** | Search and inventory links use `/vendor-profile/service-vendor/[serviceId]` (`lib/api/services.ts` `getPublicServiceUrl`) |

### Vendor profiles `/vendor-profile/*`

| Type | URL | Key APIs |
|------|-----|----------|
| Product vendor | `/vendor-profile/product-vendor/[businessId]` | Public product/business APIs — Evidence Needed |
| Service vendor | `/vendor-profile/service-vendor/[serviceId]` | Public service APIs — Evidence Needed |
| Food vendor | `/vendor-profile/food-vendor/[foodId]` | `GET /api/public/foods/:id`, reviews, enquiries |

---

## Featured products (canonical verification)

| Rule | Evidence |
|------|----------|
| Use `GET /api/featured-products` only | `lib/api/featured-products.ts` |
| Do **not** use `/api/products/featured` | 0 matches in app `*.{ts,tsx}` |
| Live homepage consumer | `ShopProducts.tsx` (imports `getFeaturedProducts`) |

Admin featured **toggle** uses legacy `PATCH /admin/api/products/:id/featured` — separate from public featured fetch.

---

## Cart `/cart`

| Aspect | As built |
|--------|----------|
| **Renders** | Line items, quantity, address, guest merge prompt |
| **APIs** | `GET /api/cart`; `POST /api/cart/add`; update/remove endpoints in `utils/cartUtils.ts`; `GET /api/cart/count`; `POST /api/cart/merge` |
| **Eligibility** | Preflight via `resolveCartVendorEligibility`; disables Place order when blocked; logs `marketplace:checkout-eligibility-failed` |
| **Constraint** | Single-vendor cart — switching vendors resets cart (backend rejects multi-vendor checkout) |
| **Guest** | localStorage via `utils/guestCart.ts` |
| **Credentials** | include on authenticated cart ops |

---

## Checkout entry

| URL | Purpose | Key APIs / env |
|-----|---------|----------------|
| `/checkout` | Main checkout | Stripe Elements; return_url → `NEXT_PUBLIC_CLIENT_BASE_URL` + `/payment-success` |
| `/checkout/address` | Shipping address | Address APIs in `ClientForm.tsx` — Evidence Needed |
| `/checkout/payment` | Payment step | Stripe confirm; same return URL env |
| `/checkout/buy-now` | Direct purchase | `GET /api/public/product/:id`; `POST /api/orders/initiate` |
| `/payment-success` | Confirmation | `GET /api/orders/retrieve-intent/:paymentIntentId` |

Legacy alternate: `/payment`, `/payment/checkout`, `/payment/success` (onboarding submit on legacy success).

---

## Wishlist / contact (secondary marketplace)

| Surface | API |
|---------|-----|
| Wishlist toggle | `POST /api/wishlist/toggle` (`utils/wishlistUtils.ts`) |
| Wishlist list | `GET /api/wishlist` |
| Contact form | `POST /api/contact-inquiry` (`lib/api/contact.ts`) |

---

## Cross-links

- [../PLATFORM_OPERATING_MODEL.md](../PLATFORM_OPERATING_MODEL.md)
- [../MARKETPLACE_VENDOR_ELIGIBILITY.md](../MARKETPLACE_VENDOR_ELIGIBILITY.md)
- [FRONTEND_ROUTE_MAP.md](FRONTEND_ROUTE_MAP.md)
- [FRONTEND_API_USAGE_INVENTORY.md](FRONTEND_API_USAGE_INVENTORY.md)
- [FRONTEND_VISUAL_QA_SURFACE.md](FRONTEND_VISUAL_QA_SURFACE.md)
