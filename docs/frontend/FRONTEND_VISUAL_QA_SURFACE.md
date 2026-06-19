# Frontend Visual QA Surface — As Built

**Type:** Reference (launch evidence pack)  
**Last updated:** 2026-06-19  
**Evidence source:** Route map, existing QA docs; **browser QA not run in this documentation task**

This document lists surfaces for human visual QA on Vercel preview. It does not assert pass/fail for visual checks.

---

## QA environment

| Item | Value |
|------|-------|
| Target | Vercel **release-candidate preview** (not localhost alone — CORS) |
| Checklist | [../FRONTEND_SMOKE_CHECKLIST.md](../FRONTEND_SMOKE_CHECKLIST.md) |
| Homepage evidence | [../HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md](../HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md) |
| API gate | `GET /api/products/list` → 200 on `/products` |
| Featured gate | `GET /api/featured-products` → 200 (empty array OK) |

---

## Priority launch surfaces

### Public marketplace (consumer)

| Priority | URL | Visual focus |
|----------|-----|--------------|
| P0 | `/` | Hero, featured/ranked section, nav, mobile bottom nav |
| P0 | `/products` | Filter bar, product grid, empty/error states |
| P0 | `/product/[id]` | Detail layout, add-to-cart, images |
| P1 | `/services`, `/service/[slug]` | List + detail + booking UI |
| P1 | `/foods` | Food cards, filters |
| P1 | `/search` | Results + empty state copy |
| P1 | `/vendors` | Vendor grid |
| P1 | `/vendor-profile/product-vendor/[id]` | Storefront layout |
| P2 | `/about`, `/become-a-vendor`, `/faq` | Marketing readability |
| P2 | `/terms`, `/privacy`, legal pages | Legal readability |

### Commerce

| Priority | URL | Visual focus |
|----------|-----|--------------|
| P0 | `/cart` | Line items, guest vs logged-in |
| P0 | `/checkout`, `/checkout/address`, `/checkout/payment` | Stripe Elements, address form |
| P0 | `/payment-success` | Confirmation state |
| P1 | `/checkout/buy-now` | Direct purchase flow |

### Auth

| Priority | URL | Visual focus |
|----------|-----|--------------|
| P0 | `/login?type=customer` | Customer login form |
| P0 | `/login?type=vendor` | Vendor login form |
| P1 | `/signup` | Registration + minority types |
| P1 | `/verify-otp` | OTP entry |
| P1 | `/forgot-password` | Reset flow |

### Customer account

| Priority | URL | Visual focus |
|----------|-----|--------------|
| P1 | `/customer/order` | Order list |
| P1 | `/customer/bookings` | Booking list |

### Vendor onboarding

| Priority | URL | Visual focus |
|----------|-----|--------------|
| P0 | `/partners` | Hub, stage progress, business list |
| P1 | `/partners/tier-selection` | Plan cards |
| P1 | `/partners/business-profile` | Profile form |
| P1 | `/partners/payout-setup` | Stripe Connect CTA |
| P1 | `/partners/add-product` | Multi-step wizard, TipTap |
| P2 | `/partners/final-review` | Review + congratulations |

### Partner dashboard

| Priority | URL | Visual focus |
|----------|-----|--------------|
| P0 | `/partners/dashboard` | Tab navigation, orders/bookings |
| P1 | `/partners/[businessid]` | Overview charts |
| P1 | `/partners/[businessid]/inventory` | Product/service/food tables |
| P1 | `/partners/[businessid]/finance` | Stripe embedded components |
| P2 | `/partners/[businessid]/orders`, `/bookings` | Action buttons, status filters |

### Admin

| Priority | URL | Visual focus |
|----------|-----|--------------|
| P0 | `/signin` | Admin login |
| P0 | `/admin` | Dashboard stats |
| P1 | `/admin/vendor-applications`, `/admin/vendor-applications/[id]` | Review workflow |
| P1 | `/admin/products` | Featured toggle UI |
| P2 | `/admin/categories-management` | Category modals |
| P2 | `/admin/subscription` | Plan table |

---

## Responsive / mobile surfaces

Reference existing mobile QA docs:

- [../MOBILE_APP_NAV_AUDIT.md](../MOBILE_APP_NAV_AUDIT.md)
- [../MOBILE_BOTTOM_NAV_POLISH_QA.md](../MOBILE_BOTTOM_NAV_POLISH_QA.md)
- [../FRONTEND_PARTNER_DASHBOARD_MOBILE_QA.md](../FRONTEND_PARTNER_DASHBOARD_MOBILE_QA.md)

Key mobile chrome: `MobileBottomNav`, `Navbar`, partner dashboard sidebar.

---

## Token / design system checks

| Surface family | Token prefix | Guide |
|----------------|--------------|-------|
| Public marketplace | `market-*` | [../STYLE_GUIDE.md](../STYLE_GUIDE.md) |
| Auth / checkout | `brand-*` | [../STYLE_GUIDE.md](../STYLE_GUIDE.md) |
| Partner dashboard | `surface-*`, `dashboard-*` | [../STYLE_GUIDE.md](../STYLE_GUIDE.md) |

---

## What was NOT tested in this documentation task

- Browser visual inspection
- Screenshot capture
- Cross-browser matrix
- Accessibility audit
- Production domain smoke
- Stripe live-mode payment
- Admin SSO on Vercel preview

---

## Cross-links

- [FRONTEND_MARKETPLACE_SURFACE_MAP.md](FRONTEND_MARKETPLACE_SURFACE_MAP.md)
- [FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md](FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md)
- [FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md](FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md)
