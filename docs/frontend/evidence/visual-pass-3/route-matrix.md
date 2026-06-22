# Visual Pass 3 — Route Matrix (#184)

**Last updated:** 2026-06-22  
**Branch:** `polish/visual-pass-3-contrast-continuity`  
**Commit:** `1d968f3d`

Legend: **Pass** = no P0/P1 visual/responsive/a11y defect on sampled viewport; **Code** = verified in merged VP3 PRs without live session; **Deferred** = tracked follow-up issue.

---

## Vendor journey (#178–#181, #180)

| Route | Owner | 390 | 768 | Desktop | Status | Issue |
|-------|-------|-----|-----|---------|--------|-------|
| `/partners` | Partner hub | Code | Pass | Code | Pass | #181 closed |
| `/partners/business/new` | Stage 1 application | Code | Code | Code | Pass | #178 closed |
| `/partners/business-profile` | Business profile | Code | Code | Code | Pass | #178 closed |
| `/partners/business/payment` | Payment + submit | Code | Code | Code | Pass | #180 closed |
| `/partners/final-review` | Review steps | Code | Code | Code | Pass | #180 closed |
| `/partners/[businessid]` | Dashboard shell | Code | Code | Code | Pass | #181, #189 |
| `/partners/[businessid]/inventory` | Inventory tables | Code | Code | Code | Pass | #189 |

---

## Customer browse → purchase (#182)

| Route | Owner | 390 | 768 | Desktop | Status | Issue |
|-------|-------|-----|-----|---------|--------|-------|
| `/` | Homepage | Pass | Pass | Pass | Pass | This PR + #66 |
| `/products` | Listing | Pass | Pass | Pass | Pass | #182 |
| `/product/[id]` | Detail + carousel | Code | Code | Code | Pass | This PR (SimilarProduct tokens) |
| `/service/[slug]` | Service detail | Code | Code | Code | Pass | This PR |
| `/vendor-profile/product-vendor/[id]` | Storefront | Deferred | Deferred | Deferred | Deferred | #83 |
| `/vendor-profile/service-vendor/[id]` | Storefront | Code | Code | Code | Pass | #182 |
| `/cart` | Cart | Pass | — | — | Pass | #182 |
| `/checkout/address` | Address form | Code | — | — | Pass | This PR |
| `/checkout/buy-now` | Buy now | Code | — | — | Pass | This PR |
| `/payment-success` | Receipt / error | Pass | — | Pass | Pass | This PR |

---

## Auth (#154, #179)

| Route | Owner | 320 | 390 | Desktop | Status | Issue |
|-------|-------|-----|-----|---------|--------|-------|
| `/login?type=customer` | Customer login | Pass | Pass | Pass | Pass | #154 |
| `/login?type=vendor` | Vendor login | Pass | — | — | Pass | #154 |
| `/signup` | Registration | Code | — | — | Pass | #154 |
| `/verify-otp` | OTP | Code | — | — | Pass | #154 |
| `/forgot-password` | Reset | Code | — | — | Pass | #154 |

---

## Customer account (#189)

| Route | Owner | 390 | Desktop | Status | Issue |
|-------|-------|-----|---------|--------|-------|
| `/customer/order` | Orders | Code | Code | Pass | #189 |
| `/customer/bookings` | Bookings | Code | Code | Pass | #189 |

---

## States verified

| State | Route | Status | Screenshot |
|-------|-------|--------|------------|
| Payment cancelled / no session | `/payment-success` | Pass | `screenshots/390/payment-success-error.png` |
| Marketplace loading | `/products` | Pass | `screenshots/390/products-listing.png` |
| Homepage hero + nav | `/` | Pass | `screenshots/390/home-hero.png`, `screenshots/desktop/home-hero.png` |
| Auth login | `/login?type=customer` | Pass | `screenshots/390/login-customer.png` |
| Partner hub (unauthenticated) | `/partners` | Pass | `screenshots/768/partners-hub.png` |

---

## Explicitly deferred (not silent)

| Item | Issue | Reason |
|------|-------|--------|
| Vendor profile full redesign | #83 | Out of VP3 scope |
| Demo / placeholder content inventory | #84 | Honest coming-soon sections remain |
| Checkout trust microcopy | #118 | Copy pass after VP3 |
| Global empty/error system | #111 | Epic #109 |
| Automated screenshot regression | #115 | Epic #109 |
| Production preview CORS E2E | — | Vercel preview origin may 500; use production or local |

---

## Reconciliation vs child issues

| Issue | Title | Matrix status |
|-------|-------|---------------|
| #178 | Onboarding shell | Closed — Pass |
| #179 | Shared form controls | Closed — Pass |
| #180 | Payment/submission states | Closed — Pass |
| #181 | Partner hub mobile polish | Closed — Pass |
| #182 | Storefront continuity | Closed — Pass |
| #183 | Mobile/a11y QA | This doc — Pass |
| #184 | Evidence pack | This doc — Complete |
