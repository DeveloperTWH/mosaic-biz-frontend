# Mosaic Biz Hub — Documentation Hub

**Audience:** Internal team (Digital Builders, dev, QA, release control)  
**Last updated:** 2026-06-23

Mosaic Biz Hub is a Next.js marketplace frontend connecting consumers to verified minority-owned businesses (products, services, food). This repo (`mosaic-biz-frontend`) is the customer-facing app, vendor onboarding flows, partner dashboard, and admin UI. The API lives in a separate backend repo — see [Backend](#backend-repo) below.

**Start here if you are new:** [../README.md](../README.md) → [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) → [PROJECT_BREAKDOWN.md](PROJECT_BREAKDOWN.md) → [ARCHITECTURE.md](ARCHITECTURE.md)

**Platform behavior (what Mosaic is supposed to do):** [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) — vendor eligibility, shipping, orders, payments, role journeys.

---

## Doc map

| Document | Type | Last updated | When to read |
|----------|------|--------------|--------------|
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | **Living** | 2026-06-17 | Current release posture, what shipped, blockers, verified vs pending QA |
| [ROADMAP.md](ROADMAP.md) | **Living** | 2026-06-17 | Phased next steps and explicit non-goals |
| [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) | **Source of truth** | 2026-06-23 | Intended platform behavior: eligibility, shipping, orders, role journeys |
| [MARKETPLACE_VENDOR_ELIGIBILITY.md](MARKETPLACE_VENDOR_ELIGIBILITY.md) | Reference | 2026-06-23 | Admin vs public vendor visibility; backend follow-up checklist |
| [BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md](BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md) | Reference | 2026-06-23 | Copy-paste prompt for backend agent (mosaic-backend) |
| [PROJECT_BREAKDOWN.md](PROJECT_BREAKDOWN.md) | Reference | 2026-06-23 | Full end-to-end picture: journeys, auth, data flow, code layout |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Reference | 2026-06-22 | Route groups, env vars, deployment model, auth summary |
| [GIT_WORKFLOW.md](GIT_WORKFLOW.md) | **Reference** | 2026-06-22 | Branching model: feature → `develop` → `main` |
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

### Launch readiness — as-built pack (`docs/frontend/`)

**Start here for launch evidence:** [frontend/FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md](frontend/FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md)

| Document | Type | Last updated | When to read |
|----------|------|--------------|--------------|
| [frontend/FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md](frontend/FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md) | **Evidence** | 2026-06-19 | Index: branch, build/lint, API findings, gaps |
| [frontend/FRONTEND_ARCHITECTURE_AS_BUILT.md](frontend/FRONTEND_ARCHITECTURE_AS_BUILT.md) | Reference | 2026-06-19 | As-built architecture and boundaries |
| [frontend/FRONTEND_ROUTE_MAP.md](frontend/FRONTEND_ROUTE_MAP.md) | Reference | 2026-06-19 | All App Router pages → URLs |
| [frontend/FRONTEND_API_USAGE_INVENTORY.md](frontend/FRONTEND_API_USAGE_INVENTORY.md) | Reference | 2026-06-19 | Frontend → backend API calls |
| [frontend/FRONTEND_ENVIRONMENT_VARIABLES_NAMES_ONLY.md](frontend/FRONTEND_ENVIRONMENT_VARIABLES_NAMES_ONLY.md) | Reference | 2026-06-19 | Env var names only (no values) |
| [frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md) | Reference | 2026-06-19 | Auth session and credentials |
| [frontend/FRONTEND_MARKETPLACE_SURFACE_MAP.md](frontend/FRONTEND_MARKETPLACE_SURFACE_MAP.md) | Reference | 2026-06-19 | Consumer marketplace surfaces |
| [frontend/FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md](frontend/FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md) | Reference | 2026-06-19 | Admin, vendor, customer surfaces |
| [frontend/FRONTEND_VISUAL_QA_SURFACE.md](frontend/FRONTEND_VISUAL_QA_SURFACE.md) | Reference | 2026-06-19 | Human visual QA surface list |
| [frontend/FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md](frontend/FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md) | **Evidence** | 2026-06-19 | Launch contract alignment: legacy paths, env vars, fix-owner matrix, preview smoke |
| [frontend/FRONTEND_VENDOR_AUTH_E2E_SMOKE.md](frontend/FRONTEND_VENDOR_AUTH_E2E_SMOKE.md) | **Evidence** | 2026-06-19 | Vendor auth E2E smoke gate (#143): preview SSO block + supplementary signup path |

**Rule of thumb:** For “what is the platform supposed to do?” read **PLATFORM_OPERATING_MODEL**. For “where are we today?” read **PROJECT_STATUS**. For “what’s next?” read **ROADMAP**. Do not treat historical audits as current blockers without checking PROJECT_STATUS.

---

## Reading paths by role

### New developer

1. [../README.md](../README.md) — clone, env, run locally
2. [PROJECT_BREAKDOWN.md](PROJECT_BREAKDOWN.md) — how the whole frontend fits together
3. [ARCHITECTURE.md](ARCHITECTURE.md) — App Router layout, branches, deployment
4. [GIT_WORKFLOW.md](GIT_WORKFLOW.md) — feature → `develop` → `main`
5. [API_CONTRACTS.md](API_CONTRACTS.md) — which endpoints are canonical
6. [STYLE_GUIDE.md](STYLE_GUIDE.md) — tokens and component patterns

### Release / QA

1. [frontend/FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md](frontend/FRONTEND_DOCUMENTATION_EVIDENCE_LOG.md) — as-built evidence pack index (launch readiness)
2. [frontend/FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md](frontend/FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md) — API contract alignment, legacy paths, Vercel smoke steps
3. [PROJECT_STATUS.md](PROJECT_STATUS.md) — `develop` / `main` posture, preview URL, pending human sign-off
4. [GIT_WORKFLOW.md](GIT_WORKFLOW.md) — where to merge PRs (feature → `develop` → `main`)
5. [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) — full smoke pass on Vercel preview
6. [frontend/FRONTEND_VISUAL_QA_SURFACE.md](frontend/FRONTEND_VISUAL_QA_SURFACE.md) — priority visual QA URLs
7. [HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md](HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md) — post-merge `/products` gate evidence

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
| Integration branch | `develop` |
| Production branch | `main` |
| Branching model | Feature branches → `develop` → `main` — see [GIT_WORKFLOW.md](GIT_WORKFLOW.md) |
| Production deploy | Vercel auto-deploy on merge to `main` |
| Vercel previews | Deployment protection / SSO — automated QA may get HTTP 401 |
