# Project Status

**Type:** Living document  
**Last updated:** 2026-06-18  
**Audience:** Internal team

For phased next work see [ROADMAP.md](ROADMAP.md). For architecture and env setup see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Release posture

| Item | Status |
|------|--------|
| Launch repo | `Digital-Builders-757/mosaic-biz-frontend-launch` |
| Integration branch | `sprint/frontend-release-candidate` |
| Production deployed | **No** |
| Deploy model | Vercel preview per branch/merge; manual promote to production |
| Preview access | Vercel deployment protection / SSO (HTTP 401 for unauthenticated automation) |
| Build gate | `npm run build` passes on `main` |
| Visual polish (in flight) | `polish/public-readability-marketplace-forms` — PR [#48](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/48); **conditional QA pass** (2026-06-18) |

### Latest significant merge

| PR | Title | Merged into | Merge commit |
|----|-------|-------------|--------------|
| [#30](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/30) | Homepage + public marketplace redesign | `sprint/frontend-release-candidate` | `3b168f39` (2026-06-17) |

**Post-merge preview (example deployment):**  
https://mosaic-biz-frontend-launch-n9lklmen7-digital-builders.vercel.app  

Use the latest Preview deployment for `sprint/frontend-release-candidate` in Vercel if this URL expires.

---

## What shipped (frontend)

PR #30 delivered the controlled public-marketplace redesign:

- **Homepage** — dusk hero, announcement bar, trust bar, search, category sections, featured products block
- **Public chrome** — navbar, footer, shared search/filter bar
- **Listing pages** — `/products`, `/foods`, `/services`, `/vendors`, `/about`, `/how-to-use-this-app`, `/contact`
- **Theme** — `market-*` Tailwind tokens for public marketplace shell ([STYLE_GUIDE.md](STYLE_GUIDE.md))

**Explicitly out of scope for PR #30:** cart/checkout/Stripe, auth/session, vendor/admin/dashboard styling, middleware, API contract changes, production deploy.

---

## Verified vs pending (2026-06-17)

### API wiring — verified

| Check | Result | Evidence |
|-------|--------|----------|
| `/products` calls production list API | Pass | `GET https://api.mosaicbizhub.com/api/products/list?...` in production build network log |
| Backend list returns live data | Pass | Direct API: `total=1`, title **`TEST PRODUCT 17 jun`** |
| Canonical featured endpoint | Pass | `GET /api/featured-products` — **not** `/api/products/featured` |
| `npm run build` | Pass | Pre- and post-merge |

### QA — pending human

| Check | Result | Notes |
|-------|--------|-------|
| **`TEST PRODUCT 17 jun` visible on preview `/products` UI** | Pending | Vercel SSO blocks automated browser; backend + client wiring confirmed |
| Full smoke checklist with evidence | Pending | Use [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) on RC preview |

Details: [HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md](HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md) — **Post-merge sign-off** section.

### Backend / data — not frontend blockers

| Issue | Owner | Notes |
|-------|-------|-------|
| Homepage featured products empty | Backend / admin | `GET /api/featured-products` returns **200** with `products: []` — flag products in admin/backend |
| CORS from localhost to production API | Expected | Local dev against `api.mosaicbizhub.com` may fail in browser; use RC preview or local backend |
| Stripe E2E, vendor approval flows | Backend | Track in `Techware-Hut/mosaic-backend` |

---

## Open frontend items

| Item | Priority | Notes |
|------|----------|-------|
| Human preview sign-off on `/products` | P0 | ~2 min with Vercel SSO |
| Sprint PRs [#1](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/1), [#19](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/19)–[#21](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/21) | P1 | Awaiting merge/review into RC |
| Product / food / service **detail** pages | P2 | Legacy light UI — deferred from PR #30 |
| Mock detail routes vs live routes | P2 | `/products/[productid]/[id]`, `/services/[id]/[serviceId]` coexist with `/product/[id]`, `/service/[slug]` |
| `CustomSelect` white dropdown on `/vendors` | P3 | **Fixed** in readability polish — `market-*` dropdown |
| Customer `/dashboard` placeholder | P3 | Future phase |
| `/foods/shop/[id]` stub | P3 | Document in smoke checklist known gaps |
| `npm run lint` on Next 16 | P3 | DX — build used as gate |

---

## Environment (preview / production)

| Variable | Expected value |
|----------|----------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.mosaicbizhub.com` |
| `NEXT_PUBLIC_APP_URL` | Vercel preview or production URL |

Default fallback in [`lib/api.ts`](../lib/api.ts) is `https://api.mosaicbizhub.com/` if unset.

---

## Recommendation (release control)

**Conditional pass** for release-candidate promotion at code + API-contract level.

Before promoting beyond RC:

1. Complete human preview check on `/products` (network 200 + `TEST PRODUCT 17 jun` in UI).
2. Run [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) on RC preview with evidence.
3. Do **not** block RC on empty homepage featured section until backend populates featured inventory.

**Production was not deployed.**
