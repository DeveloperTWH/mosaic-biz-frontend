# Frontend Route Map — As Built

**Type:** Reference (launch evidence pack)  
**Last updated:** 2026-06-19  
**Evidence source:** `app/**/page.tsx` glob (95 files), `next build` route table, `next.config.ts` redirects, `middleware.ts`

---

## Redirects (`next.config.ts`)

| Source | Destination | Permanent |
|--------|-------------|-----------|
| `/products/:productid/:id` | `/product/:id` | yes |
| `/products/:productid` | `/products` | yes |
| `/services/:id/:serviceId` | `/vendor-profile/service-vendor/:serviceId` | yes |
| `/foods/resturant/:id` | `/foods` | yes |
| `/foods/shop/:id` | `/foods` | yes |
| `/vendors/:vendor_id` | `/vendor-profile/product-vendor/:vendor_id` | yes |

---

## Canonical vs legacy detail routes

| Status | URL pattern | File | Notes |
|--------|-------------|------|-------|
| **Canonical** | `/product/[id]` | `app/(home)/product/[id]/page.tsx` | Live product detail |
| **Canonical** | `/service/[slug]` | `app/(home)/service/[slug]/page.tsx` | Live service detail |
| **Canonical** | `/vendor-profile/*` | `vendor-profile/*/page.tsx` | Vendor storefronts |
| Legacy (redirected) | `/products/[productid]/[id]` | `products/[productid]/[id]/page.tsx` | 301 → `/product/:id` |
| Legacy (redirected) | `/services/[id]/[serviceId]` | `services/[id]/[serviceId]/page.tsx` | 301 → vendor-profile |
| Category listing | `/products/[productid]` | `products/[productid]/page.tsx` | Category-scoped list |

---

## Middleware matcher

Paths: `/admin/*`, `/partners/*`, `/customer/*`, `/login`, `/signup`, `/signin`, `/verify-otp`, `/dashboard`

Most partner/customer/admin routes **pass through**; auth enforced client-side + API cookies. See [FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md).

---

