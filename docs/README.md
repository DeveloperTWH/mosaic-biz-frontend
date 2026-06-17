# Mosaic Biz Hub — Documentation Hub

**Audience:** Internal team (Digital Builders, dev, QA, release control)  
**Last updated:** 2026-06-17

Mosaic Biz Hub is a Next.js marketplace frontend connecting consumers to verified minority-owned businesses (products, services, food). This repo (`mosaic-biz-frontend`) is the customer-facing app, vendor onboarding flows, partner dashboard, and admin UI. The API lives in a separate backend repo — see [Backend](#backend-repo) below.

**Start here if you are new:** [../README.md](../README.md) → [ARCHITECTURE.md](ARCHITECTURE.md) → [STYLE_GUIDE.md](STYLE_GUIDE.md)

---

## Doc map

| Document | Type | Last updated | When to read |
|----------|------|--------------|--------------|
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | **Living** | 2026-06-17 | Current release posture, what shipped, blockers, verified vs pending QA |
| [ROADMAP.md](ROADMAP.md) | **Living** | 2026-06-17 | Phased next steps and explicit non-goals |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Reference | 2026-06-17 | Route groups, env vars, deployment model, auth summary |
| [API_CONTRACTS.md](API_CONTRACTS.md) | Reference | 2026-06-17 | Canonical endpoints the frontend calls |
| [STYLE_GUIDE.md](STYLE_GUIDE.md) | Reference | 2026-06-17 | Design tokens (`brand-*`, `market-*`, dashboard surfaces) |
| [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) | Reference | 2026-06-17 | Preview QA checklist after deploy |
| [SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md) | Reference | 2026-06-16 | Sentry env vars and verification (PR #1) |
| [HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md](HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md) | QA evidence | 2026-06-17 | PR #30 QA; **Post-merge sign-off** section is current |
| [HOMEPAGE_REDESIGN_SCOPE_AUDIT.md](HOMEPAGE_REDESIGN_SCOPE_AUDIT.md) | Historical | 2026-06-17 | PR #30 in-scope vs out-of-scope file list |
| [FRONTEND_AUDIT_ISSUE_2.md](FRONTEND_AUDIT_ISSUE_2.md) | Historical | 2026-06-16 | Pre-redesign route/API audit — blockers may be stale |
| [CROSS_REPO_LAUNCH_READINESS.md](CROSS_REPO_LAUNCH_READINESS.md) | Historical | 2026-06-16 | Sprint pass-1 snapshot — superseded by PROJECT_STATUS |
| [vendor/](vendor/) | Reference | — | Vendor feature notes (service creation, prefill) |
| [qa-screenshots/](qa-screenshots/) | Assets | 2026-06-17 | Visual QA captures |

**Rule of thumb:** For “where are we today?” read **PROJECT_STATUS**. For “what’s next?” read **ROADMAP**. Do not treat historical audits as current blockers without checking PROJECT_STATUS.

---

## Reading paths by role

### New developer

1. [../README.md](../README.md) — clone, env, run locally
2. [ARCHITECTURE.md](ARCHITECTURE.md) — App Router layout, branches, deployment
3. [API_CONTRACTS.md](API_CONTRACTS.md) — which endpoints are canonical
4. [STYLE_GUIDE.md](STYLE_GUIDE.md) — tokens and component patterns

### Release / QA

1. [PROJECT_STATUS.md](PROJECT_STATUS.md) — RC branch, preview URL, pending human sign-off
2. [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) — full smoke pass on Vercel preview
3. [HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md](HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md) — post-merge `/products` gate evidence

### Designer / frontend (public marketplace)

1. [STYLE_GUIDE.md](STYLE_GUIDE.md) — `market-*` dusk shell vs `brand-*` vs dashboard `surface-*`
2. [HOMEPAGE_REDESIGN_SCOPE_AUDIT.md](HOMEPAGE_REDESIGN_SCOPE_AUDIT.md) — what PR #30 touched and deferred gaps

### Ops / monitoring

1. [SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md)
2. [PROJECT_STATUS.md](PROJECT_STATUS.md) — Sentry PR #1 merge status

---

## Backend repo

Frontend docs do **not** duplicate backend schema, migrations, or Stripe webhook logic.

| Resource | Location |
|----------|----------|
| API server | `Techware-Hut/mosaic-backend` (coordinate with backend team) |
| Production API base | `https://api.mosaicbizhub.com` |
| Featured products empty | Backend/admin must flag products via featured API — not a frontend env issue |
| CORS, webhooks, vendor approval | Owned by backend — see backend repo |

---

## Launch repo vs local clone

| Item | Value |
|------|--------|
| GitHub (launch) | `Digital-Builders-757/mosaic-biz-frontend-launch` |
| Integration branch | `sprint/frontend-release-candidate` |
| Production deploy | **Not automatic** — manual promote only; production not deployed as of 2026-06-17 |
| Vercel previews | Deployment protection / SSO — automated QA may get HTTP 401 |
