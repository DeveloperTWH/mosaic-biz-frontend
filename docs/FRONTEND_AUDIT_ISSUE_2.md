# Frontend Audit — Issue #2

> **Type:** Historical audit (2026-06-16)  
> **Superseded by:** [ARCHITECTURE.md](ARCHITECTURE.md) + [PROJECT_STATUS.md](PROJECT_STATUS.md)  
> Launch blockers below may be stale after sprint PRs and PR #30 redesign.

Repo: `Digital-Builders-757/mosaic-biz-frontend-launch`  
Date: 2026-06-16  
Mode: Read-only audit

## Router

- **App Router only** — 93 `page.tsx` files under `app/`; no `pages/` directory
- Route groups: `(home)`, `(auth)`, `(admin)`, `(partner)` + `app/payment/`
- Middleware: JWT guards on admin/auth paths; partner/customer routes pass through for API cookie auth

## Route map (summary)

| Area | Key routes |
|------|------------|
| Homepage | `/` |
| Marketplace | `/search`, `/products`, `/services`, `/foods`, `/vendors` |
| Detail (live) | `/product/[id]`, `/service/[slug]`, `/vendor-profile/*` |
| Detail (mock) | `/products/[productid]/[id]`, `/services/[id]/[serviceId]` |
| Vendor onboarding | `/become-a-vendor`, `/partners/*` |
| Vendor dashboard | `/partners/dashboard`, `/partners/[businessid]/*` |
| Admin | `/signin`, `/admin/*` |
| Commerce | `/cart`, `/checkout/*`, `/customer/order`, `/payment-success` |
| Auth | `/login`, `/signup`, `/verify-otp`, `/forgot-password` |
| Legal | `/privacy`, `/terms`, `/refund-return`, `/dispute`, trust badge pages |

## Featured products — canonical endpoint

| Endpoint | Status |
|----------|--------|
| `GET /api/featured-products` | **Canonical** — `lib/api/featured-products.ts`, `ShopProducts.tsx`, `FeaturedProducts.tsx` |
| `/api/products/featured` | **Not used** anywhere in codebase |

## API patterns

1. Inline `` `${NEXT_PUBLIC_API_BASE_URL}/api/...` `` (~80+ sites)
2. `lib/api.ts` axios client
3. `lib/api/*` modules

## Sentry (branch `feat/sentry-monitoring`, PR #1)

- `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`
- `app/global-error.tsx`, `lib/sentry/config.ts`
- Env: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ENVIRONMENT` (runtime); `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` (build-only)

## Styling

- Tailwind + `app/globals.css` (Poppins default, brand colors in `tailwind.config.js`)
- No shared `components/ui/` (shadcn)

## Launch blockers

| Priority | Item |
|----------|------|
| P0 | Beta modal on homepage |
| P0 | Hero lacks browse marketplace CTA |
| P1 | Mock detail routes coexist with live routes |
| P1 | Lorem ipsum in visible components |
| P1 | Footer Consumer Login → `#` |
| P1 | Sentry PR not merged to main |
| P2 | Fragmented API clients, multiple card implementations |
| P2 | `/dashboard` placeholder, `/foods/resturant` typo |

## Quick wins (sprint polish)

1. Remove/gate beta modal
2. Hero CTAs: browse + become vendor
3. Replace placeholder copy
4. Fix footer links
5. Card fallbacks for missing image/price/vendor
6. Consistent empty states
7. Hide unwired filters

## Suggested branch order

1. `feat/sentry-monitoring` (PR #1)
2. `sprint/frontend-launch-polish` (#9, #3, #4, #5, #10)
3. `sprint/frontend-vendor-flow-ux` (#6, #7, #8, #12)
4. `sprint/frontend-launch-flow-qa` (#11, #13–#18)
