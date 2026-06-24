# Domain Migration URL Inventory

Updated: 2026-06-24

## Current architecture truth

| URL | Role | Frontend policy |
| --- | --- | --- |
| `https://mosaicbizhub.com` | Separate community and landing website | Not the marketplace app origin and not an app fallback |
| `https://app.mosaicbizhub.com` | Marketplace app hostname after DNS is repointed to Vercel | Production app default for frontend URL helpers and metadata |
| `https://mosaic-biz-frontend-launch.vercel.app` | Rebuilt Next.js frontend on Vercel | Transition, fallback, and QA origin until the app hostname is cut over |
| `https://api.mosaicbizhub.com` | AWS backend API | `NEXT_PUBLIC_API_BASE_URL` target for browser API calls |

`https://app.mosaicbizhub.com` may still show the legacy frontend until DNS is repointed. This repo treats it as the intended marketplace app hostname so Stripe, OAuth, share links, and metadata do not fall back to the separate root community site.

## Runtime references

| Area | File | Behavior |
| --- | --- | --- |
| App URL helper | `lib/url/appUrl.ts` | Defaults to `https://app.mosaicbizhub.com`, respects the current browser origin at runtime, and supports `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_CLIENT_BASE_URL` when configured |
| SEO metadata | `lib/seo/metadata.ts` | Uses the configured app origin and falls back to `https://app.mosaicbizhub.com` |
| API client | `lib/api.ts` | Calls `NEXT_PUBLIC_API_BASE_URL` or `https://api.mosaicbizhub.com/` |
| Refer-a-vendor share fallback | `app/(home)/refer-a-vendor/page.tsx` | Uses `https://app.mosaicbizhub.com/become-a-vendor` when `window.location.origin` is unavailable |
| Stripe Connect frontend flow docs | `docs/STRIPE_CONNECT_FRONTEND_FLOW.md` | Documents app-host return and refresh URLs |

## Occurrence classification

| Pattern | Classification |
| --- | --- |
| `https://app.mosaicbizhub.com` | Intended production marketplace app host after DNS cutover |
| `https://mosaic-biz-frontend-launch.vercel.app` | Current rebuilt Vercel app origin for transition and QA |
| `https://api.mosaicbizhub.com` | Backend API base URL only |
| `https://mosaicbizhub.com` / `https://www.mosaicbizhub.com` | Community site or parent-domain text only; no frontend runtime fallback should substitute app URLs to these hosts |

## Verification commands

```powershell
npm run test:unit
npm run build
rg -n "mosaicbizhub\.com|mosaic-biz-frontend-launch\.vercel\.app|api\.mosaicbizhub\.com" app components lib docs scripts
```
