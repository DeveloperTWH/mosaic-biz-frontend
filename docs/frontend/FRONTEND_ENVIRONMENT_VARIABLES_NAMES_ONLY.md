# Frontend Environment Variables — Names Only

**Type:** Reference (launch evidence pack)  
**Last updated:** 2026-06-19  
**Evidence source:** ripgrep `process.env.[A-Z0-9_]+` across `*.{ts,tsx,js,mjs}`, `README.md`, `next.config.ts`, Sentry docs

**Rule:** This document lists **names and purpose only**. No values are printed or committed.

---

## Required for core functionality

| Name | Purpose | Referenced in |
|------|---------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API root URL | `lib/api.ts`, most API call sites |
| `NEXT_PUBLIC_APP_URL` | Frontend origin for metadata / OG | `app/(home)/layout.tsx` |

---

## Payments and maps

| Name | Purpose | Referenced in |
|------|---------|---------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements / Connect client | checkout pages, `utils/stripe.ts`, tier checkout |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps / Places | cart address, service maps, inventory forms |

---

## Frontend origin (checkout)

| Name | Purpose | Referenced in |
|------|---------|---------------|
| `NEXT_PUBLIC_CLIENT_BASE_URL` | Optional fallback origin for Stripe `return_url` when no browser origin is available | `lib/url/appUrl.ts` |

**Note:** Stripe return URLs use `lib/url/appUrl.ts`, which prefers the current browser origin and falls back to configured public env values. Production login should run on `app.mosaicbizhub.com` so the frontend and API share the same Mosaic-owned site.

---

## Optional / feature flags

| Name | Purpose | Referenced in |
|------|---------|---------------|
| `NEXT_PUBLIC_RANKED_PATH` | Override ranked listing API path (default `/api/ranked`) | `ShopProducts.tsx`, `ProductsClient.tsx` |
| `NEXT_PUBLIC_AUTH_DEBUG` | Verbose auth logging in non-production | `utils/authDebug.ts` |
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side Sentry error reporting | `lib/sentry/config.ts`, Sentry instrumentation |

---

## Server / middleware (not NEXT_PUBLIC)

| Name | Purpose | Referenced in |
|------|---------|---------------|
| `JWT_SECRET` | JWT verification in middleware | `middleware.ts` |

---

## Sentry build-time (never NEXT_PUBLIC)

| Name | Purpose | Referenced in |
|------|---------|---------------|
| `SENTRY_ORG` | Sentry org slug for source maps | `next.config.ts` |
| `SENTRY_PROJECT` | Sentry project slug | `next.config.ts` |
| `SENTRY_AUTH_TOKEN` | Source map upload token | `next.config.ts` |
| `SENTRY_ENVIRONMENT` | Sentry environment tag | `lib/sentry/config.ts` |

---

## Framework / runtime (automatic)

| Name | Purpose | Referenced in |
|------|---------|---------------|
| `NODE_ENV` | development / production | various |
| `NEXT_RUNTIME` | nodejs / edge for instrumentation | `instrumentation.ts` |
| `CI` | Sentry silent mode toggle | `next.config.ts` |

---

## Local development minimum (names only)

Per `README.md`:

```
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_APP_URL
```

Also typically needed for full flows (names only):

```
JWT_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_GOOGLE_MAPS_KEY
NEXT_PUBLIC_CLIENT_BASE_URL
```

---

## Cross-links

- [FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md)
- [../SENTRY_VERCEL_SETUP.md](../SENTRY_VERCEL_SETUP.md)
