# Roadmap

**Type:** Living document  
**Last updated:** 2026-06-22  
**Audience:** Internal team

Current status: [PROJECT_STATUS.md](PROJECT_STATUS.md)  
Branching standard (current): [GIT_WORKFLOW.md](GIT_WORKFLOW.md) — feature → `develop` → `main`. Older sections below may reference the legacy `sprint/frontend-release-candidate` branch from the launch sprint.

---

## Phases

### Phase 0 — Now: Release-candidate QA

**Focus:** Validate merged frontend against live API on Vercel preview (not localhost alone).

| Exit criteria | Owner |
|---------------|-------|
| Human preview sign-off: `/products` → `api.mosaicbizhub.com/api/products/list` **200** + **`TEST PRODUCT 17 jun`** in UI | QA / release |
| [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) executed on RC preview with pass/fail evidence | QA |
| Post-merge QA doc updated if preview URL changes | Dev |

**Not a blocker:** Empty homepage featured products until backend flags inventory via `/api/featured-products`.

---

### Phase 1 — Next: Remaining sprint PRs into RC

**Focus:** Merge outstanding launch-sprint branches into `sprint/frontend-release-candidate`.

| PR | Branch | Focus |
|----|--------|-------|
| [#1](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/1) | `feat/sentry-monitoring` | Sentry + source maps — [SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md) |
| [#19](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/19) | `sprint/frontend-launch-polish` | Hero, cards, search, footer polish |
| [#20](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/20) | `sprint/frontend-vendor-flow-ux` | Vendor onboarding / dashboard UX |
| [#21](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/21) | `sprint/frontend-launch-flow-qa` | Checkout states, smoke checklist |

| Exit criteria |
|---------------|
| Each PR builds green on merge to RC |
| Preview smoke re-run after each merge |
| Sentry env vars set in Vercel before relying on monitoring |

---

### Phase 2 — Then: Detail pages and route consolidation

**Focus:** Close visual and routing gaps called out in PR #30 QA.

| Work item |
|-----------|
| Redesign product / food / service / vendor **detail** pages (legacy light UI today) |
| Remove or redirect mock detail routes to live routes |
| Consolidate duplicated listing components (`FilterAccordion`, `ProductCard`, etc.) |
| Fix deferred UI gaps (`CustomSelect` on `/vendors`, legal/FAQ styling) |

| Exit criteria |
|---------------|
| Single canonical detail URL per entity type |
| Public routes use `market-*` shell consistently |
| No SEO/QA confusion from duplicate mock paths |

---

### Phase 3 — Later: Product expansion

**Focus:** Features requiring product decisions and/or backend support.

| Work item | Dependency |
|-----------|------------|
| Customer `/dashboard` (replace placeholder) | Product spec |
| Grocery checkout (currently “coming soon” in cart) | Backend + Stripe |
| Shared marketplace card component | Frontend refactor |
| Consolidate API clients into `lib/api.ts` | Frontend refactor |
| Vendor spotlight / stories (homepage sections) | Content + API |
| Session Replay / advanced Sentry | Sentry PR merged + config |
| Geolocation / ZIP filters | Backend support |

Coordinate backend work in `Techware-Hut/mosaic-backend` — do not change API contracts from frontend alone.

---

## Non-goals (until explicitly approved)

- **No production deploy** without controlled manual promote
- **No merge to `main`** as implicit production release
- **No API contract changes** without backend team alignment
- **No cart/checkout/Stripe changes** bundled into public marketplace redesign PRs
- **No auth/session or middleware changes** during visual redesign sprints
- **No treating empty featured products as a frontend release blocker** while backend returns `[]`

---

## How to update this doc

When a phase completes or priorities shift:

1. Update [PROJECT_STATUS.md](PROJECT_STATUS.md) with facts (merged PRs, deploy state, blockers).
2. Move completed items out of “Now” in this file.
3. Keep historical sprint snapshots in dated docs — do not delete audit trails.