## Public marketplace — `(home)`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/` | `(home)/page.tsx` | `(home)/layout` | Public | Homepage |
| `/products` | `(home)/products/page.tsx` | `(home)/layout` | Public | Primary product catalog |
| `/products/[productid]` | `(home)/products/[productid]/page.tsx` | `(home)/layout` | Public | Category listing |
| `/products/[productid]/[id]` | `(home)/products/[productid]/[id]/page.tsx` | `(home)/layout` | Public | Legacy detail (redirect) |
| `/product/[id]` | `(home)/product/[id]/page.tsx` | `(home)/layout` | Public | Canonical product detail |
| `/services` | `(home)/services/page.tsx` | `(home)/layout` | Public | Services catalog |
| `/services/[id]` | `(home)/services/[id]/page.tsx` | `(home)/layout` | Public | Service category/list |
| `/services/[id]/[serviceId]` | `(home)/services/[id]/[serviceId]/page.tsx` | `(home)/layout` | Public | Legacy (redirect) |
| `/service/[slug]` | `(home)/service/[slug]/page.tsx` | `(home)/layout` | Public | Canonical service detail |
| `/foods` | `(home)/foods/page.tsx` | `(home)/layout` | Public | Food catalog |
| `/foods/resturant/[id]` | `(home)/foods/resturant/[id]/page.tsx` | `(home)/layout` | Public | Redirect → `/foods` |
| `/foods/shop/[id]` | `(home)/foods/shop/[id]/page.tsx` | `(home)/layout` | Public | Redirect → `/foods` |
| `/vendors` | `(home)/vendors/page.tsx` | `(home)/layout` | Public | Vendor directory |
| `/vendors/[vendor_id]` | `(home)/vendors/[vendor_id]/page.tsx` | `(home)/layout` | Public | Redirect → vendor-profile |
| `/vendor-profile/product-vendor/[businessId]` | `(home)/vendor-profile/product-vendor/[businessId]/page.tsx` | `(home)/layout` | Public | Product vendor storefront |
| `/vendor-profile/service-vendor/[serviceId]` | `(home)/vendor-profile/service-vendor/[serviceId]/page.tsx` | `(home)/layout` | Public | Service vendor storefront |
| `/vendor-profile/food-vendor/[foodId]` | `(home)/vendor-profile/food-vendor/[foodId]/page.tsx` | `(home)/layout` | Public | Food vendor storefront |
| `/search` | `(home)/search/page.tsx` | `(home)/layout` | Public | Global search |
| `/about` | `(home)/about/page.tsx` | `(home)/layout` | Public | Marketing |
| `/become-a-vendor` | `(home)/become-a-vendor/page.tsx` | `(home)/layout` | Public | Vendor funnel |
| `/refer-a-vendor` | `(home)/refer-a-vendor/page.tsx` | `(home)/layout` | Public | Referral |
| `/contact` | `(home)/contact/page.tsx` | `(home)/layout` | Public | Contact form |
| `/faq` | `(home)/faq/page.tsx` | `(home)/layout` | Public | FAQ |
| `/how-to-use-this-app` | `(home)/how-to-use-this-app/page.tsx` | `(home)/layout` | Public | User guide |
| `/privacy` | `(home)/privacy/page.tsx` | `(home)/layout` | Public | Legal |
| `/terms` | `(home)/terms/page.tsx` | `(home)/layout` | Public | Legal |
| `/refund-return` | `(home)/refund-return/page.tsx` | `(home)/layout` | Public | Legal |
| `/dispute` | `(home)/dispute/page.tsx` | `(home)/layout` | Public | Legal |
| `/consumer/terms` | `(home)/consumer/terms/page.tsx` | `(home)/layout` | Public | Consumer terms |
| `/vendor/terms` | `(home)/vendor/terms/page.tsx` | `(home)/layout` | Public | Vendor terms |
| `/consumer/trustbadge` | `(home)/consumer/trustbadge/page.tsx` | `(home)/layout` | Public | Trust badge info |
| `/vendor/trustbadge` | `(home)/vendor/trustbadge/page.tsx` | `(home)/layout` | Public | Trust badge info |
| `/dashboard` | `(home)/dashboard/page.tsx` | `(home)/layout` | Middleware matched | Evidence Needed — purpose vs partner dashboard |

---

## Commerce — `(home)`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/cart` | `(home)/cart/page.tsx` | `(home)/layout` | Guest + logged-in | Cart UI |
| `/checkout` | `(home)/checkout/page.tsx` | `(home)/layout` | Evidence Needed | Stripe checkout entry |
| `/checkout/address` | `(home)/checkout/address/page.tsx` | `(home)/layout` | Evidence Needed | Address step |
| `/checkout/payment` | `(home)/checkout/payment/page.tsx` | `(home)/layout` | Evidence Needed | Payment step |
| `/checkout/buy-now` | `(home)/checkout/buy-now/page.tsx` | `(home)/layout` | Evidence Needed | Direct buy-now |
| `/payment-success` | `(home)/payment-success/page.tsx` | `(home)/layout` | Public | Post-payment confirmation |

---

## Customer account — `(home)`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/customer/order` | `(home)/customer/order/page.tsx` | `(home)/layout` | Customer (API) | Order history |
| `/customer/bookings` | `(home)/customer/bookings/page.tsx` | `(home)/layout` | Customer (API) | Service bookings |

---

