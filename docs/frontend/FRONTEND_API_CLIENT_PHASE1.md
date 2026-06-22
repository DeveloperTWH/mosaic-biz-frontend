# Frontend API Client — Phase 1 (#164)

**Branch:** `refactor/frontend-api-client-phase1`  
**Base SHA:** `df3b1b198262ef298c52d503ece6702e3c9662dc`  
**Issues:** #164 · #162 · credential review #123

---

## Before state (audit summary)

| Pattern | Location | Notes |
|---------|----------|-------|
| Axios singleton | `lib/api.ts` | `withCredentials: true`, hardcoded fallback base URL |
| Legacy `ApiError` | `lib/api/client.ts` | Axios-centric, no error kind taxonomy |
| Inline `fetch` | `utils/authUtils.ts`, `utils/logoutUser.ts`, `utils/cartUtils.ts`, `lib/api/vendorOnboarding.ts`, `lib/api/stripeConnect.ts` | Mixed JSON parsing; 404 sometimes treated as null, sometimes error |
| Inline axios | Admin vendor review pages | Manual 401/403 branching |
| Bearer optional | `vendorOnboarding.ts`, `stripeConnect.ts` | `localStorage` `auth_token` / `token` when present (#123 behavior preserved) |
| Route constants | `lib/api/routeContract.ts` | Legacy `/admin/*`, `/stripe/*` mounts unchanged |

Full pre-migration inventory: [FRONTEND_API_USAGE_INVENTORY.md](./FRONTEND_API_USAGE_INVENTORY.md)

---

## Phase 1 foundation

| Module | Purpose |
|--------|---------|
| `lib/api/errors.ts` | `ApiClientError` + kinds: unauthenticated, forbidden, notFound, validation, paymentPending, rateLimited, serverError, network, timeout, malformed |
| `lib/api/parseResponse.ts` | JSON / empty / non-JSON parsing; `requestId`, `fieldErrors`, backend message extraction |
| `lib/api/httpClient.ts` | `apiRequest`, `apiRequestEnvelope`, `credentials: "include"`, optional bearer, timeout, `notFoundReturnsNull` |
| `lib/api/authSession.ts` | `checkAuthSession`, `logoutSession` |
| `lib/api/orders.ts` | `initiateOrder`, user-safe order errors |
| `lib/api/vendorOnboardingAdmin.ts` | Admin vendor application list/detail/verify/finalize |

---

## Migrated call paths (phase 1)

| Domain | Endpoints | Entry module |
|--------|-----------|--------------|
| Auth session | `GET /api/users/auth/check` | `authSession.ts` → `utils/authUtils.ts` |
| Logout | `POST /api/users/logout` | `authSession.ts` → `utils/logoutUser.ts` |
| Vendor onboarding | `/api/vendor-onboarding/*` (draft, payment, submit, onboarding-data, business-profile) | `vendorOnboarding.ts` |
| Admin vendor review | `GET /pending`, `GET /:id`, `POST /:id/verify`, `POST /:id/finalize` | `vendorOnboardingAdmin.ts` |
| Order initiation | `POST /api/orders/initiate` | `orders.ts` → `utils/cartUtils.ts` `handlePlaceOrderFlow` |
| Stripe Connect | `GET /api/business/my`, `GET /api/connect/:id/status`, `POST /api/connect/:id/account-link` | `stripeConnect.ts` |

All migrated protected calls use `credentials: "include"`. Bearer header remains **optional** only on vendor onboarding + Connect modules (existing #123 evidence).

---

## Unmigrated (documented — phase 2+)

- Auth pages: login, signup, OTP, forgot-password (inline fetch)
- Marketplace browse: products, services, foods, search, vendors
- Cart CRUD except order initiation (`/api/cart/*`)
- Featured products (`lib/api/featured-products.ts` — axios)
- Admin legacy mounts (`/admin/users`, `/admin/api/products`)
- Stripe embedded dashboard legacy (`/stripe/*` via `routeContract.ts`)
- Partner inventory, bookings, orders, shipping/tax settings
- CMS, categories, subscriptions, uploads, contact

See updated rows in [FRONTEND_API_USAGE_INVENTORY.md](./FRONTEND_API_USAGE_INVENTORY.md).

---

## Acceptance proofs

| Requirement | Implementation |
|-------------|----------------|
| Missing vendor business data ≠ lost session | `getOnboardingData()` returns `null` on 404 via `notFoundReturnsNull`; `checkAuthSession()` returns `null` only for 401/invalid session |
| Admin wrong-role explicit | `mapAdminVendorFetchError()` maps `403` → `forbidden` message; thrown `ApiClientError` preserves backend message |
| Payment-pending recoverable | `402` → `paymentPending` kind; `VendorSubmissionError.status === 402` preserved for partners submit flow |
| Order errors user-safe | `getUserSafeOrderErrorMessage()` in checkout initiation path |
| Credentials on protected calls | `apiRequest` defaults to `credentials: "include"` |
| Canonical routes preserved | No path changes; `GET /api/featured-products` untouched |

---

## Scripts

```bash
npm run build
npm run lint
npm run test:unit
```

---

## Rollback

Revert PR branch. Domain modules fall back to prior inline fetch/axios. No schema or backend contract changes.
