# Frontend Vendor Auth E2E Smoke — Launch Gate

**Type:** Launch evidence (vendor auth journey)  
**Last updated:** 2026-06-19  
**Branch:** `fix/frontend-launch-contract-env-and-legacy-route-audit`  
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

## Run 2 — deployment protection removed (current)

| Item | Value |
|------|-------|
| **Preview URL tested** | `https://mosaic-biz-frontend-launch-7f68xrb04-digital-builders.vercel.app` |
| **Deployment SHA** | `9caaa6fe5fcc2cf6b05615acb62923f743ee5c57` |
| **Date/time (UTC)** | 2026-06-19 ~19:50 UTC |
| **Browser / device** | Cursor IDE browser automation (Chromium); supplemental `curl.exe` |
| **Frontend code change** | **No** |

Deployment protection removed by ops before this run. Preview app shell loads (**200**), but **backend API calls from the dynamic preview `Origin` return HTTP 500**.

### Vercel env assumptions (names only — no values)

| Name | Assumption |
|------|------------|
| `NEXT_PUBLIC_API_BASE_URL` | Points to production API host |
| `NEXT_PUBLIC_APP_URL` | Assumed set on preview |
| `NEXT_PUBLIC_CLIENT_BASE_URL` | Assumed set (checkout not exercised) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Assumed present |
| `JWT_SECRET` | Read by [middleware.ts](../../middleware.ts); assumed present |

---

## Vendor journey pass/fail — Run 2 (preview URL)

