# Domain Migration URL Inventory

Updated: 2026-06-24

## Current Architecture Truth

The prior `app.mosaicbizhub.com` canonical-domain plan is superseded. Do not prepare a `develop -> main` production release until this apex-domain correction is merged with the matching backend correction and the external cutover checklist is complete.

| URL | Role | Frontend Policy |
| --- | --- | --- |
| `https://mosaicbizhub.com` | Canonical production marketplace frontend | Default for frontend URL helpers, metadata, canonical URLs, share links, and non-browser fallbacks |
| `https://www.mosaicbizhub.com` | Alias for the marketplace | Should redirect to the equivalent apex path; not a separate app fallback |
| `https://app.mosaicbizhub.com` | Temporary transition / legacy app origin | May keep working during cutover through runtime browser-origin behavior, then should redirect to apex after approval |
| `https://mosaic-biz-frontend-launch.vercel.app` | Temporary QA / preview origin | Approved for QA and preview while DNS is being moved |
| `https://api.mosaicbizhub.com` | Canonical backend API | `NEXT_PUBLIC_API_BASE_URL` target only; never a frontend origin |

## Runtime References

| Area | File | Behavior |
| --- | --- | --- |
| App URL helper | `lib/url/appUrl.ts` | Defaults to `https://mosaicbizhub.com`, respects the current browser origin for preview/transition flows, supports `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_CLIENT_BASE_URL`, and rejects the API hostname as a frontend origin |
| SEO metadata | `lib/seo/metadata.ts` | Uses the configured app origin and falls back to `https://mosaicbizhub.com` |
| API client | `lib/api.ts` | Calls `NEXT_PUBLIC_API_BASE_URL` or `https://api.mosaicbizhub.com/` |
| Refer-a-vendor share fallback | `app/(home)/refer-a-vendor/page.tsx` | Uses `https://mosaicbizhub.com/become-a-vendor` when `window.location.origin` is unavailable |
| Stripe return URLs | Checkout/tier checkout pages | Use `buildAppUrl(...)`, so browser runtime origins remain safe for preview while production fallback is apex |
| Stripe Connect frontend flow docs | `docs/STRIPE_CONNECT_FRONTEND_FLOW.md` | Documents apex return and refresh paths; backend owns final Connect URL construction |

## Occurrence Classification

| Pattern | Classification |
| --- | --- |
| `https://mosaicbizhub.com` | Canonical production marketplace frontend |
| `https://www.mosaicbizhub.com` | Redirect-only alias; docs or legal copy should prefer apex |
| `https://app.mosaicbizhub.com` | Temporary transition / historical evidence only; not a production fallback |
| `https://mosaic-biz-frontend-launch.vercel.app` | QA / preview origin |
| `https://api.mosaicbizhub.com` | Backend API base URL only |

## Environment Variables

Names only; do not commit values.

| Env var | Production classification |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Apex marketplace origin |
| `NEXT_PUBLIC_CLIENT_BASE_URL` | Apex marketplace origin if still required as a fallback |
| `NEXT_PUBLIC_API_BASE_URL` | API subdomain |
| `NEXT_PUBLIC_SENTRY_DSN` | Unchanged; client Sentry DSN if enabled |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Unchanged environment tag if configured |
| `NEXT_PUBLIC_SENTRY_RELEASE` | Unchanged release tag if configured |

## Verification Commands

```powershell
npm run test:unit
npm run build
npm run lint
rg -n "app\.mosaicbizhub\.com|www\.mosaicbizhub\.com|mosaicbizhub\.com|mosaic-biz-frontend-launch\.vercel\.app|api\.mosaicbizhub\.com" app components lib docs
rg -n "/api/products/featured" app components lib --glob "*.{ts,tsx}"
rg -n "/api/featured-products" app components lib --glob "*.{ts,tsx}"
```

Expected: no `/api/products/featured`; `GET /api/featured-products` remains canonical.
