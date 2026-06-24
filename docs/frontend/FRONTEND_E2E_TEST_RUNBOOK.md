# Frontend E2E Test Runbook

**Branch:** `test/frontend-critical-journey-playwright`  
**Issues:** [#163](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/163), related [#162](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/162)  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`

---

## Purpose

Playwright browser tests cover launch-critical Mosaic Biz Hub journeys using **local Next.js + mocked API responses**. No production credentials, cookies, OTPs, tokens, or live Stripe charges are used in the default suite.

Manual smoke references:

- [FRONTEND_SMOKE_CHECKLIST.md](../FRONTEND_SMOKE_CHECKLIST.md)
- [FRONTEND_VENDOR_AUTH_E2E_SMOKE.md](FRONTEND_VENDOR_AUTH_E2E_SMOKE.md)
- [FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md](../FRONTEND_AUTH_TEST_ACCOUNT_SMOKE.md)

---

## Prerequisites

1. Node.js 20+ and npm
2. Install dependencies: `npm install`
3. Install Playwright browser: `npx playwright install chromium`
4. First run builds the app via Playwright `webServer` (`npm run build && npm run start`)

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Headless Playwright suite |
| `npm run test:screenshots` | Public route screenshot pilot for PR visual proof |
| `npm run test:e2e:headed` | Headed browser for debugging |
| `npm run test:e2e:report` | Open last HTML report |

Verification gate (same as issue #163):

```bash
npm run build
npm run lint
npm run test:e2e
```

---

## Test environment (mocked default)

Playwright starts Next.js with these **test-only** variables (see [playwright.config.ts](../../playwright.config.ts)):

| Name | Purpose |
|------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Fake API host intercepted by Playwright (`http://127.0.0.1:3099`) |
| `NEXT_PUBLIC_CLIENT_BASE_URL` | Frontend origin for checkout return URLs |
| `NEXT_PUBLIC_APP_URL` | Frontend metadata origin |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Mock key — Stripe CDN blocked in commerce tests |
| `JWT_SECRET` | Middleware JWT verification in OTP/auth-page tests |
| `PORT` | Next.js listen port (default `3000`) |

**Never commit values** for optional live-auth variables below.

---

## Optional live-auth suite (`@live`)

Tagged tests in [e2e/auth/roles.spec.ts](../../e2e/auth/roles.spec.ts) **explicitly skip** unless set:

| Name | Purpose |
|------|---------|
| `E2E_CUSTOMER_EMAIL` | Live customer login email |
| `E2E_CUSTOMER_PASSWORD` | Live customer login password |

Optional vendor/admin live variables (documented for future expansion):

| Name | Purpose |
|------|---------|
| `E2E_VENDOR_EMAIL` | Live vendor login |
| `E2E_VENDOR_PASSWORD` | Live vendor password |
| `E2E_ADMIN_EMAIL` | Live admin login |
| `E2E_ADMIN_PASSWORD` | Live admin password |

Do **not** point live tests at production unless your team explicitly approves a staging target.

---

## Layout

```
e2e/
  helpers/mockApi.ts       # Route registry + fixture loader
  helpers/authSession.ts   # localStorage session seeding
  helpers/stripeStub.ts    # Blocks Stripe CDN / stubs Stripe.js
  fixtures/api/*.json      # Deterministic API payloads
  public/marketplace.spec.ts
  auth/roles.spec.ts
  vendor/onboarding.spec.ts
  commerce/cart-checkout.spec.ts
playwright.config.ts
```

---

## Adding mocks

1. Add JSON under `e2e/fixtures/api/`
2. Register method + path handling in [e2e/helpers/mockApi.ts](../../e2e/helpers/mockApi.ts)
3. Prefer shapes from [FRONTEND_API_USAGE_INVENTORY.md](FRONTEND_API_USAGE_INVENTORY.md)

**Contract guardrails:**

- Use **`GET /api/featured-products`** only — never `/api/products/featured`
- Do not add Next.js API routes for test doubles
- Do not change production business logic to satisfy tests

---

## CI snippet (optional)

```yaml
- run: npx playwright install chromium
- run: npm run test:e2e
  env:
    CI: true
```

Artifacts: `playwright-report/`, `test-results/` (gitignored)

Screenshot QA details live in [PUBLIC_SCREENSHOT_QA_RUNBOOK.md](../PUBLIC_SCREENSHOT_QA_RUNBOOK.md).

---

## Safety rules

- No production customer, vendor, or admin credentials in repo
- No committed storage states or session cookies
- No live Stripe charges — commerce tests stub Stripe.js
- Authenticated `@live` tests skip when credentials are absent (never silent pass)
- Do not merge or deploy from this branch without review

---

## Known gaps

Not covered by mocked suite:

- Real OTP / Google OAuth
- Live Stripe `confirmPayment`
- Full admin CRUD beyond vendor-application list/detail render
- Service/food booking POST flows
- Cross-origin cookie behavior against real API hosts

---

## Rollback

Remove `e2e/`, `playwright.config.ts`, test scripts, and `@playwright/test` devDependency. No runtime production code is modified.
