# Mosaic Biz Hub — Documentation Hub

**Audience:** Internal team (Digital Builders, dev, QA, release control)  
**Last updated:** 2026-06-23

Mosaic Biz Hub is a Next.js marketplace frontend connecting consumers to verified minority-owned businesses (products, services, food). This repo is the customer-facing app, vendor onboarding, partner dashboard, and admin UI. The API lives in **`Techware-Hut/mosaic-backend`**.

---

## Start here

| Question | Read |
|----------|------|
| What is the platform supposed to do? | [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) |
| Where are we today / what shipped? | [PROJECT_STATUS.md](PROJECT_STATUS.md) |
| How is the frontend organized? | [PROJECT_BREAKDOWN.md](PROJECT_BREAKDOWN.md) → [ARCHITECTURE.md](ARCHITECTURE.md) |
| Which API routes does the frontend call? | [API_CONTRACTS.md](API_CONTRACTS.md) |
| Old QA reports and sprint snapshots | [archive/README.md](archive/README.md) |

**New developer path:** [../README.md](../README.md) → [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) → [PROJECT_BREAKDOWN.md](PROJECT_BREAKDOWN.md) → [ARCHITECTURE.md](ARCHITECTURE.md) → [API_CONTRACTS.md](API_CONTRACTS.md) → [GIT_WORKFLOW.md](GIT_WORKFLOW.md)

---

## Active documentation (maintain these)

### Living

| Document | When to read |
|----------|--------------|
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Release posture, merges, blockers, verified vs pending QA |
| [ROADMAP.md](ROADMAP.md) | Phased next steps and explicit non-goals |

### Source of truth — platform behavior

| Document | When to read |
|----------|--------------|
| [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) | Eligibility, shipping, orders, payments, role journeys |
| [MARKETPLACE_VENDOR_ELIGIBILITY.md](MARKETPLACE_VENDOR_ELIGIBILITY.md) | `isApproved && isActive`; admin vs public listing |
| [BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md](BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md) | Copy-paste prompt for `mosaic-backend` (eligibility implementation) |
| [BACKEND_DOCUMENTATION_REDESIGN_GUIDE.md](BACKEND_DOCUMENTATION_REDESIGN_GUIDE.md) | Playbook to align backend docs with frontend + runtime |

### Reference — architecture & contracts

| Document | When to read |
|----------|--------------|
| [PROJECT_BREAKDOWN.md](PROJECT_BREAKDOWN.md) | Journeys, auth summary, code layout |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Route groups, env, deployment, API patterns |
| [API_CONTRACTS.md](API_CONTRACTS.md) | Canonical endpoints the frontend calls |
| [BACKEND_FRONTEND_ROUTE_CONTRACT.md](BACKEND_FRONTEND_ROUTE_CONTRACT.md) | Legacy vs modern API paths |
| [GIT_WORKFLOW.md](GIT_WORKFLOW.md) | Feature → `develop` → `main` |
| [STYLE_GUIDE.md](STYLE_GUIDE.md) | Design tokens (`brand-*`, `market-*`, dashboard) |
| [STRIPE_CONNECT_FRONTEND_FLOW.md](STRIPE_CONNECT_FRONTEND_FLOW.md) | Vendor payout onboarding |
| [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md) | Repeatable preview QA |
| [FRONTEND_SEARCH_PARAM_CONTRACT.md](FRONTEND_SEARCH_PARAM_CONTRACT.md) | URL filter/search params |
| [SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md) | Sentry env vars |

### Reference — detailed indexes (`docs/frontend/`)

Use these when you need page-level or call-level detail. They supplement — not replace — the root references above.

| Document | When to read |
|----------|--------------|
| [frontend/FRONTEND_ROUTE_MAP.md](frontend/FRONTEND_ROUTE_MAP.md) | Every `page.tsx` → public URL |
| [frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md](frontend/FRONTEND_AUTH_AND_CREDENTIALS_BEHAVIOR.md) | Auth layers, middleware pass-through, guards |
| [frontend/FRONTEND_MARKETPLACE_SURFACE_MAP.md](frontend/FRONTEND_MARKETPLACE_SURFACE_MAP.md) | Customer browse, cart, checkout surfaces |
| [frontend/FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md](frontend/FRONTEND_ADMIN_VENDOR_CUSTOMER_SURFACE_MAP.md) | Admin, vendor, customer dashboards |
| [frontend/FRONTEND_ENVIRONMENT_VARIABLES_NAMES_ONLY.md](frontend/FRONTEND_ENVIRONMENT_VARIABLES_NAMES_ONLY.md) | Env var names (no values) |
| [frontend/FRONTEND_VISUAL_QA_SURFACE.md](frontend/FRONTEND_VISUAL_QA_SURFACE.md) | Priority URLs for human visual QA |
| [frontend/FRONTEND_E2E_TEST_RUNBOOK.md](frontend/FRONTEND_E2E_TEST_RUNBOOK.md) | Playwright E2E |
| [frontend/FRONTEND_SERVICE_PUBLICATION_FLOW.md](frontend/FRONTEND_SERVICE_PUBLICATION_FLOW.md) | Service listing + public URL model |

### Vendor feature notes

| Document | When to read |
|----------|--------------|
| [vendor/README.md](vendor/README.md) | Index |
| [vendor/service-creation-flow.md](vendor/service-creation-flow.md) | Parent + child service creation |
| [vendor/add-service-prefill.md](vendor/add-service-prefill.md) | Service prefill API |

---

## Archive (do not treat as current)

~40 dated QA proofs, sprint closeouts, and superseded audits are indexed in **[archive/README.md](archive/README.md)**. They remain in the repo for audit trail but are **not** the source of truth for how the app works today.

**Rule:** If a doc is in the archive index or labeled Historical / Evidence, confirm against [PROJECT_STATUS.md](PROJECT_STATUS.md) and [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) before acting on it.

---

## Reading paths by role

### Release / QA

1. [PROJECT_STATUS.md](PROJECT_STATUS.md)
2. [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) — expected behavior for test plans
3. [FRONTEND_SMOKE_CHECKLIST.md](FRONTEND_SMOKE_CHECKLIST.md)
4. [frontend/FRONTEND_VISUAL_QA_SURFACE.md](frontend/FRONTEND_VISUAL_QA_SURFACE.md)
5. [MARKETPLACE_VENDOR_ELIGIBILITY.md](MARKETPLACE_VENDOR_ELIGIBILITY.md) — vendor visibility test cases

### Designer / public marketplace UI

1. [STYLE_GUIDE.md](STYLE_GUIDE.md)
2. [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) — customer/vendor journeys in plain language

### Ops / monitoring

1. [SENTRY_VERCEL_SETUP.md](SENTRY_VERCEL_SETUP.md)
2. [PROJECT_STATUS.md](PROJECT_STATUS.md)

---

## Backend repo

Frontend docs do **not** duplicate backend schema, migrations, or Stripe webhook logic.

| Resource | Location |
|----------|----------|
| API server | `Techware-Hut/mosaic-backend` |
| Production API | `https://api.mosaicbizhub.com` |
| CORS, webhooks, vendor approval enforcement | Backend-owned — see [BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md](BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md) |

---

## Launch repo

| Item | Value |
|------|--------|
| GitHub | `Digital-Builders-757/mosaic-biz-frontend-launch` |
| Integration branch | `develop` |
| Production branch | `main` |
| Deploy | Vercel auto-deploy on merge to `main` |
| Previews | May require Vercel SSO (HTTP 401 for unauthenticated automation) |
