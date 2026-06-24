# Root Domain Cutover Checklist

Updated: 2026-06-24

This checklist is names-only and value-safe. It records work humans must complete before a production release after the canonical frontend changes from `app.mosaicbizhub.com` to `mosaicbizhub.com`.

## Release Gate

- Do not open or merge a `develop -> main` release PR until the frontend and backend correction PRs are merged into their integration branches.
- Do not deploy until DNS ownership, Vercel domain attachment, backend CORS/cookie behavior, auth smoke, and Stripe return URLs are verified.

## GoDaddy / DNS

- Attach `mosaicbizhub.com` to the rebuilt Vercel frontend project using the record targets supplied by Vercel and GoDaddy.
- Configure `www.mosaicbizhub.com` as an alias that redirects to the apex while preserving path and query string.
- Decide the transition behavior for `app.mosaicbizhub.com`; keep it available only until apex authenticated smoke tests pass, then redirect it to the apex after approval.
- Preserve `api.mosaicbizhub.com` pointing to the backend.
- Do not delete unrelated TXT, MX, DKIM, SPF, DMARC, verification, or mail records.

## Vercel

- Attach `mosaicbizhub.com` to `Digital-Builders-757/mosaic-biz-frontend-launch`.
- Set the apex as the primary production domain.
- Configure `www` to redirect to the apex.
- Keep `mosaic-biz-frontend-launch.vercel.app` available for QA/preview.
- Confirm no separate legacy Vercel project still claims the apex or `www`.
- Update env var names only: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CLIENT_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, Sentry public env names if used.

## AWS / Backend Coordination

- Backend `FRONTEND_URL` should classify the apex as the production frontend.
- Backend `CORS_ORIGINS` should explicitly include apex plus any approved transition/QA origins; no wildcard.
- Do not automatically change `COOKIE_DOMAIN`; verify whether `.mosaicbizhub.com` is required for API/frontend cookie sharing.

## Stripe

- Checkout return URLs should resolve to the apex in production.
- Stripe Connect return and refresh URLs should resolve to the apex paths.
- Billing portal return URL should resolve to the apex.
- Subscription success/cancel URLs should resolve to the apex.
- Verify Stripe Dashboard allowlisted domains or return URLs without changing payment logic.

## Google OAuth

- Backend callback remains on `https://api.mosaicbizhub.com`.
- Frontend post-auth redirect should resolve to the apex in production.
- Authorized JavaScript origins, if configured, should include the apex and any approved temporary QA origin.

## Email Links

Audit generated links for verification, password reset, welcome, vendor application status, order confirmation, invitations, and referrals. Destination origin should be apex unless the link is explicitly for API callbacks or temporary QA.

## Sentry

- Keep environment and release reporting intact.
- Update host/domain labels in dashboards or alerts if they distinguish old app vs apex frontend host.

## Post-Cutover Smoke

1. `https://mosaicbizhub.com/` loads the rebuilt frontend.
2. `https://www.mosaicbizhub.com/products?x=1` redirects to the equivalent apex URL.
3. Old `app` subdomain follows the approved transition behavior.
4. `https://api.mosaicbizhub.com/` remains the API.
5. CORS preflight from apex succeeds with credentials.
6. CORS preflight from an unapproved origin fails.
7. Customer login, business-owner login, and logout work.
8. Google OAuth returns to the apex.
9. Verification and email links return to the apex.
10. Stripe checkout, Connect, billing portal, and subscription returns land on apex paths.
11. Marketplace browsing still calls `https://api.mosaicbizhub.com`.
12. Featured products use `GET /api/featured-products`; no code uses `/api/products/featured`.