## Vendor onboarding — `(home)/partners`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/partners` | `(home)/partners/page.tsx` | `(home)/layout` | business_owner guard | Onboarding hub |
| `/partners/business/new` | `(home)/partners/business/new/page.tsx` | `(home)/layout` | Vendor | Create business |
| `/partners/business-profile` | `(home)/partners/business-profile/page.tsx` | `(home)/layout` | Vendor | Profile edit |
| `/partners/business/payment` | `(home)/partners/business/payment/page.tsx` | `(home)/layout` | Vendor | Stage-1 payment |
| `/partners/business/[businessid]/setup` | `(home)/partners/business/[businessid]/setup/page.tsx` | `(home)/layout` | Vendor | Setup wizard |
| `/partners/tier-selection` | `(home)/partners/tier-selection/page.tsx` | tier-selection layout | Vendor | Subscription tier |
| `/partners/tier-selection/checkout` | `(home)/partners/tier-selection/checkout/page.tsx` | tier-selection layout | Vendor | Tier Stripe checkout |
| `/partners/tier-selection/success` | `(home)/partners/tier-selection/success/page.tsx` | tier-selection layout | Vendor | Tier success |
| `/partners/payout-setup` | `(home)/partners/payout-setup/page.tsx` | `(home)/layout` | Vendor | Stripe Connect onboarding |
| `/partners/connect/return` | `(home)/partners/connect/return/page.tsx` | `(home)/layout` | Vendor | Redirects to payout-setup |
| `/partners/connect/refresh` | `(home)/partners/connect/refresh/page.tsx` | `(home)/layout` | Vendor | Connect refresh handler |
| `/partners/final-review` | `(home)/partners/final-review/page.tsx` | `(home)/layout` | Vendor | Launch review |
| `/partners/add-product` | `(home)/partners/add-product/page.tsx` | `(home)/layout` | Vendor | Add product wizard |
| `/partners/add-service` | `(home)/partners/add-service/page.tsx` | `(home)/layout` | Vendor | Add service |
| `/partners/add-food` | `(home)/partners/add-food/page.tsx` | `(home)/layout` | Vendor | Add food |
| `/partners/products` | `(home)/partners/products/page.tsx` | `(home)/layout` | Vendor | Manage products |
| `/partners/services` | `(home)/partners/services/page.tsx` | `(home)/layout` | Vendor | Manage services |
| `/partners/services/[serviceId]` | `(home)/partners/services/[serviceId]/page.tsx` | `(home)/layout` | Vendor | Service detail edit |
| `/partners/foods` | `(home)/partners/foods/page.tsx` | `(home)/layout` | Vendor | Manage food |

---

## Partner dashboard — `(partner)`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/partners/dashboard` | `(partner)/partners/dashboard/page.tsx` | `(partner)/layout` | Vendor | Tabbed dashboard |
| `/partners/[businessid]` | `(partner)/partners/[businessid]/page.tsx` | `(partner)/layout` | Vendor | Business overview |
| `/partners/[businessid]/inventory` | `(partner)/partners/[businessid]/inventory/page.tsx` | `(partner)/layout` | Vendor | Inventory hub |
| `/partners/[businessid]/inventory/add-product` | `.../add-product/page.tsx` | `(partner)/layout` | Vendor | Add product |
| `/partners/[businessid]/inventory/add-service` | `.../add-service/page.tsx` | `(partner)/layout` | Vendor | Add service |
| `/partners/[businessid]/inventory/edit/[id]` | `.../edit/[id]/page.tsx` | `(partner)/layout` | Vendor | Edit product |
| `/partners/[businessid]/inventory/edit/[id]/add-variant` | `.../add-variant/page.tsx` | `(partner)/layout` | Vendor | Add variant |
| `/partners/[businessid]/inventory/edit/[id]/[variantId]` | `.../[variantId]/page.tsx` | `(partner)/layout` | Vendor | Edit variant |
| `/partners/[businessid]/inventory/edit-service/[serviceId]` | `.../edit-service/[serviceId]/page.tsx` | `(partner)/layout` | Vendor | Edit service |
| `/partners/[businessid]/orders` | `(partner)/partners/[businessid]/orders/page.tsx` | `(partner)/layout` | Vendor | Orders |
| `/partners/[businessid]/bookings` | `(partner)/partners/[businessid]/bookings/page.tsx` | `(partner)/layout` | Vendor | Bookings |
| `/partners/[businessid]/finance` | `(partner)/partners/[businessid]/finance/page.tsx` | `(partner)/layout` | Vendor | Stripe Connect finance |
| `/partners/[businessid]/my-account` | `(partner)/partners/[businessid]/my-account/page.tsx` | `(partner)/layout` | Vendor | Account settings |

