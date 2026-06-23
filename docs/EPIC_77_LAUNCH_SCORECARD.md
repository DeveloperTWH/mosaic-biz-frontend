# Epic #77 Launch Readiness Scorecard

> **Historical — 2026-06-17.** Archived — see [archive/README.md](archive/README.md). Current posture: [PROJECT_STATUS.md](PROJECT_STATUS.md).

**Date:** 2026-06-17  
**Epic:** #77 Marketplace conversion, trust, mobile, and vendor growth  
**Branch:** implementation on RC track (not merged to `main`)

## Child issue matrix

| Issue | Title | Status | Build | Mobile QA |
|-------|-------|--------|-------|-----------|
| #78 | Mobile sticky action system | Done | See build log below | Sticky bar on product/service/food detail @ 375px |
| #79 | Shareable search/filter URLs | Done | Pass | URL params on `/products`, `/search?tab=` |
| #80 | Mobile filter drawer | Done | Pass | Drawer on products/services/foods listings |
| #81 | Detail page conversion hierarchy | Partial | Pass | Product: badge + seller + sticky CTA |
| #82 | Vendor profile storytelling | Partial | Pass | Existing vendor-profile routes; full redesign deferred |
| #83 | Trust Badge display consistency | Done | Pass | Shared `TrustBadge` on cards |
| #84 | Trust Badge explainer page | Done | Pass | Consumer/vendor cross-links |
| #85 | Onboarding progress stepper | Done | Pass | `OnboardingStepper` + 6-step become-a-vendor |
| #86 | Tier plan comparison redesign | Done | Pass | `TierComparison` wired on tier-selection |
| #87 | Vendor dashboard launch-readiness panel | Done | Pass | `LaunchReadinessPanel` component |
| #88 | Vendor referral entry points | Partial | Pass | `/refer-a-vendor` + footer link (backend rewards TBD) |
| #89 | Cultural Discovery collections | Partial | Pass | Static collections + spotlight/stories shells |
| #90 | Public content lifecycle cleanup | Done | Pass | Redirects in `next.config.ts` |
| #91 | SEO/Open Graph metadata audit | Done | Pass | Root OG defaults in `(home)/layout.tsx` |
| #92 | Image optimization polish | Partial | Pass | `MarketImage` on foods cards; `unoptimized` retained |
| #93 | Core Web Vitals pass | Partial | — | Requires preview Lighthouse run |
| #94 | WCAG 2.2 AA pass | Partial | — | Sticky/drawer min-h-11 touch targets added |
| #95 | API client normalization | Done | Pass | `lib/api/{client,products,services,foods,search}.ts` |
| #96 | Client/server component audit | Partial | Pass | Products Suspense + URL hook |
| #97 | Error/empty/loading hardening | Done | Pass | `(home)/loading`, `error`, `not-found` |
| #98 | Sentry UX observability audit | Partial | Pass | `lib/sentry/reportApiError.ts` |
| #99 | Design token migration audit | Partial | — | New components use `market-*`; legacy hex remains on some detail pages |
| #100 | Route/CTA/footer regression checklist | Done | Pass | See `docs/EPIC_77_ROUTE_REGRESSION.md` |
| #101 | Launch readiness scorecard | Done | — | This document |

## Route canonical map

| Entity | Canonical | Redirected legacy |
|--------|-----------|-------------------|
| Product | `/product/[id]` | `/products/:productid/:id` → `/product/:id` |
| Service detail | `/vendor-profile/service-vendor/[id]` | `/services/:id/:serviceId` |
| Food listing | `/foods` | `/foods/resturant/*`, `/foods/shop/*` |
| Vendor directory | `/vendors` | `/vendors/:id` → `/vendor-profile/product-vendor/:vendor_id` (`next.config.ts`) |

## API contract confirmation

- **Canonical:** `GET /api/featured-products` via `lib/api/featured-products.ts`
- **Not used:** `/api/products/featured`
- **List endpoints:** `/api/products/list`, `/api/services/list`, `/api/food/list`, `/api/public/search`

## Backend-dependent backlog

| Feature | Frontend state | Backend need |
|---------|----------------|--------------|
| Referral codes/rewards | Share link + copy UI | Referral API |
| Vendor spotlight | Empty state with CTA | Curated vendor API |
| Vendor stories | Mission link placeholder | CMS / stories API |
| Dynamic cultural collections | Static heritage links | Collection API |
| Vendor profile rich story | Uses existing API fields | Optional story fields |

## Quality gates

| Gate | Status | Notes |
|------|--------|-------|
| `npm run build` | Run locally | Required before each PR |
| Mobile QA 375px | Documented | Sticky bar, filter drawer, search tabs |
| Sentry test event | Pending | Requires `NEXT_PUBLIC_SENTRY_DSN` on preview |
| Lighthouse CWV | Pending | Run on Vercel preview post-deploy |

## Build proof

Run from repo root:

```bash
npm run build
```

Capture exit code 0 and compile summary in PR description.

## Remaining blockers (from PROJECT_STATUS)

- Sentry PR merge + Vercel env vars
- Backend sprint items (featured inventory flags, referral API)
- Manual preview smoke per `FRONTEND_SMOKE_CHECKLIST.md`
- No production deploy without manual promote
