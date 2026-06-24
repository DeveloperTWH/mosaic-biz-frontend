# Pre-QA GitHub Issue Sweep

Date: 2026-06-23
Branch: `codex/pre-qa-issue-sweep`
Base: `launch/develop`

## Repositories Scanned

- `Digital-Builders-757/mosaic-biz-frontend-launch`: 31 open issues
- `Techware-Hut/mosaic-biz-frontend`: 0 open issues
- `Techware-Hut/mosaic-backend`: 15 open issues

## Frontend Work Completed

- Updated stale Playwright expectations to match the current production-facing UI language and accessible controls.
- Replaced strict product-title text locators with heading locators so product detail tests no longer fail on breadcrumb and hero duplicates.
- Changed the legacy checkout-address buy-now lookup from owner-protected `GET /api/product/:id` to public `GET /api/public/product/:id`.
- Updated the shared product helper to use the public product detail endpoint.
- Replaced placeholder `/foods/shop/[id]` and `/dashboard` pages with redirects to live app surfaces.

## Verification

- `npm run build`: pass
- `npm run test:unit`: pass, 22 passed
- `npm run test:e2e`: pass, 71 passed, 4 skipped

Known non-blocking warnings:

- Next.js inferred a workspace root because there is also a lockfile at `C:\Users\young\package-lock.json`.
- Next.js reports the `middleware` file convention is deprecated in favor of `proxy`.

## Frontend Issue Triage

The following frontend issues should stay open because they require product/design acceptance, production proof, or dedicated implementation beyond this pre-QA test stabilization branch:

- #196 trust proof near CTAs
- #195 About/Contact/How-to brand alignment
- #193 public browse card unification
- #192 search and low-inventory redesign
- #188 launch stabilization parent
- #165 frontend release identity and Sentry release tagging
- #139 raw `img` to `next/image` lint debt
- #138 Sentry production verification
- #124 Vercel domain ownership and launch domain setup
- #121 trust badge language audit
- #119 analytics event map
- #117 form UX microcopy
- #115 screenshot regression harness
- #113 SEO metadata and share previews
- #112 image optimization and Core Web Vitals audit
- #111 loading/empty/error state system
- #110 design-system tokens and shared primitives
- #109 frontend quality systems epic
- #83 vendor profile storefront redesign
- #37 vendor self-service API sync
- #35 duplicated public listing components
- #14 reviews UI and rating flow launch check

#194 is partially evidenced by the current app state: the homepage hero no longer exposes a null-auth placeholder path in `Hero.tsx`, and the e2e suite verifies the current CTA. Keep it open until desktop/mobile screenshot acceptance confirms the full above-the-fold hierarchy.

## Backend-Coordination Issues In Frontend Repo

These issues are intentionally not closed from the frontend sweep because their acceptance criteria require backend commits, backend test evidence, production smoke proof, or environment access:

- #172 isolated backend integration tests
- #171 backend release identity and Sentry release tagging
- #170 lifecycle state contracts and route duplication governance
- #169 admin/moderation audit trail
- #168 refund, return, and dispute workflow audit
- #167 route authorization matrix and negative-access tests
- #166 API error envelopes and request correlation IDs

The backend repo already contains some related docs and tests, but these tickets should only close with explicit backend branch/commit evidence and the required command results.

## Backend Issue Triage

Keep the backend issues open for now:

- #84, #83, #82, #27: production smoke, EB env, Stripe Connect domain, and launch proof require environment access and runtime evidence.
- #76, #71, #70, #60, #55, #52, #46: audit/refactor/contract work requires dedicated backend PRs or existing dirty docs branch review.
- #35, #34: reviews and admin dashboard APIs are feature/coverage checks, not closed by this frontend branch.
- #19: GitHub OIDC IAM tightening requires AWS/IAM evidence from the successful deploy run.

## QA Recommendation

Merge this branch into `develop`, deploy a preview, then run QA against the preview. Do not bulk-resolve GitHub or Sentry issues yet. Resolve only the issues with merged code and matching acceptance evidence; leave production, domain, Sentry, Stripe Connect, and backend proof tickets open until those checks are run against the deployed environment.