---

## Authentication — `(auth)`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/login` | `(auth)/login/page.tsx` | `(auth)/layout` | Public | `?type=customer` or `?type=vendor` |
| `/signup` | `(auth)/signup/page.tsx` | `(auth)/layout` | Public | Registration |
| `/verify-otp` | `(auth)/verify-otp/page.tsx` | `(auth)/layout` | OTP gate | Requires email param or otpPending cookie |
| `/forgot-password` | `(auth)/forgot-password/page.tsx` | `(auth)/layout` | Public | Password reset |

---

## Admin — `(admin)`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/signin` | `(admin)/signin/page.tsx` | `(admin)/layout` | Public | Admin login (not `/login`) |
| `/admin` | `(admin)/admin/page.tsx` | `(admin)/admin/layout` | admin role guard | Dashboard |
| `/admin/businesses` | `(admin)/admin/businesses/page.tsx` | `(admin)/admin/layout` | admin | Business management |
| `/admin/products` | `(admin)/admin/products/page.tsx` | `(admin)/admin/layout` | admin | Product moderation |
| `/admin/orders` | `(admin)/admin/orders/page.tsx` | `(admin)/admin/layout` | admin | Orders |
| `/admin/users` | `(admin)/admin/users/page.tsx` | `(admin)/admin/layout` | admin | Uses legacy `/admin/users` API |
| `/admin/vendor-applications` | `(admin)/admin/vendor-applications/page.tsx` | `(admin)/admin/layout` | admin | Application queue |
| `/admin/vendor-applications/[id]` | `(admin)/admin/vendor-applications/[id]/page.tsx` | `(admin)/admin/layout` | admin | Application detail |
| `/admin/category-requests` | `(admin)/admin/category-requests/page.tsx` | `(admin)/admin/layout` | admin | Category requests |
| `/admin/categories-management` | `(admin)/admin/categories-management/page.tsx` | `(admin)/admin/layout` | admin | Category CRUD |
| `/admin/subscription` | `(admin)/admin/subscription/page.tsx` | `(admin)/admin/layout` | admin | Subscription plans |
| `/admin/subscription/new` | `(admin)/admin/subscription/new/page.tsx` | `(admin)/admin/layout` | admin | New plan |
| `/admin/subscription/[id]/edit` | `(admin)/admin/subscription/[id]/edit/page.tsx` | `(admin)/admin/layout` | admin | Edit plan |
| `/admin/testimonials` | `(admin)/admin/testimonials/page.tsx` | `(admin)/admin/layout` | admin | Testimonials CMS |
| `/admin/cms` | `(admin)/admin/cms/page.tsx` | `(admin)/admin/layout` | admin | Content management |

---

## Legacy payment — `payment/`

| URL | File | Layout | Auth | Notes |
|-----|------|--------|------|-------|
| `/payment` | `payment/page.tsx` | `payment/layout` | Evidence Needed | Alternate entry |
| `/payment/checkout` | `payment/checkout/page.tsx` | `payment/layout` | Evidence Needed | Alternate checkout |
| `/payment/success` | `payment/success/page.tsx` | `payment/layout` | Vendor | Onboarding submit on success |

---

## Build route summary

`npm run build` (2026-06-19) reported **69 static/dynamic routes** in the App Router table (includes middleware proxy). Full enumerated paths match the tables above.

---

## Cross-links

- [FRONTEND_ARCHITECTURE_AS_BUILT.md](FRONTEND_ARCHITECTURE_AS_BUILT.md)
- [FRONTEND_MARKETPLACE_SURFACE_MAP.md](FRONTEND_MARKETPLACE_SURFACE_MAP.md)
- [FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md](FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md)
