# Frontend Architecture

**Type:** Reference  
**Last updated:** 2026-06-23

Supersedes the operational parts of [FRONTEND_AUDIT_ISSUE_2.md](FRONTEND_AUDIT_ISSUE_2.md) (historical — see [archive/README.md](archive/README.md)). Platform behavior: [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md). Current status: [PROJECT_STATUS.md](PROJECT_STATUS.md). API endpoints: [API_CONTRACTS.md](API_CONTRACTS.md). Auth deep dive: [frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md).

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React, Tailwind CSS, shared `components/ui/` |
| HTTP | axios (`lib/api.ts`) and inline `fetch` |
| Auth | API cookie session + optional JWT cookies; see [Authentication](#authentication) |
| Deploy | Vercel — auto-deploy on merge to `main` |
| Monitoring | Sentry (`@sentry/nextjs` in `next.config.ts`) — configure DSN per [SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md) |

---

## Repository and branches

| Item | Value |
|------|--------|
| Launch GitHub repo | `Digital-Builders-757/mosaic-biz-frontend-launch` |
| Integration branch | `develop` |
| Production branch | `main` |
| Branching model | Feature → `develop` → `main` — [GIT_WORKFLOW.md](GIT_WORKFLOW.md) |
| Local remote | Often `launch` or `origin` — confirm with `git remote -v` |
| Production deploy | Vercel auto-deploy on merge to `main` |

All feature work merges into **`develop` first**. Production changes ship when **`develop` is merged into `main`**. Do not open routine PRs directly into `main`.

---

## App Router layout

**App Router only** — pages under `app/`; no `pages/` directory.

| Route group | Purpose | Examples |
|-------------|---------|----------|
| `(home)` | Public marketplace, checkout, partner onboarding hub | `/`, `/products`, `/cart`, `/partners`, `/become-a-vendor` |
| `(auth)` | Login, signup, OTP, forgot password | `/login`, `/signup`, `/verify-otp` |
| `(admin)` | Admin console | `/admin`, `/admin/vendor-applications` |
| `(partner)` | Partner dashboard (business-scoped) | `/partners/[businessid]`, `/partners/dashboard` |
| `app/payment/` | Legacy/alternate payment routes | `/payment`, `/payment/success` |

### Route map (summary)

| Area | Key routes |
|------|------------|
| Homepage | `/` |
| Marketplace listings | `/products`, `/services`, `/foods`, `/vendors`, `/search` |
| Detail (live) | `/product/[id]`, `/service/[slug]`, `/vendor-profile/product-vendor/[id]`, `/vendor-profile/service-vendor/[id]` |
| Detail (mock — avoid for QA/SEO) | `/products/[productid]/[id]`, `/services/[id]/[serviceId]` |
| Vendor onboarding | `/become-a-vendor`, `/partners/*` |
| Commerce | `/cart`, `/checkout/*`, `/payment-success` |
| Auth | `/login?type=customer`, `/login?type=vendor`, `/signup` |
| Legal | `/privacy`, `/terms`, `/refund-return`, `/dispute`, trust badge pages |

---

## Environment variables

Set in `.env.local` for local dev (never commit secrets). Vercel project settings for preview/production.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API root, e.g. `https://api.mosaicbizhub.com` |
| `NEXT_PUBLIC_APP_URL` | Yes | Frontend origin, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_SENTRY_DSN` | Recommended | Client error reporting — see [SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md) |
| `SENTRY_ENVIRONMENT` | With Sentry | `development` / `preview` / `production` |
| `NEXT_PUBLIC_RANKED_PATH` | Optional | Override ranked API path (default `/api/ranked`) |

Default API base in [`lib/api.ts`](../lib/api.ts):

```typescript
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.mosaicbizhub.com/"
```

**Local dev note:** Pointing `NEXT_PUBLIC_API_BASE_URL` at production from `localhost` often hits **CORS** in the browser. Use a local backend on `:3001` for full UI dev, or QA on Vercel preview where CORS is allowlisted.

---

## Deployment model

```mermaid
flowchart LR
  feature[Feature branch] --> develop[develop]
  develop --> devPreview[Develop preview / QA]
  develop --> main[main]
  main --> prod[Production]
  feature --> preview[Feature preview]
```

- Feature branches produce **Preview** deployments on push/PR.
- **`develop`** is the integration preview — run smoke QA here before production.
- **`main`** auto-deploys to **production** on merge (Vercel).
- Previews may require **Vercel SSO** (HTTP 401 for unauthenticated requests).
- Resolve preview URLs from the Vercel dashboard or GitHub deployment API on the launch repo.

See [GIT_WORKFLOW.md](GIT_WORKFLOW.md) for the full branching standard.

---

## API client patterns

Three patterns coexist (consolidation is a future refactor — see [ROADMAP.md](ROADMAP.md)):

1. **Inline** — `` `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/...` `` in components (most common)
2. **Axios instance** — [`lib/api.ts`](../lib/api.ts) with `withCredentials: true`
3. **Domain modules** — [`lib/api/featured-products.ts`](../lib/api/featured-products.ts), `lib/api/products-admin.ts`, etc.

Prefer `lib/api/*` for new shared calls; match surrounding file conventions when editing existing pages.

---

## Authentication

Three layers (full detail: [frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md)):

1. **API HTTP cookies** (primary) — login/register/OTP/logout with `credentials: 'include'`; session via `GET /api/users/auth/check` on the API host
2. **localStorage hints** (UI only) — `user_session`, `user_role` for navbar state
3. **Legacy JWT cookies** — `token` / `auth_token` read by middleware when present

### Middleware ([`middleware.ts`](../middleware.ts))

Matcher: `/admin/*`, `/partners/*`, `/customer/*`, auth pages, `/dashboard`

| Path | Behavior |
|------|----------|
| `/admin`, `/partners`, `/customer`, `/dashboard` | **Pass-through** — real auth is client-side + API cookies (cross-origin safe) |
| `/login`, `/signup`, `/signin` with JWT | Redirect by role from JWT payload |
| `/verify-otp` | Allow if `otpPending` cookie or `email` query param |

**Admin is not JWT-guarded in middleware.** [`app/(admin)/admin/layout.tsx`](../app/(admin)/admin/layout.tsx) calls `GET /api/users/auth/check` and requires `role === "admin"`.

Partner hub guard: [`app/(home)/partners/page.tsx`](../app/(home)/partners/page.tsx) — `isBusinessOwner()`.

Implementation: [`lib/api/authSession.ts`](../lib/api/authSession.ts), re-exported via [`utils/authUtils.ts`](../utils/authUtils.ts).

---

## Styling architecture

| Surface | Token family | Guide |
|---------|--------------|-------|
| Public marketplace (PR #30) | `market-*` dusk shell | [STYLE_GUIDE.md](STYLE_GUIDE.md) |
| Marketing / auth / checkout | `brand-*` | [STYLE_GUIDE.md](STYLE_GUIDE.md) |
| Partner dashboard | `surface-*`, `dashboard-*` | [STYLE_GUIDE.md](STYLE_GUIDE.md) |
| Legal / some legacy pages | Legacy CSS / Arial | Migration pending |

Tokens defined in [`tailwind.config.js`](../tailwind.config.js) and [`app/globals.css`](../app/globals.css).

---

## Key directories

| Path | Purpose |
|------|---------|
| `app/(home)/` | Public site and marketplace |
| `app/(home)/Components/` | Shared homepage chrome (Navbar, Footer, Hero, ShopProducts) |
| `components/ui/` | shadcn-style Button, Input, Card |
| `lib/` | API helpers, fonts, utils |
| `docs/` | Internal documentation hub |

---

## Backend

API implementation, database, RLS, Stripe webhooks, and CORS allowlist are owned by **`Techware-Hut/mosaic-backend`**. This repo consumes the HTTP API only — see [API_CONTRACTS.md](API_CONTRACTS.md).
