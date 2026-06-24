# Frontend Runtime Test Gaps

Date: 2026-06-24
Branch: `polish/frontend-final-launch-pass`
Production frontend target: `https://mosaicbizhub.com`
API target: `https://api.mosaicbizhub.com`

The final frontend pre-cutover pass added mocked automated evidence and fixed scoped frontend defects. The following items still require live runtime QA before production cutover decisions.

## Required Live QA

| Area | Needed Evidence | Why Mocked Evidence Is Not Enough |
| --- | --- | --- |
| Registration | New customer and vendor registration on final domain, API 201, email OTP delivery | SMTP, final-domain CORS, and cookie behavior are live-system dependent |
| OTP verification | Verify valid OTP, resend OTP, expired/invalid OTP, post-verify session | Requires fresh OTP inbox and live cookie session |
| Login/session | Customer, vendor, and admin login followed by `GET /api/users/auth/check` | Confirms real cookies and role redirects on `mosaicbizhub.com` |
| Logout | Logout clears server and client session state | Requires live cookie clearing confirmation |
| Rejected vendor edit/resubmit | Rejected application can edit, save draft, and explicitly resubmit | Requires a controlled rejected vendor account |
| Vendor dashboard | Product, service, and food vendors see correct dashboard tabs and empty states | Mocked data cannot prove real listing-type coverage |
| Product delete | Delete route succeeds against a vendor-owned product in a non-production-safe test account | Automated evidence only opens the confirmation and unit-tests the path |
| Public listings | Real products/services/foods filter by badge, state, city, country, category, price, and page | Mocked evidence proves frontend serialization, not data correctness |
| Product/service/food details | Real details render images, prices, reviews, vendor info, booking forms | Mocked evidence cannot validate real media or populated review data |
| Cart | Guest cart, auth cart, merge, mini product/variant lookups, single-vendor rule | Requires live account and real eligible vendor products |
| Checkout/order initiation | `POST /api/orders/initiate`, Stripe client secret, payment success retrieval | Must be run only with written payment-test approval |
| Stripe Connect | Status, account-link, return URL, refresh URL with real test connected account | Requires Stripe dashboard/test account evidence |
| Admin vendor review | Pending list, detail page, document verify/unverify, finalization | Verify/finalize are destructive and need explicit approval |
| Build identity | `/api/build-info` on production preview/final domain | Confirms deployed SHA matches GitHub evidence |

## Known Product Decisions

- Food price filtering is serialized through the shared helper, but exposing the same visible food price UX as products/services remains a product decision.
- The URL helper still allows the legacy app subdomain as a transition origin while defaulting production canonical/share URLs to `https://mosaicbizhub.com`.
- Auth pages still use existing `<img>` markup; this pass fixed overflow without replacing image rendering primitives.

## Safe Test Boundaries

- Do not run live Stripe payments without written approval.
- Do not finalize or reject live vendor applications without written approval.
- Do not invent production vendors, counts, reviews, or locations to make QA pass.
- Do not resolve Sentry or GitHub issues solely from mocked evidence; only clear issues that the live or automated evidence actually covers.

## Suggested Runtime Order

1. Confirm deployed SHA through `/api/build-info`.
2. Run final-domain auth smoke: register, OTP, login, auth check, logout.
3. Run public marketplace smoke: homepage, products, services, foods, search, badge/location filters.
4. Run vendor smoke with controlled accounts: onboarding, dashboard, listing management, product delete confirmation.
5. Run cart/checkout dry run until the payment boundary.
6. Run Stripe Connect and payment tests only after explicit approval.
7. Run admin review smoke with non-destructive actions first; finalize only after explicit approval.

This frontend is not marked launch-ready by this document.
