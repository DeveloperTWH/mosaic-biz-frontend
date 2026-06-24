# Frontend Post-Integration Evidence

Date: 2026-06-24  
Repository: `Digital-Builders-757/mosaic-biz-frontend-launch`  
Integration branch audited: `develop`  
Audited `develop` SHA: `5d35b4ddd3dec596bec61b686b5b92f895417e6e`  
Working branch for this pass: `fix/frontend-post-integration-reconciliation`

## Scope

This pass reconciled the integrated frontend work against the backend `staging` route surface and the June 24 regression documents. It was not a production release, deploy, main-branch merge, or broad rewrite.

## Repository State

| Item | Evidence |
| --- | --- |
| Remote sync | `git fetch --all --prune`; `git pull --ff-only origin develop` returned already up to date |
| Working tree before edits | Clean after removing generated local `.codex-dev-server-3001.log` |
| Open frontend PRs observed | `#211` to `develop`: `feat/frontend-vendor-dashboard-visual-system-pass` |
| Latest integrated PR | `#213` merged into `develop`: frontend launch marketplace regression recovery |
| Backend reference | `Techware-Hut/mosaic-backend` `staging` SHA `88ed0781707df4a54f78a210218001b46b3d20cf` |

## Integrated Work Observed

| Area | Evidence |
| --- | --- |
| Apex domain correction | `lib/url/appUrl.ts` defaults to `https://mosaicbizhub.com`, preserves `app.mosaicbizhub.com` and Vercel launch origin as transition origins, and rejects `https://api.mosaicbizhub.com` as a frontend origin |
| Stripe return URLs | Checkout and partner payment surfaces call `buildAppUrl(...)`, which prefers the current browser origin and falls back to the apex origin |
| Marketplace regression recovery | Shared search params now send state filters as `state`; service/product badge filters use backend-facing lower-case values; public count logic is tested |
| Product delete route | `lib/api/vendorProducts.ts` calls canonical `DELETE /api/product/delete-product/:productId` with credentials |
| Featured products route | App code uses `GET /api/featured-products`; no active app-code match for `/api/products/featured` |

## Fix Applied In This Pass

| Defect | Resolution |
| --- | --- |
| Legacy `/service/[slug]` booking form posted to stale `POST /api/bookings/create`, which is not registered by the backend | Updated `app/(home)/service/[slug]/page.tsx` to use `createServiceBooking(...)`, the same helper used by the canonical service vendor profile |
| Service booking helper inserted raw service IDs into the path | Updated `lib/api/serviceBookings.ts` to encode the service ID |
| Regression protection | Added `lib/api/serviceBookings.test.ts` covering route, credentials, request body, and unauthenticated customer messaging |

## External Regression Documents Reviewed

The four requested DOCX files were found in `C:\Users\young\Downloads`:

| Document | Frontend interpretation |
| --- | --- |
| `TEST RESULTS 24-06.docx` | Most items are marked `COULD NOT BE TESTED` because fresh registration/OTP could not be completed with the provided accounts. These are not treated as proven frontend failures. |
| `MBH Technical Regression Analysis (1).docx` | Provided claims for OTP, DTO shape, onboarding, marketplace filters, delete routes, Stripe Connect visibility, counts, and booking/checkout coverage. Current code and tests supersede several stale claims. |
| `PROJECT ALIGNMENT DOCUMENT.docx` | Process and responsibility document. It supports evidence-led gating and single workflow discipline; it is not a route defect source. |
| `BACKEND UPDATE IMPACT TO FRONTEND.docx` | Validates why the frontend needs tolerant DTO parsing, Decimal128 price handling, business ID object/string handling, and checkout retesting. |

## Verification

| Command/check | Result |
| --- | --- |
| `npm run test:unit` before fix | Pass: 64/64 |
| `npm run test:unit` after fix | Pass: 66/66 |
| `npm run build` after fix | Pass. Next.js compiled, TypeScript ran, 69 static pages generated. Warnings: workspace root inference and deprecated `middleware` convention. |
| `npm run test:screenshots` | Pass: 10/10 public route viewport checks using mocked APIs. Routes: home, products, services, vendors, search. Viewports: mobile 390, desktop 1366. |
| `npm run lint` | Fails repo-wide existing lint debt: 557 problems, 321 errors, 236 warnings. This pass did not attempt a broad lint cleanup. |
| Targeted lint on touched files | Pass with 0 errors. Remaining warnings are two existing `<img>` warnings in the legacy service page. |
| Typecheck | No separate `typecheck` script exists; `next build` runs TypeScript. |
| Stale booking route scan | No active app-code matches for `/api/bookings/create` after this pass. |

## Launch Gate

| Priority | Gate | Status | Evidence/action |
| --- | --- | --- | --- |
| P0 | Fresh customer and business-owner registration through OTP on the final frontend domain | Open | Not completed in this pass; requires dedicated test accounts and live email delivery confirmation |
| P0 | Apex domain cutover and authenticated cookie behavior | Open | Code supports apex, but DNS/Vercel production cutover and browser cookie smoke still require human execution |
| P0 | Live checkout/order and Stripe payment authorization | Open | Not tested; requires written approval before live or test-payment execution |
| P0 | Admin approve/reject on real fresh application | Open | Not executed; destructive/admin workflow requires controlled QA account |
| P1 | Frontend repo-wide lint | Open | Existing lint debt remains |
| P1 | Product count and marketplace inventory live data validation | Partial | Code uses API `total`; live data still needs QA confirmation |
| P1 | Food price ceiling product decision | Open | Backend retains `price=all` opt-out; default behavior needs product decision |
| P2 | Legacy route cleanup | Partial | One stale booking caller fixed; legacy service/product/food redirect strategy still needs broader product decision |

## Conclusion

The integrated frontend branch is substantially closer to the documented contract, and one additional proven route mismatch was fixed. The frontend should not be called launch-ready until the P0 gates above are completed on the final production domain with fresh accounts.
