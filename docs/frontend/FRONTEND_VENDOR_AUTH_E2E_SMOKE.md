# Frontend Vendor Auth E2E Smoke — Launch Gate

**Type:** Launch evidence (vendor auth journey)  
**Last updated:** 2026-06-19  
**Branch:** `fix/frontend-launch-contract-env-and-legacy-route-audit`  
**Commit:** `b756c9eb8c8e3f0ae4761a08705cb520c66844d0`  
**PR:** [#148](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/148)

**Related issues:**

| Repo | Issue | Topic |
|------|-------|-------|
| Frontend | [#143](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/143) | Vendor signup → OTP → login → onboarding E2E smoke |
| Frontend | [#144](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/144) | Launch auth batch tracker (vendor session) |
| Frontend | [#142](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/142) | Verified vendor login kicks user out after OTP |
| Frontend | [#123](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/123) | Credentialed fetch audit |
| Backend | [mosaic-backend #81](https://github.com/Techware-Hut/mosaic-backend/issues/81) | Auth cookie / credentialed requests |
| Backend | [mosaic-backend #84](https://github.com/Techware-Hut/mosaic-backend/issues/84) | Production smoke proof |
| Backend | [mosaic-backend #89](https://github.com/Techware-Hut/mosaic-backend/issues/89) | Authenticated smoke token harness |

**Cross-links:** [FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md](FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md), [FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md](../FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md)

---

## Test run metadata

| Item | Value |
|------|-------|
| **Preview URL (PR #148 target)** | `https://mosaic-biz-frontend-launch-i2dhmbdvd-digital-builders.vercel.app` |
| **Deployment SHA** | `b756c9eb8c8e3f0ae4761a08705cb520c66844d0` (matches PR #148 head) |
| **Date/time (UTC)** | 2026-06-19 ~17:30 UTC |
| **Browser / device** | Cursor IDE browser automation (Chromium); supplemental `curl.exe` checks |
| **Frontend code change this run** | **No** — docs-only evidence capture |

### Vercel env assumptions (names only — no values)

| Name | Assumption |
|------|------------|
| `NEXT_PUBLIC_API_BASE_URL` | Set to production API host; browser calls reached `api.mosaicbizhub.com` successfully from public alias |
| `NEXT_PUBLIC_APP_URL` | Assumed set; not validated on blocked preview URL |
| `NEXT_PUBLIC_CLIENT_BASE_URL` | Assumed set for checkout (not exercised in this smoke) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Assumed present (not exercised — no live payment) |
| `JWT_SECRET` | Read by [middleware.ts](../../middleware.ts); assumed present on Vercel |

Env review / redeploy after changes: **not independently verified in Vercel dashboard this run** — assumed configured per launch checklist.

---

## Preview URL access gate

| Check | Result |
|-------|--------|
| `GET` preview home | **401 Unauthorized** — Vercel Deployment Protection / SSO (`Set-Cookie: _vercel_sso_nonce=…`) |
| Browser navigation to preview | Redirects to `vercel.com/login` SSO gate |
| `GET` preview `/verify-otp?email=[REDACTED]&type=vendor` | **401** |

**Impact:** Full browser E2E on the PR #148 preview URL is **blocked at step 1**. Public production alias (`https://mosaic-biz-frontend-launch.vercel.app`, **200**) was used for **supplementary** journey evidence below. PR #148 is docs-only; auth behavior matches `main` codebase.

**Recommended ops action:** Disable deployment protection for QA preview **or** provide SSO bypass for release-candidate smoke (see [PROJECT_STATUS.md](../PROJECT_STATUS.md)).

---

## Vendor journey pass/fail table

### A. PR #148 preview URL (primary target)

| Step | Journey step | Result | Notes |
|------|--------------|--------|-------|
| 1 | Homepage loads | **FAIL** | HTTP **401** — Vercel SSO |
| 2 | Featured via `GET /api/featured-products` from preview page | **NOT RUN** | Preview unreachable |
| 3 | Vendor signup start | **NOT RUN** | Preview unreachable |
| 4 | OTP page loads | **NOT RUN** | Preview unreachable (`/verify-otp` → **401** via curl) |
| 5 | OTP email arrives | **NOT RUN** | — |
| 6 | OTP verifies | **NOT RUN** | — |
| 7 | Vendor login attempt | **NOT RUN** | — |
| 8 | Login network evidence | **NOT RUN** | — |
| 9 | Vendor reaches onboarding/dashboard | **NOT RUN** | — |
| 10 | `business/my` + `onboarding-data` | **NOT RUN** | — |

**Preview gate verdict:** **BLOCKED** at step 1 (Vercel Deployment Protection).

### B. Supplementary — public production alias (same codebase; not PR preview host)

| Step | Journey step | Result | Notes |
|------|--------------|--------|-------|
| 1 | Homepage loads | **PASS** | HTTP **200**; hero + marketplace chrome render |
| 2 | Featured products API | **PASS** | `GET /api/featured-products` → **200**; product card visible in UI |
| 3 | Vendor signup | **PASS** | `POST /api/users/register` → **201**; redirect to `/verify-otp` |
| 4 | OTP page loads | **PASS** | `/verify-otp?email=[REDACTED]&type=vendor` → **200** (not middleware 307 → `/`) |
| 5 | OTP email arrives | **BLOCKED** | No test inbox access in automation; cannot confirm delivery |
| 6 | OTP verifies | **NOT RUN** | Blocked by step 5 |
| 7 | Vendor login (unverified account) | **PARTIAL** | `POST /api/users/login` → **403**; UI redirects to `/verify-otp` (expected for unverified vendor) |
| 8 | Session network evidence (verified vendor) | **NOT RUN** | Requires OTP completion + verified vendor |
| 9 | Reach `/partners` after verified login | **NOT RUN** | P0 session bug (#142/#144) requires verified vendor — not tested |
| 10 | `GET /api/business/my`, `GET /api/vendor-onboarding/onboarding-data` | **NOT RUN** | Requires authenticated verified vendor session |

**Supplementary verdict:** Signup + OTP page path **PASS**; **verified vendor login → onboarding session path NOT PROVEN** this run.

---

## Sanitized network evidence

All requests use `credentials: include` / cross-origin to `api.mosaicbizhub.com` from `mosaic-biz-frontend-launch.vercel.app`. No cookie values, JWTs, OTPs, or passwords recorded.

### Preview URL (curl)

```text
GET https://mosaic-biz-frontend-launch-i2dhmbdvd-digital-builders.vercel.app/
Status: 401 Unauthorized
Response: Vercel Deployment Protection (SSO nonce cookie set; value not recorded)

GET https://mosaic-biz-frontend-launch-i2dhmbdvd-digital-builders.vercel.app/verify-otp?email=[REDACTED]&type=vendor
Status: 401 Unauthorized
```

### Direct API (curl — not preview-specific)

```text
GET https://api.mosaicbizhub.com/api/featured-products?page=1&limit=10
Status: 200
```

### Supplementary browser run (production alias)

```text
[Homepage]
GET https://mosaic-biz-frontend-launch.vercel.app/
Status: 200

[Featured products]
GET https://api.mosaicbizhub.com/api/featured-products
Status: 200

[Vendor signup]
POST https://api.mosaicbizhub.com/api/users/register
Body role: business_owner (redacted PII)
Status: 201
Set-Cookie on API response: not inspected in browser Performance API (cross-origin)

[OTP page after register]
GET https://mosaic-biz-frontend-launch.vercel.app/verify-otp?email=[REDACTED]&type=vendor
Status: 200 (page renders; OTP inputs visible)

[Vendor login — unverified account]
POST https://api.mosaicbizhub.com/api/users/login
Status: 403
Browser redirect: /verify-otp?email=[REDACTED]&type=vendor

[Not captured — verified vendor path]
GET /api/users/auth/check — NOT RUN (no verified session)
GET /api/business/my — NOT RUN
GET /api/vendor-onboarding/onboarding-data — NOT RUN
Final URL after verified login — NOT RUN
```

---

## Exact blocking step

| Layer | Blocking step | Owner |
|-------|---------------|-------|
| **Primary (preview)** | Step 1 — Vercel Deployment Protection returns **401** before any app code runs | **Ops / Vercel** — preview access for QA |
| **Secondary (full auth proof)** | Step 5 — OTP email delivery not confirmable in automation | **Backend / email config** — or manual tester with disposable inbox |
| **P0 session (#142/#144)** | Steps 8–10 — verified vendor login → `/partners` session persistence | **NOT TESTED** this run — requires steps 5–6 + preview access |

---

## Decision tree applied

| Observation | Conclusion | Owner |
|-------------|------------|-------|
| Preview **401** before app | Not a frontend auth bug | Vercel deployment protection |
| Register **201**, OTP page **200** | Signup + middleware OTP gate OK on public alias | Aligned |
| Login **403** for unverified vendor → `/verify-otp` | Expected backend policy | Aligned (not the #142 session bug) |
| OTP email not received in automation | Cannot proceed to verified login | Backend notification / manual QA |
| Verified login + auth/check + partners hub | **Evidence Needed** | Frontend #142/#144 + backend #81 if auth/check fails after OTP |

---

## Build / lint (branch verification)

Recorded after smoke doc authoring on `fix/frontend-launch-contract-env-and-legacy-route-audit`:

| Command | Result | Notes |
|---------|--------|-------|
| `npm run build` | **PASS** | Next.js 16.1.2; 69 routes; TypeScript OK |
| `npm run lint` | **FAIL** | 662 problems (345 errors, 317 warnings) — pre-existing debt; informational only |

---

## What was NOT tested

- Full journey on PR #148 preview URL (blocked by SSO)
- OTP email delivery or `POST /api/users/verify-otp`
- Verified vendor login session persistence (#142 / #144 P0)
- `GET /api/users/auth/check` after successful vendor login
- `GET /api/business/my` and `GET /api/vendor-onboarding/onboarding-data` with authenticated vendor
- `/partners` hub stay-vs-bounce after verified login
- Live Stripe / checkout
- Admin auth paths
- Mobile viewport auth forms

---

## Recommended next actions

1. **Ops:** Allow QA access to PR preview (disable deployment protection or share SSO bypass) and re-run steps 1–10 on `mosaic-biz-frontend-launch-i2dhmbdvd-digital-builders.vercel.app`.
2. **Manual QA:** Complete OTP with disposable inbox; capture sanitized network proof for login → auth/check → `/partners` → vendor APIs (template in [FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md](../FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md)).
3. **If login 200 + auth/check 401:** Escalate to [mosaic-backend #81](https://github.com/Techware-Hut/mosaic-backend/issues/81).
4. **If auth/check 200 but UI bounces from `/partners`:** Track in frontend [#142](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/142) / [#144](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/144) — confirm PR #141 fix on preview after SSO unblocked.
5. **Vercel env:** Confirm `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_CLIENT_BASE_URL` parity (names only) per [FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md](FRONTEND_LAUNCH_CONTRACT_ALIGNMENT.md).

---

## Guardrails respected

No secrets committed. No legacy route changes. No auth guard weakening. No live payments. No frontend code changes unless smoke proved a new bug (none proven this run).
