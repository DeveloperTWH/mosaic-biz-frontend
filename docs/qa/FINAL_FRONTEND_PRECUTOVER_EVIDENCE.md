# Final Frontend Pre-Cutover Evidence

Date: 2026-06-24
Repository: `Digital-Builders-757/mosaic-biz-frontend-launch`
Integration branch: `develop`
Feature branch: `polish/frontend-final-launch-pass`
Starting develop SHA: `a9afbf5d2ad744926d6fe4cbe9adf43194884444`
Production PR to refresh after merge: `#215` (`develop` -> `main`)

This document records the final controlled frontend polish and mocked verification pass. It is not a launch-ready declaration and does not replace live final-domain QA.

## Scope

In scope:

- Public marketplace, products, services, foods, search/filtering, detail pages.
- Auth pages: login, registration, OTP verification.
- Vendor onboarding hub and vendor dashboard/manage-listings surface.
- Product delete confirmation.
- Cart and checkout entry.
- Admin vendor review detail.
- Frontend caller contracts that were previously identified as release risks.

Out of scope:

- Production deployment, DNS, secrets, backend persistence, payment business logic, live Stripe charges, and destructive admin finalization.

## Defects Reproduced And Fixed

| Defect | Evidence | Fix |
| --- | --- | --- |
| Auth pages overflowed horizontally at tablet/desktop widths | New Playwright viewport sweep reproduced 72px body overflow on `/login?type=customer` at 768px+ | Added `md:w-auto` to shifted auth headers in `components/auth/AuthPageShell.tsx` and both signup variants |
| Food badge filtering omitted Bronze | Code audit found food filter hard-coded `Silver/Gold/Platinum/Diamond` while shared public filter options include Bronze | Food filter now uses `PUBLIC_BADGE_FILTER_OPTIONS` |
| Food listing filters were not URL/browser-navigation driven | Food page used local state and legacy direct fetch calls instead of the shared listing URL serializer | Food page now uses `useListingFilters("/foods")` and `listingFiltersToApiParams` for canonical `state`, `country`, `badge`, `price`, and pagination params |
| Required visual evidence was not durable | Existing screenshot pilot only attached ephemeral Playwright screenshots | Added `e2e/tests/final-precutover-evidence.spec.ts` and saved sanitized PNGs under `docs/qa-screenshots/final-frontend-precutover/` |

## Functional Caller Audit Summary

| Surface | Frontend caller | Method/path | Credentials | Result |
| --- | --- | --- | --- | --- |
| Register | `app/(auth)/signup/page.tsx` | `POST /api/users/register` | `include` | Aligned; redirects to email OTP on success |
| Verify OTP | `app/(auth)/verify-otp/page.tsx` | `POST /api/users/verify-otp` | `include` | Aligned; confirms session before success redirect |
| Resend OTP | `app/(auth)/verify-otp/page.tsx` | `POST /api/users/resend-otp` | `include` | Aligned; email OTP copy present |
| Login | `app/(auth)/login/page.tsx`, `app/(admin)/signin/page.tsx` | `POST /api/users/login` then `GET /api/users/auth/check` | `include` | Aligned; no success redirect before session confirmation |
| Logout | `lib/api/authSession.ts`, `utils/logoutUser.ts` | `POST /api/users/logout` | `include` | Aligned |
| Vendor onboarding | `lib/api/vendorOnboarding.ts`, partner pages | `/api/vendor-onboarding/*` | `include` plus optional bearer | Aligned; live account evidence still required |
| Business profile | partner business profile pages | `GET /api/business/my`, profile update routes | `include` | Aligned |
| Public products | `app/(home)/products/ProductsClient.tsx` | `GET /api/products/list` | public | Aligned; product count helper covered |
| Public services | `app/(home)/services/page.tsx` | `GET /api/services/list` | public | Aligned; service badge/filter URL behavior covered |
| Public food | `app/(home)/foods/page.tsx` | `GET /api/food/list` | public | Fixed to use shared canonical filter params |
| Featured products | `lib/api/featured-products.ts` | `GET /api/featured-products` | `withCredentials: true` | Aligned; no `/api/products/featured` calls allowed in e2e guard |
| Service booking | `lib/api/serviceBookings.ts` | `POST /api/bookings/service/:serviceId` | `include` plus optional bearer | Aligned; unit covered |
| Product deletion | `lib/api/vendorProducts.ts` | `DELETE /api/product/delete-product/:productId` | `include` | Aligned; unit and visual confirmation covered |
| Cart | `utils/cartUtils.ts`, `utils/cartApi.ts`, cart page | `/api/cart*` | `include` for auth cart | Mocked UI covered; live cart account evidence required |
| Checkout/order initiation | checkout pages, `lib/api/orders.ts`, `utils/cartUtils.ts` | `POST /api/orders/initiate` | `include` | Mocked entry covered; no live payment executed |
| Stripe Connect | `lib/api/stripeConnect.ts`, payout setup page | `GET/POST /api/connect/:businessId/*` | `include` plus optional bearer | Aligned; live Stripe dashboard evidence required |
| Admin vendor review | `lib/api/vendorOnboardingAdmin.ts` | `GET /api/vendor-onboarding/pending`, `GET/POST /api/vendor-onboarding/:id/*` | shared `apiRequest` include | Mocked admin review detail covered; destructive finalize not executed |

