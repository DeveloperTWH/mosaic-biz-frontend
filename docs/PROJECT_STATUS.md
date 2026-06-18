# Project Status

**Type:** Living document  
**Last updated:** 2026-06-18  
**Audience:** Internal team

For phased next work see [ROADMAP.md](ROADMAP.md). For architecture and env setup see [ARCHITECTURE.md](ARCHITECTURE.md).

Epic #54 sprint closeout: [EPIC_54_SPRINT_CLOSEOUT.md](EPIC_54_SPRINT_CLOSEOUT.md)

---

## Release posture

| Item | Status |
|------|--------|
| Launch repo | `Digital-Builders-757/mosaic-biz-frontend-launch` |
| Production branch | `main` @ `f15cf314` |
| Production deployed | **Yes** — prior polish PRs [#48](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/48) + [#49](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/49) |
| Production URL | https://mosaic-biz-frontend-launch.vercel.app |
| Deploy model | Vercel auto-deploy on merge to `main` |
| Preview access | Vercel deployment protection / SSO (HTTP 401 for unauthenticated automation) |
| Build gate | `npm run build` passes |
| Epic #54 visual polish | **PRs open** — [#64](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/64)–[#67](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/67) awaiting merge |

### Epic #54 sprint PRs (2026-06-18)

| PR | Title | Issues |
|----|-------|--------|
| [#64](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/64) | Vendor readability and CTA system | #51, #55, #58, #62 |
| [#65](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/65) | Mobile navigation and responsive layout | #52, #53 |
| [#66](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/66) | Homepage and marketplace visual hierarchy | #59, #60 |
| [#67](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/67) | Trust, how-to, and public content pages | #56, #57, #61 |

### Prior significant merges

| PR | Title | Merged into | Merge commit |
|----|-------|-------------|--------------|
| [#50](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/50) | Docs production main status | `main` | `f15cf314` |
| [#49](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/49) | Public marketplace readability, mobile QA | `main` | `95369503` |
| [#30](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/30) | Homepage + public marketplace redesign | `main` | `3b168f39` |

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
| Merge Epic #54 PRs #64–#67 | P0 | Then rebase docs closeout PR |
| Human preview sign-off on `/products` | P0 | ~2 min with Vercel SSO |
| Product / food / service **detail** pages | P2 | Deferred from Epic #54 — legacy light UI |
| Legal pages full copy pass | P2 | Needs legal approval; overflow fixed in #65 |
| Mock detail routes vs live routes | P2 | Documented; no reroute without approval |
| `/foods/shop/[id]` stub | P3 | Known gap |
| Customer `/dashboard` placeholder | P3 | Future phase |
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

**Production was not manually deployed from this workstation.** Epic #54 code awaits merge; production remains at `main` @ `f15cf314` until PRs #64–#67 land.
