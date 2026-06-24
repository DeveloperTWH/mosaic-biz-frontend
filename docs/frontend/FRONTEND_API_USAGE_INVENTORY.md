# Frontend API Usage Inventory — As Built

> **Archive note (2026-06-23):** Canonical endpoint list is [../API_CONTRACTS.md](../API_CONTRACTS.md). This inventory is a grep snapshot for launch evidence — see [../archive/README.md](../archive/README.md).

**Type:** Reference (launch evidence pack)  
**Last updated:** 2026-06-22 (service publication #185, phase 1 client migration #164)  
**Evidence source:** ripgrep across `*.{ts,tsx}` (excluding docs), full read of `lib/api/*`, `utils/cartUtils.ts`, `utils/authUtils.ts`, `lib/api/routeContract.ts`

**Phase 1 migrated modules:** `lib/api/httpClient.ts`, `authSession.ts`, `vendorOnboarding.ts`, `vendorOnboardingAdmin.ts`, `orders.ts`, `stripeConnect.ts` — see [FRONTEND_API_CLIENT_PHASE1.md](FRONTEND_API_CLIENT_PHASE1.md).

**Service publication module (#185):** `lib/api/services.ts` — see [FRONTEND_SERVICE_PUBLICATION_FLOW.md](FRONTEND_SERVICE_PUBLICATION_FLOW.md).

Base URL for all calls: `NEXT_PUBLIC_API_BASE_URL` (axios default in `lib/api.ts`: `https://api.mosaicbizhub.com/`).

---

## Inventory legend

| Column | Meaning |
|--------|---------|
| Credentials | `include` = `credentials: 'include'` or axios `withCredentials: true` |
| Response | Known TS shape or documented fields; else **Evidence Needed** |
| UI states | loading/error/empty if evident in source; else **Evidence Needed** |

---

## Auth and users

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `app/(auth)/login/page.tsx` | LoginPage | POST | `/api/users/login` | include | Redirect by role; OTP branch |
| `app/(auth)/login/page.tsx` | LoginPage | GET | `/api/users/auth/check` | include | Session validation after login |
| `app/(auth)/login/page.tsx` | LoginPage | redirect | `/api/auth/google?role=...` | — | Google OAuth |
| `app/(auth)/signup/page.tsx` | SignupPage | POST | `/api/users/register` | include | OTP pending → `/verify-otp` |
| `app/(auth)/signup/page.tsx` | SignupPage | GET | `/api/minority-types` | none | Minority type dropdown |
| `app/(auth)/verify-otp/page.tsx` | VerifyOtpPage | POST | `/api/users/verify-otp` | include | Evidence Needed |
| `app/(auth)/verify-otp/page.tsx` | VerifyOtpPage | POST | `/api/users/resend-otp` | include | Evidence Needed |
| `app/(auth)/forgot-password/page.tsx` | ForgotPassword | POST | `/api/users/forgot-password` | include | Evidence Needed |
| `app/(auth)/forgot-password/page.tsx` | ForgotPassword | POST | `/api/users/reset-password` | include | Evidence Needed |
| `app/(admin)/signin/page.tsx` | AdminSignin | POST | `/api/users/login` | include | role: admin |
| `utils/authUtils.ts` | isUserLoggedIn | GET | `/api/users/auth/check` | include | boolean (res.ok) |
| `utils/authUtils.ts` | getAuthenticatedUser | GET | `/api/users/auth/check` | include | `{ user: { id, role, ... } }` |
| `utils/logoutUser.ts` | logoutUser | POST | `/api/users/logout` | include | Clears cookies + localStorage |
| `app/(admin)/admin/layout.tsx` | AdminLayout | GET | `/api/users/auth/check` | include | Redirect if role !== admin |

---

## Featured products (canonical)

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `lib/api/featured-products.ts` | getFeaturedProducts | GET | `/api/featured-products?page=&limit=` | withCredentials | `{ products[], pagination }` |
| `app/(home)/Components/ShopProducts.tsx` | ShopProducts | GET | `/api/featured-products` (via helper) | via helper | Empty array OK per smoke checklist |
| `app/(home)/Components/FeaturedProducts.tsx` | FeaturedProducts | GET | `/api/featured-products` (via helper) | via helper | Evidence Needed |
| `app/(home)/Components/ShopProducts.tsx` | ShopProducts | GET | `/api/ranked` or `NEXT_PUBLIC_RANKED_PATH` | Evidence Needed | Ranked homepage mix |

**Verified:** `/api/products/featured` — **0 matches** in `*.{ts,tsx}` app code.

---

## Marketplace browse / search / filter

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `lib/api/products.ts` | listProducts | GET | `/api/products/list` | axios default | ListResponse |
| `lib/api/products.ts` | getProductById | GET | `/api/product/:id` | axios default | product object |
| `app/(home)/products/ProductsClient.tsx` | ProductsClient | GET | `/api/products/list` | Evidence Needed | Primary `/products` gate |
| `app/(home)/products/ProductsClient.tsx` | ProductsClient | GET | `/api/services/list` | Evidence Needed | Cross-list on products page |
| `app/(home)/products/ProductsClient.tsx` | ProductsClient | GET | `/api/categories/products` | none | Category filters |
| `app/(home)/products/ProductsClient.tsx` | ProductsClient | GET | `/api/minority-types` | none | Filter dropdown |
| `app/(home)/products/components/FilterAccordion.tsx` | FilterAccordion | GET | `/api/categories/products` | none | Evidence Needed |
| `app/(home)/products/components/FilterAccordion.tsx` | FilterAccordion | GET | `/api/products/subcategories/:categoryId` | none | Evidence Needed |
| `app/(home)/services/page.tsx` | ServicesPage | GET | `/api/services/list` | Evidence Needed | Services catalog |
| `app/(home)/services/page.tsx` | ServicesPage | GET | `/api/services/subcategories/:categoryId` | none | Evidence Needed |
| `app/(home)/foods/page.tsx` | FoodsPage | GET | `/api/food/list` | Evidence Needed | Food catalog |
| `app/(home)/foods/page.tsx` | FoodsPage | GET | `/api/foods/subcategories/:categoryId` | none | Evidence Needed |
| `lib/api/search.ts` | listFoods | GET | `/api/food/list` | axios default | Used as search helper module |
| `app/(home)/search/page.tsx` | SearchPage | GET | `/api/public/search?...` | Evidence Needed | Global search |
| `app/(home)/vendors/components/VendorGrid.tsx` | VendorGrid | GET | `/api/business?...` | none | Vendor directory |
| `app/(home)/product/[id]/page.tsx` | ProductDetail | GET | `/api/product/:id` (and related) | Evidence Needed | Canonical detail |
| `app/(home)/service/[slug]/page.tsx` | ServiceDetail | GET | `/api/services/:slug` | none | Service detail |
| `app/(home)/service/[slug]/page.tsx` | ServiceDetail | POST | `/api/bookings/create` | Evidence Needed | Service booking |
| `app/(home)/vendor-profile/product-vendor/[businessId]/page.tsx` | ProductVendor | GET | multiple public product APIs | Evidence Needed | Storefront |
| `app/(home)/vendor-profile/service-vendor/[serviceId]/page.tsx` | ServiceVendor | GET | public service APIs | Evidence Needed | Storefront |
| `app/(home)/vendor-profile/food-vendor/[foodId]/page.tsx` | FoodVendor | GET | `/api/public/foods/:id`, reviews, enquiries | include on some | Evidence Needed |

---

## Cart and checkout

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `utils/cartApi.ts` | fetchRealCartCount | GET | `/api/cart/count` | include | `{ count }` |
| `utils/cartApi.ts` | mergeGuestCartToServer | POST | `/api/cart/merge` | include | Merged count |
| `utils/cartUtils.ts` | addToCart | POST | `/api/cart/add` | include | Evidence Needed |
| `utils/cartUtils.ts` | fetchCart | GET | `/api/cart` | include | Cart items |
| `utils/cartUtils.ts` | updateCartItem | PUT | `/api/cart/update/:cartItemId` | include | Evidence Needed |
| `utils/cartUtils.ts` | removeCartItem | DELETE | `/api/cart/remove/:cartItemId` | include | Evidence Needed |
| `utils/cartUtils.ts` | initiateOrder | POST | `/api/orders/initiate` | include | Stripe client secret |
| `app/(home)/checkout/buy-now/page.tsx` | BuyNow | GET | `/api/public/product/:productId` | none | Buy-now payload |
| `app/(home)/checkout/address/ClientForm.tsx` | ClientForm | POST/PATCH | address APIs | Evidence Needed | Evidence Needed |
| `app/(home)/payment-success/page.tsx` | PaymentSuccess | GET | `/api/orders/retrieve-intent/:paymentIntentId` | include | Order confirmation |
| `app/(home)/checkout/page.tsx` | Checkout | — | Stripe Elements | — | return_url uses `buildAppUrl` helper |

---

## Vendor onboarding

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `lib/api/vendorOnboarding.ts` | saveStage1Draft | POST | `/api/vendor-onboarding/draft` | include + Bearer optional | Evidence Needed |
| `lib/api/vendorOnboarding.ts` | getStage1Draft | GET | `/api/vendor-onboarding/draft` | include + Bearer optional | draft data |
| `lib/api/vendorOnboarding.ts` | createStage1Payment | POST | `/api/vendor-onboarding/stage1/create-payment` | include + Bearer optional | payment intent |
| `lib/api/vendorOnboarding.ts` | submitStage1 | POST | `/api/vendor-onboarding/submit` | include + Bearer optional | Evidence Needed |
| `lib/api/vendorOnboarding.ts` | getOnboardingData | GET | `/api/vendor-onboarding/onboarding-data` | include + Bearer optional | onboarding doc |
| `lib/api/vendorOnboarding.ts` | updateBusinessProfile | PUT | `/api/vendor-onboarding/business-profile` | include + Bearer optional | Evidence Needed |
| `app/(home)/partners/page.tsx` | PartnersHub | GET | `/api/vendor-onboarding/applicationId` | include | app id |
| `app/(home)/partners/page.tsx` | PartnersHub | GET | `/api/vendor-onboarding/status/:appId` | include | stage status |
| `app/(home)/partners/page.tsx` | PartnersHub | GET | `/api/business/my` | include | business list |
| `app/payment/success/page.tsx` | PaymentSuccessLegacy | POST | `/api/vendor-onboarding/submit` | include | Legacy payment flow |

---

## Stripe Connect

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `lib/api/stripeConnect.ts` | getBusinessConnectStatus | GET | `/api/connect/:businessId/status` | include + Bearer optional | StripeConnectStatus |
| `lib/api/stripeConnect.ts` | createBusinessConnectAccountLink | POST | `/api/connect/:businessId/account-link` | include + Bearer optional | onboarding URL |
| `app/(partner)/partners/[businessid]/finance/page.tsx` | FinancePage | POST | `/stripe/account-session` | include | Legacy mount (routeContract) |
| `app/(partner)/partners/[businessid]/finance/page.tsx` | FinancePage | POST | `/stripe/express-login-link` | include | Legacy mount |
| `app/(partner)/partners/[businessid]/finance/page.tsx` | FinancePage | GET | `/stripe/account-balance` | include | Legacy mount |
| `app/(partner)/partners/[businessid]/finance/page.tsx` | FinancePage | GET | `/stripe/last-payout` | include | Legacy mount |

UI routes: `/partners/connect/return` → `/partners/payout-setup?refresh=1`; `/partners/connect/refresh`.

---

## Partner service publication (#185)

Central module: `lib/api/services.ts` — serializers, mutation parsing, publish/unpublish helpers, public visibility probe.

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `lib/api/services.ts` | createService | POST | `/api/service` | include | `{ success, service, publication?, errors? }` |
| `lib/api/services.ts` | updateService | PUT | `/api/service/:id` | include | Same as create |
| `lib/api/services.ts` | getServiceById | GET | `/api/service/:id` | include | Owner service doc |
| `lib/api/services.ts` | publishService | PUT | `/api/service/:id` | include | `isPublished: true` |
| `lib/api/services.ts` | unpublishService | PUT | `/api/service/:id` | include | `isPublished: false` |
| `lib/api/services.ts` | deleteService | DELETE | `/api/service/:id` | include | Evidence Needed |
| `lib/api/services.ts` | listPrivateServices | GET | `/api/private/services/list?businessId=&page=&limit=` | include | `{ services[], pagination }` |
| `lib/api/services.ts` | verifyPublicListing | GET | `/api/public/services/:id` | none | 200 = publicly visible |
| `app/(partner)/.../CreateServiceForm.tsx` | CreateServiceForm | POST | `/api/service` (via `createService`) | include | Draft/publish toasts from response |
| `app/(partner)/.../EditServiceForm.tsx` | EditServiceForm | PUT | `/api/service/:id` (via `updateService`) | include | Save Draft / Publish / Unpublish |
| `app/(partner)/.../ServiceTable.tsx` | ServiceTable | PUT/DELETE | `/api/service/:id` | include | Row publish/unpublish + refetch |
| `app/(home)/partners/add-service/hooks/useServiceForm.ts` | useServiceForm | POST/PUT | `/api/service`, `/api/service/:id` | include | Legacy flow; draft/publish via shared helpers |

Public storefront (unchanged): `/services` → `GET /api/services/list`; `/vendor-profile/service-vendor/:id` → `GET /api/public/services/:id`. Inventory **View Public** links use vendor-profile route, not `/service/:slug`.

---

## Partner dashboard (private)

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `app/(partner)/partners/[businessid]/inventory/page.tsx` | Inventory | GET | `/api/private/products/list` | include | Evidence Needed |
| `app/(partner)/partners/[businessid]/inventory/page.tsx` | Inventory | GET | `/api/private/services/list` | include | Evidence Needed |
| `app/(partner)/partners/[businessid]/inventory/page.tsx` | Inventory | GET | `/api/private/food/list` | include | Evidence Needed |
| `app/(partner)/partners/[businessid]/orders/page.tsx` | Orders | GET | `/api/orders/vendor` | include | Evidence Needed |
| `app/(partner)/partners/[businessid]/bookings/page.tsx` | Bookings | GET | `/api/bookings/vendor?businessId=` | include | Evidence Needed |
| `app/(partner)/partners/[businessid]/bookings/page.tsx` | Bookings | POST | `/api/bookings/:action/:bookingId` | include | Evidence Needed |
| `app/(partner)/partners/dashboard/components/ShippingSettingsTab.tsx` | Shipping | GET/PATCH | `/api/business/:id/shipping-settings` | include | Evidence Needed |
| `app/(partner)/partners/dashboard/components/TaxSettingsTab.tsx` | Tax | GET/PATCH | `/api/business/:id/tax-settings` | include | Evidence Needed |
| `lib/api/vendorBookings.ts` | vendor booking helpers | GET/PATCH | `/api/bookings/vendor/:listingType` | Evidence Needed | Evidence Needed |

---

## Admin

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `app/(admin)/admin/users/page.tsx` | UsersPage | GET | `/admin/users` | withCredentials | **Legacy mount** |
| `lib/api/products-admin.ts` | getProducts | GET | `/admin/api/products` | withCredentials | **Legacy mount** |
| `lib/api/products-admin.ts` | toggleProductFeatured | PATCH | `/admin/api/products/:id/featured` | withCredentials | Admin featured toggle |
| `app/(admin)/admin/page.tsx` | AdminDashboard | GET | `/api/admin/business` | include | Business stats |
| `app/(admin)/admin/page.tsx` | AdminDashboard | PATCH | `/api/admin/business/status/:id` | include | Activate/deactivate |
| `app/(admin)/admin/orders/page.tsx` | AdminOrders | GET | `/api/orders/admin` | include | Evidence Needed |
| `app/(admin)/admin/cms/page.tsx` | CMS | GET/POST/PUT | `/api/cms/admin`, `/api/cms/admin/:type` | axios default | Evidence Needed |
| `app/(admin)/admin/categories-management/page.tsx` | Categories | GET/DELETE | `/api/admin/categories`, `/api/admin/category/*` | withCredentials | Evidence Needed |
| `lib/api/subscription/subscriptionApi.ts` | fetchSubscriptionPlans | GET | `/api/subscription-plans` | axios default | Plans list |
| `lib/api/subscription/subscriptionApi.ts` | createSubscription | POST | `/api/subscriptions/create` | axios default | Tier checkout |

---

## Uploads

| File | Symbol | Method | Endpoint | Credentials | Response / UI |
|------|--------|--------|----------|-------------|---------------|
| `utils/s3Uploader.ts` | upload | POST | `/upload/presigned-url` | Evidence Needed | Legacy path |
| `utils/s3Uploader.ts` | upload | POST | `/api/s3-presigned-url` | Evidence Needed | Primary presign |
| Various partner forms | — | GET | `/api/product/upload-url`, `/api/service/upload-url`, `/api/vendor-onboarding/stage1/upload-url` | include | Presigned upload URLs |

---

## Stale / suspicious path appendix

| Path | Status | Evidence |
|------|--------|----------|
| `/api/products/featured` | **Not used** | 0 matches in `*.{ts,tsx}` |
| `/api/featured-products` | **Canonical** | `lib/api/featured-products.ts`, homepage components |
| `/admin/users` | **Active (legacy)** | `routeContract.ts`, `admin/users/page.tsx` |
| `/admin/api/products` | **Active (legacy)** | `routeContract.ts`, `products-admin.ts` |
| `/stripe/account-session` etc. | **Active (legacy)** | `routeContract.ts`, `finance/page.tsx` |
| `/api/admin/users` | **Not used in app** | routeContract notes 404 on live probe |
| `/api/stripe/account-session` | **Not used in app** | routeContract notes 404 on live probe |
| `/api/placeholder/120/120` | Static fallback string | `Congratulations.tsx` — not a backend call |

---

## Cross-links

- [FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md)
- [FRONTEND_API_CLIENT_PHASE1.md](FRONTEND_API_CLIENT_PHASE1.md) — centralized client phase 1 (#164)
- [../API_CONTRACTS.md](../API_CONTRACTS.md)
- [../BACKEND_FRONTEND_ROUTE_CONTRACT.md](../BACKEND_FRONTEND_ROUTE_CONTRACT.md)