## Verification Results

| Command | Result | Notes |
| --- | --- | --- |
| `npm run test:unit` | Pass, 69/69 | Includes badge, location/country, product delete, service booking, auth/session, and apex URL helper tests |
| `npm run build` | Pass | Baseline warnings remain: workspace-root inference from multiple lockfiles and deprecated `middleware` convention |
| `npm run test:screenshots` | Pass, 10/10 | Existing public screenshot pilot |
| `npx playwright test e2e/tests/final-precutover-evidence.spec.ts` | Pass, 6/6 | Captured required screenshots and swept 320/390/768/1024/1440 for body overflow |
| Targeted lint on changed files | Pass with warnings | Only existing `@next/next/no-img-element` warnings in auth image markup |

## Screenshot Evidence

All screenshots are sanitized mocked evidence saved in `docs/qa-screenshots/final-frontend-precutover/`.

| Evidence | File |
| --- | --- |
| Homepage mobile | `homepage-390.png` |
| Homepage desktop | `homepage-1440.png` |
| Marketplace mobile | `marketplace-products-390.png` |
| Marketplace desktop | `marketplace-products-1440.png` |
| Badge filter | `badge-filter-services-390.png` |
| Location filter | `location-filter-services-390.png` |
| Product detail | `product-detail-390.png` |
| Service detail | `service-detail-390.png` |
| Food detail | `food-detail-390.png` |
| Registration | `registration-390.png` |
| OTP | `otp-390.png` |
| Vendor onboarding | `vendor-onboarding-390.png` |
| Vendor dashboard | `vendor-dashboard-1440.png` |
| Product delete confirmation | `product-delete-confirmation-390.png` |
| Cart | `cart-390.png` |
| Checkout entry | `checkout-entry-390.png` |
| Admin vendor review | `admin-vendor-review-1440.png` |

## Backend Dependencies

- Final-domain CORS and cookie behavior on `https://api.mosaicbizhub.com`.
- SMTP/OTP delivery for fresh registration and resend flows.
- Public listing endpoints honoring `state`, `city`, `country`, `badge`, category, price, and pagination filters.
- Vendor eligibility filtering for public catalog/cart/checkout.
- Stripe Connect status/account-link behavior on real connected accounts.
- Stripe payment intent creation and payment success retrieval in a controlled, approved payment test.
- Admin QA credentials for non-destructive review and separately approved destructive finalization.

## Product Decisions Still Open

- Whether food listing price filtering should expose the same UX affordance as services/products.
- Whether to replace legacy auth `<img>` markup with `next/image`; this pass left it unchanged because it is not needed to fix the overflow defect.
- Whether to keep the legacy app subdomain as an allowed transition origin in URL helpers; production default remains the apex `https://mosaicbizhub.com`.

## Untested Runtime Areas

- Live registration through disposable inbox, OTP verify, resend, and post-verify session cookie.
- Live customer login, cart merge, checkout address, order initiation, and payment success.
- Live vendor login through rejected/edit/resubmit onboarding.
- Live Stripe Connect onboarding return/refresh against a real test connected account.
- Live admin vendor application verification/finalization.
- Live production data integrity for counts, reviews, vendor locations, and eligibility.

## Rollback

If this branch causes a regression before merge, close the PR and delete the branch. If already merged to `develop`, revert the merge commit on `develop` and push the revert. The frontend changes are scoped to auth header layout, food listing filters, Playwright mocks/evidence, and QA docs/screenshots.