| Step | Journey step | Result | Notes |
|------|--------------|--------|-------|
| 1 | Homepage loads | **PASS** | HTTP **200**; hero + nav render on preview |
| 2 | Featured via `GET /api/featured-products` | **FAIL** | API returns **500** when `Origin` is preview deployment host; **200** with production alias `Origin` |
| 3 | Vendor signup (`POST /api/users/register`) | **FAIL** | Browser submit does not redirect; API **500** with preview `Origin` (curl reproduced) |
| 4 | OTP page loads (`/verify-otp`) | **PASS** | Page route **200** on preview (middleware PR #141 regression not observed) |
| 5 | OTP email arrives | **BLOCKED** | No test inbox in automation |
| 6 | OTP verifies | **NOT RUN** | Blocked by step 5 |
| 7 | Vendor login | **NOT RUN** | Requires verified vendor |
| 8 | Login network evidence (`login`, `auth/check`, cookies) | **NOT RUN** | Preview `Origin` → `auth/check` **500** (curl); prod alias `Origin` → **401** (expected unauth) |
| 9 | Reach `/partners` / onboarding hub | **NOT RUN** | — |
| 10 | `GET /api/business/my`, `GET /api/vendor-onboarding/onboarding-data` | **NOT RUN** | — |

**Run 2 verdict:** Preview **frontend shell PASS**; **API contract FAIL** for dynamic preview origin — **backend CORS/origin handling** blocks signup and featured fetch before vendor auth can be proven on preview.

---

## Run 1 — deployment protection enabled (historical)

| Item | Value |
|------|-------|
| Preview URL | `https://mosaic-biz-frontend-launch-i2dhmbdvd-digital-builders.vercel.app` |
| SHA | `b756c9eb8c8e3f0ae4761a08705cb520c66844d0` |
| Result | **BLOCKED at step 1** — HTTP **401** Vercel SSO |

Supplementary evidence on public alias (`mosaic-biz-frontend-launch.vercel.app`): signup **201**, OTP page **200**, unverified login **403** → `/verify-otp`. See git history for full Run 1 doc.

---

## Sanitized network evidence — Run 2

No cookie values, JWTs, OTPs, passwords, or emails committed. PII redacted as `[REDACTED]`.

### Preview app shell (curl)

```text
GET https://mosaic-biz-frontend-launch-7f68xrb04-digital-builders.vercel.app/
Status: 200

GET https://mosaic-biz-frontend-launch-7f68xrb04-digital-builders.vercel.app/verify-otp?email=[REDACTED]&type=vendor
Status: 200
```

### API with preview deployment Origin (curl — key finding)

```text
Origin: https://mosaic-biz-frontend-launch-7f68xrb04-digital-builders.vercel.app

GET  /api/featured-products?page=1&limit=10     → 500 Internal Server Error
POST /api/users/register                        → 500 Internal Server Error
GET  /api/users/auth/check                      → 500 Internal Server Error
```

### API with production alias Origin (control — same API host)

```text
Origin: https://mosaic-biz-frontend-launch.vercel.app

GET  /api/featured-products?page=1&limit=10     → 200 (products payload)
GET  /api/users/auth/check                      → 401 Authentication required (expected unauth)
POST /api/users/register                        → 201 in browser automation (Run 1 supplementary)
```

### Browser (preview — signup attempt)

```text
[Homepage on preview]
Page load: 200
Featured section: Retry UI (API failure consistent with 500 above)

[Vendor signup form submitted on preview]
POST /api/users/register (cross-origin from preview host)
Browser: remained on /signup?type=vendor (no redirect to /verify-otp)
Performance API status: opaque (cross-origin); curl with preview Origin confirms 500

[Login page on preview]
GET /login?type=vendor → 200 (page renders)
Verified vendor login path: NOT RUN
```

---

## Exact blocking step (Run 2)

| Layer | Step | Owner |
|-------|------|-------|
| **Current primary** | Step 2–3 — Backend returns **500** for credentialed API calls when `Origin` is the Vercel **dynamic preview deployment host** | **Backend** — CORS allowlist / origin handling ([#81](https://github.com/Techware-Hut/mosaic-backend/issues/81), [#84](https://github.com/Techware-Hut/mosaic-backend/issues/84)) |
| **Secondary** | Step 5 — OTP email not confirmable in automation | **Backend / email** or manual QA |
| **Not reached** | Steps 7–10 — verified vendor session (#142 / #144) | **NOT TESTED** — requires API fix + OTP |

---

## Decision tree applied

| Observation | Conclusion | Owner |
|-------------|------------|-------|
| Preview app **200**, API **500** with preview `Origin` | Backend origin/CORS config — not frontend route bug | Backend |
| Same API **200/401** with production alias `Origin` | API host healthy; preview-specific origin gap | Backend |
| `/verify-otp` page **200** on preview | Frontend middleware OTP gate OK | Aligned |
| Register **201** on prod alias (Run 1 supplementary) | Signup flow works when origin allowed | Aligned |
| OTP email / verified login | Not proven on preview | Manual QA after backend fix |

---

## Build / lint (branch verification)

| Command | Result | Notes |
|---------|--------|-------|
| `npm run build` | **PASS** | Next.js 16.1.2; 69 routes; TypeScript OK |
| `npm run lint` | **FAIL** | 662 problems (345 errors, 317 warnings) — pre-existing; informational only |

---

## What was NOT tested

- Verified vendor OTP verify → login → `/partners` session (#142 / #144)
- `GET /api/users/auth/check` after successful vendor login on preview
- `GET /api/business/my`, `GET /api/vendor-onboarding/onboarding-data` on preview
- Live Stripe / checkout
- Admin auth on preview

---

## Recommended next actions

1. **Backend:** Add Vercel preview deployment origins (e.g. `https://*.vercel.app` pattern or explicit preview URL) to CORS allowlist; stop **500** on valid preview `Origin` — track on [#81](https://github.com/Techware-Hut/mosaic-backend/issues/81) / [#84](https://github.com/Techware-Hut/mosaic-backend/issues/84).
2. **Re-run Run 2 steps 2–10** on preview after backend fix; confirm `POST /api/users/register` → **201** and featured → **200**.
3. **Manual QA:** Complete OTP with disposable inbox; capture login → `auth/check` → `/partners` proof ([FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md](../FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md)).
4. **Vercel env:** Confirm `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_CLIENT_BASE_URL` parity (names only).

---

## Guardrails respected

No secrets committed. No legacy route changes. No auth guard weakening. No live payments. No frontend code changes (backend origin issue — not a safe frontend-only fix).
