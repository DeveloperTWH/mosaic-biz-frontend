# Cross-Repo Launch Readiness Report

Date: 2026-06-16  
Scope: Mosaic Biz Hub frontend sprint (launch repo). Backend sprint branches not executed in this session.

## 1. Completed issues (frontend, with evidence)

| Issue | Status | Evidence |
|-------|--------|----------|
| #2 Sprint audit | Complete | [docs/FRONTEND_AUDIT_ISSUE_2.md](FRONTEND_AUDIT_ISSUE_2.md) |
| Sentry monitoring setup | Code complete | PR [#1](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/1), [docs/SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md) |
| #9 Clean placeholder copy | Partial | Beta modal removal in PR #19 |
| #3 Homepage polish | Partial | Hero CTAs in PR #19 |
| #4 Discovery UX | Partial | Search labels + empty state in PR #19 |
| #5 Empty states | Partial | Featured/search empty states in PR #19 |
| #10 Card display | Partial | Featured card fallbacks in PR #19 |
| #6 Vendor onboarding UX | Partial | Step progress copy in PR #20 |
| #7 Tier plans UX | Partial | API price + disclaimer in PR #20 |
| #8 Trust indicators | Partial | Honest disclaimers in PR #20 |
| #12 Dashboard UX | Partial | Next steps + orders empty state in PR #20 |
| #11 Cart/checkout smoke | Partial | Payment-success states in PR #21 |
| #13 Admin review | Partial | Removed broken nav links in PR #21 |
| #15 Legal/footer | Partial | Consumer login fix in PR #21 |
| #18 Smoke checklist | Complete | [docs/FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) |

## 2. Partially completed

- **#14 Reviews UI** — Not audited in depth; live reviews use API on product/vendor pages; mock detail routes still exist
- **#16 Responsive pass** — Hero mobile fix in PR #19; vendor dashboard tab overflow remains a manual test item
- **#17 Spotlight/impact** — About page content is approved-style copy; homepage spotlight sections remain commented out

## 3. Blockers

| Blocker | Owner | Notes |
|---------|-------|-------|
| Sentry PR #1 not merged | Team | Requires Vercel env vars before production monitoring |
| Backend sprint not run | Backend agent | Marketplace contract, vendor MVP, Stripe proof pending |
| No E2E smoke run on preview | QA | Checklist created but not executed with evidence |
| `npm run lint` broken on Next 16 | DX | `next lint` directory error — build used as gate |

## 4. Launch risks

- Dual product/service detail routes (live vs mock) may confuse QA and SEO
- Cross-origin auth cookies for partner/customer routes
- Tier card marketing copy still lists features beyond current API `features` flags
- Push-to-main deployment intentionally disabled — manual promote required

## 5. Future phase items

- Consolidate API client patterns into `lib/api.ts`
- Shared marketplace card component
- Remove mock detail routes or redirect to live routes
- Session Replay / advanced Sentry features
- Customer `/dashboard` placeholder replacement
- Backend geolocation/ZIP if not supported

## 6. Frontend PRs to review

| PR | Branch | Focus |
|----|--------|-------|
| [#1](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/1) | `feat/sentry-monitoring` | Sentry + source maps |
| [#19](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/19) | `sprint/frontend-launch-polish` | Hero, cards, search, footer |
| [#20](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/20) | `sprint/frontend-vendor-flow-ux` | Vendor onboarding/dashboard |
| [#21](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/21) | `sprint/frontend-launch-flow-qa` | Checkout states, smoke checklist |

## 7. Backend PRs to review

None created in this session. Run backend prompt pack on `Techware-Hut/mosaic-backend`.

## 8. Tests that passed

- `npm run build` on all four frontend branches (sentry, polish, vendor-ux, flow-qa)

## 9. Tests still needed manually

- Preview deploy smoke per [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md)
- `GET https://api.mosaicbizhub.com/api/featured-products` from deployed frontend
- Cart → checkout → Stripe → payment-success E2E
- Vendor onboarding → admin approval → dashboard E2E
- Sentry error + trace capture after env setup

## 10. Suggested Bryan update message

> Frontend sprint pass 1 is on four review branches (Sentry, launch polish, vendor UX, flow QA). Builds pass locally. Canonical `/api/featured-products` preserved. No merges to main and no production deploy. Next: review PRs #1/#19/#20/#21, set Vercel Sentry env vars, run preview smoke checklist, then start backend sprint branches on mosaic-backend.

## Canonical API confirmation

- Frontend uses **`GET /api/featured-products`** only
- **`/api/products/featured`** is not referenced in the codebase
