# Service publication evidence — Issue #185

**Date tested (UTC):** 2026-06-22  
**Tester:** Cursor agent (automated + manual)  
**Test vendor label:** TestVendor-A (The Digital Builders LLC)  
**Frontend branch:** `fix/frontend-service-publication-visibility-flow`  
**Frontend commit SHA:** `c1e2e6ff` (at smoke start; evidence commit follows)  
**PR:** [#186](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/186) — **Refs #185** (do not close until reviewed)  
**PR preview URL:** https://mosaic-biz-frontend-launch-git-fix-fron-da2943-digital-builders.vercel.app  
**Production frontend (CORS-allowed):** https://mosaic-biz-frontend-launch.vercel.app  
**Backend repository:** Techware-Hut/mosaic-backend  
**Backend branch (merged):** `fix/backend-service-publication-visibility-contract`  
**Backend PR:** [#108](https://github.com/Techware-Hut/mosaic-backend/pull/108)  
**Backend merge SHA:** `79444917e925c392feec58365bb4e6e1ed115bea`  
**Backend deployed environment:** Production API (`NEXT_PUBLIC_API_BASE_URL` host)  
**Backend merge timestamp:** 2026-06-22T12:29:39Z  
**Browser / viewport:** Chromium (Cursor browser MCP); desktop ~1280×800  
**Service under test:** `6a3919167788a4bcead90e04` (parent service for TestVendor-A business)

---

## Environment verification

| Check | Result |
|-------|--------|
| `GET /api/health` | 200 |
| `GET /api/ready` | 200 |
| `GET /api/services/list` | 200 |
| Preview CORS preflight `OPTIONS /api/users/login` | **500** (blocked) |
| Production CORS preflight `OPTIONS /api/users/login` | **204** (allowed) |
| Auth login (server-side) | 200, role `business_owner` |
| `GET /api/business/my` | 200, business active |
| Owner mutation `publication` block | **Not present** on live PUT responses |

---

## Scenario results

| # | Scenario | Result | Evidence |
|---|----------|--------|----------|
| 1 | Save draft | **Pass (API)**; inventory UI on production shows Unpublished | `01-draft-created-inventory.png`, `api-smoke-results.json` → `s1_*` |
| 2 | Publish draft | **Pass (API + public list/detail)**; PR preview UI blocked | `03-published-inventory-status.png`, `04-published-services-page.png`, `05-published-public-detail.png`, `s2_*` |
| 3 | Publish from create | **Blocked** — Model A allows one parent per business; POST returns 400 | `api-smoke-results.json` |
| 4 | Edit published | **Pass (API)** — same `_id`, updated title/price on public detail | `api-smoke-results.json` → `s4_*` |
| 5 | Unpublish | **Pass (API)** — public list empty; public detail still 200 (backend gap) | `01-draft-created-inventory.png`, `02-draft-absent-services-page.png`, `s5_*` |
| 6 | Validation failure | **Pass (API)** — PUT invalid child → 400 | `api-smoke-results.json` → `s6_validation_failure` |
| 7 | Ineligible business | **Not tested** — no safe inactive fixture | — |
| 8 | Auth/session | **Pass (API)** — unauthenticated `GET /api/service/:id` → 401; preview login fails CORS | `00-preview-cors-login-blocked.png`, `s8_*` |

---

## Screenshot inventory

| File | Description |
|------|-------------|
| `00-preview-cors-login-blocked.png` | PR preview vendor login — “Something went wrong” (CORS / failed fetch) |
| `01-draft-created-inventory.png` | Production inventory — Unpublished service row (draft state) |
| `02-draft-absent-services-page.png` | Production `/services` — draft service absent from marketplace list |
| `03-published-inventory-status.png` | Production inventory — Published row (pre-PR #186 UI; legacy badge) |
| `04-published-services-page.png` | Production `/services` — search shows published service |
| `05-published-public-detail.png` | Production `/vendor-profile/service-vendor/:id` storefront shell |
| `08-unpublished-absent-public.png` | PR preview inventory stuck on “Loading Business Data…” (CORS) |
| `api-smoke-results.json` | Sanitized server-side route/status log |

**Not captured:** `06-edited-service-public-detail.png`, `07-unpublished-inventory.png`, `09-publication-validation-error.png`, `10-ineligible-business-message.png` — blocked by preview CORS (PR UI) or missing fixtures.

---

## Defects discovered

| ID | Owner | Description |
|----|-------|-------------|
| D1 | **Environment / backend CORS** | Vercel PR preview origin not allowlisted on production API — all credentialed browser calls fail; blocks PR #186 UI acceptance on preview. |
| D2 | **Backend** | Owner `PUT /api/service/:id` responses omit additive `publication` metadata (Model A proof doc). |
| D3 | **Backend** | `GET /api/public/services/:id` returns 200 for `isPublished:false` draft (public list correctly empty). |
| D4 | **Backend** | Full payload PUT with nested `categories[]` returned 500; partial PUT works. |
| D5 | **Test data** | POST create second parent returns 400 — expected Model A constraint; scenario 3 uses update path instead. |

No frontend code changes made during smoke (no mock success added).

---

## What was not tested

- PR #186 inventory UI (Draft badge, Publish/Unpublish row actions, response-driven toasts) on preview — CORS blocked
- Scenario 7 ineligible business messaging
- Mobile 390px form screenshots on PR preview
- Cross-vendor authorization UI (401 API verified only)

---

## Recommendation

**Blocked** for merge until:

1. Backend allowlists Vercel preview origins **or** PR is deployed to a CORS-allowed frontend origin for full UI smoke.
2. Backend ships owner `publication` block on create/update responses.
3. Backend enforces public detail 404/hidden for unpublished services (if that is the contract).

PR #186 remains open for review with API-level publication proof and partial public-surface screenshots on production frontend (main branch UI).
