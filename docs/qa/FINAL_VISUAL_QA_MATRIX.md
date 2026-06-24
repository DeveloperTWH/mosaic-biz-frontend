# Final Visual QA Matrix

Date: 2026-06-24
Branch: `polish/frontend-final-launch-pass`
Base develop SHA: `a9afbf5d2ad744926d6fe4cbe9adf43194884444`

This matrix records automated visual evidence from mocked Playwright routes. It does not replace live final-domain QA.

## Viewport Sweep

The final evidence spec checked body-level horizontal overflow at:

- 320 x 844
- 390 x 844
- 768 x 1024
- 1024 x 768
- 1440 x 900

Routes swept:

| Route | 320 | 390 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- |
| `/` | Pass | Pass | Pass | Pass | Pass |
| `/products` | Pass | Pass | Pass | Pass | Pass |
| `/services` | Pass | Pass | Pass | Pass | Pass |
| `/foods` | Pass | Pass | Pass | Pass | Pass |
| `/services?badge=gold` | Pass | Pass | Pass | Pass | Pass |
| `/services?state=Georgia&country=United+States` | Pass | Pass | Pass | Pass | Pass |
| `/product/:id` | Pass | Pass | Pass | Pass | Pass |
| `/vendor-profile/service-vendor/:id` | Pass | Pass | Pass | Pass | Pass |
| `/vendor-profile/food-vendor/:id` | Pass | Pass | Pass | Pass | Pass |
| `/login?type=customer` | Pass | Pass | Pass | Pass | Pass |
| `/signup?type=customer` | Pass | Pass | Pass | Pass | Pass |
| `/verify-otp` | Pass | Pass | Pass | Pass | Pass |
| `/partners` | Pass | Pass | Pass | Pass | Pass |
| `/partners/dashboard?tab=manage-listings` | Pass | Pass | Pass | Pass | Pass |
| `/partners/products` | Pass | Pass | Pass | Pass | Pass |
| `/cart` | Pass | Pass | Pass | Pass | Pass |
| `/checkout/address?type=cart` | Pass | Pass | Pass | Pass | Pass |
| `/admin/vendor-applications/:id` | Pass | Pass | Pass | Pass | Pass |

## Screenshot Matrix

| Area | Viewport | Screenshot | Status |
| --- | --- | --- | --- |
| Homepage | 390 | `../qa-screenshots/final-frontend-precutover/homepage-390.png` | Captured |
| Homepage | 1440 | `../qa-screenshots/final-frontend-precutover/homepage-1440.png` | Captured |
| Marketplace products | 390 | `../qa-screenshots/final-frontend-precutover/marketplace-products-390.png` | Captured |
| Marketplace products | 1440 | `../qa-screenshots/final-frontend-precutover/marketplace-products-1440.png` | Captured |
| Badge filter | 390 | `../qa-screenshots/final-frontend-precutover/badge-filter-services-390.png` | Captured |
| Location filter | 390 | `../qa-screenshots/final-frontend-precutover/location-filter-services-390.png` | Captured |
| Product detail | 390 | `../qa-screenshots/final-frontend-precutover/product-detail-390.png` | Captured |
| Service detail | 390 | `../qa-screenshots/final-frontend-precutover/service-detail-390.png` | Captured |
| Food detail | 390 | `../qa-screenshots/final-frontend-precutover/food-detail-390.png` | Captured |
| Registration | 390 | `../qa-screenshots/final-frontend-precutover/registration-390.png` | Captured |
| OTP verification | 390 | `../qa-screenshots/final-frontend-precutover/otp-390.png` | Captured |
| Vendor onboarding | 390 | `../qa-screenshots/final-frontend-precutover/vendor-onboarding-390.png` | Captured |
| Vendor dashboard | 1440 | `../qa-screenshots/final-frontend-precutover/vendor-dashboard-1440.png` | Captured |
| Product delete confirmation | 390 | `../qa-screenshots/final-frontend-precutover/product-delete-confirmation-390.png` | Captured |
| Cart | 390 | `../qa-screenshots/final-frontend-precutover/cart-390.png` | Captured |
| Checkout entry | 390 | `../qa-screenshots/final-frontend-precutover/checkout-entry-390.png` | Captured |
| Admin vendor review | 1440 | `../qa-screenshots/final-frontend-precutover/admin-vendor-review-1440.png` | Captured |

## Defect Notes

- Auth pages previously overflowed at tablet/desktop because the absolute header combined `md:left-20` with `w-full`. Fixed with `md:w-auto` in the shared auth shell and signup variants.
- Food listing filters now persist through URL state and browser navigation by using the shared listing filter helper.
- Food badge filter options now use the shared Bronze/Silver/Gold/Platinum/Diamond option source.

## Remaining Manual Visual QA

- Inspect live images and real vendor data on final domains.
- Confirm production header/logo assets on `https://mosaicbizhub.com`.
- Confirm live dashboard states for product, service, and food vendors.
- Confirm real admin vendor documents render correctly in review modals.
- Confirm browser/device combinations outside Chromium Playwright.
