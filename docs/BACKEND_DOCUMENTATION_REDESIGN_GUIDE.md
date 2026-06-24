# Backend Documentation Redesign Guide

**Type:** Playbook (cross-repo)  
**Audience:** Backend dev, agent sessions, PM/QA  
**Last updated:** 2026-06-23  
**Backend repo:** `Techware-Hut/mosaic-backend`  
**Frontend repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`

Use this guide to run the **same documentation redesign** we did on the frontend — so backend docs, frontend docs, and deployed behavior all agree.

---

## What “done” looks like

| Outcome | Test |
|---------|------|
| One platform story | A PM can read backend `PLATFORM_OPERATING_MODEL.md` and frontend `PLATFORM_OPERATING_MODEL.md` without contradictions |
| One API contract | Every route the frontend calls exists, is documented, and behaves as described |
| Clear doc hierarchy | New dev knows: source of truth → living status → reference → archive |
| Code wins | Stale comments in route files match actual mount paths and filters |
| Archive, don’t delete | Old sprint/QA docs indexed but demoted |

---

## Phase 0 — Sync the cross-repo baseline (30 min)

Before touching backend docs, pin these **frontend files** as the consumer contract:

| Frontend doc | Path in frontend repo | Backend must agree on |
|--------------|----------------------|------------------------|
| Platform behavior | `docs/PLATFORM_OPERATING_MODEL.md` | Eligibility, shipping, orders, payments, journeys |
| Vendor eligibility | `docs/MARKETPLACE_VENDOR_ELIGIBILITY.md` | `isApproved && isActive`, cart/catalog filters |
| API consumption | `docs/API_CONTRACTS.md` | Every endpoint the UI calls |
| Legacy paths | `docs/BACKEND_FRONTEND_ROUTE_CONTRACT.md` | `/admin/api/*` vs `/api/admin/*`, `/stripe/*` |
| Stripe Connect (UI) | `docs/STRIPE_CONNECT_FRONTEND_FLOW.md` | Connect routes + webhook side effects |

**Clone both repos side by side** (or open two agent sessions) so you can grep frontend calls and backend routes in one pass.

```bash
# Frontend — what we actually call
rg "NEXT_PUBLIC_API_BASE_URL|/api/" --glob "*.{ts,tsx}" -l
rg "'/api/|\"/api/" docs/API_CONTRACTS.md

# Backend — what we actually expose (run in mosaic-backend)
rg "router\.(get|post|put|patch|delete)|app\.use\(" --glob "**/*.{js,ts}"
rg "isApproved|isActive" --glob "**/*.{js,ts}"
```

---

## Phase 1 — Inventory and categorize (1–2 hrs)

List every markdown file under backend `docs/` (and README fragments). Sort each into **one** bucket:

| Bucket | Definition | Action |
|--------|------------|--------|
| **Source of truth** | Intended platform behavior | Maintain; max 2–4 files |
| **Living** | Current ship posture, blockers | Update each release |
| **Reference** | Architecture, API inventory, env, auth | Maintain; link from hub |
| **Evidence / archive** | Sprint snapshots, dated QA, audits | Index in `docs/archive/README.md`; add banner |
| **Redundant** | Stub redirects, empty duplicates | Delete or merge |

### Likely backend doc groups to merge

| Topic | Problem | Target |
|-------|---------|--------|
| API inventory | Multiple lists with different paths | Single `docs/API_INVENTORY.md` generated or maintained from `app.js` / route mounts |
| Payment flow | Scattered Stripe notes | `docs/PAYMENTS_AND_STRIPE.md` |
| Vendor onboarding | Comments in routes vs wiki | `docs/VENDOR_ONBOARDING.md` aligned with frontend surface map |
| Shipping | Only in code comments | `docs/SHIPPING_MODEL.md` section inside operating model |
| Security audit notes | Old “unauthenticated route” lists | Living `docs/SECURITY_POSTURE.md` with verified auth per route |

---

## Phase 2 — Verify code vs docs (core audit)

For each **public marketplace** and **commerce** route, record four columns:

| Endpoint | Mounted path (runtime) | Auth | Eligibility filter | Frontend caller |
|----------|------------------------|------|-------------------|-----------------|

### Priority routes (must match frontend `API_CONTRACTS.md`)

**Public read**

- `GET /api/featured-products` — canonical; do not document `/api/products/featured` as primary
- `GET /api/products/list`
- `GET /api/business`
- `GET /api/ranked`
- `GET /api/public/search`
- `GET /api/public/product/:id`
- `GET /api/public/product/vendor-profile/:id`
- `GET /api/product/:id`

**Cart**

- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update/:id`, `DELETE /api/cart/remove/:id`
- `GET /api/cart/count`, `POST /api/cart/merge`

**Checkout / orders**

- `POST /api/orders/initiate`
- `GET /api/orders/user`, `GET /api/orders/vendor`, `GET /api/orders/admin`
- Webhook: `payment_intent.succeeded` (document handler file + status transitions)

**Vendor / admin**

- `POST /api/vendor-onboarding/submit`
- Admin finalize / approve — must set `isApproved: true`
- `PATCH` business status — document `isActive` vs public listing

**Shipping / business**

- `GET/PUT /api/business/:id/shipping-settings`
- Document flat vs quantity-based calculation and free-shipping threshold behavior

### Known mismatches to fix (from frontend audit)

| Issue | Backend action |
|-------|----------------|
| Route comments say `/api/products` (plural) | Fix comments to match mount at `/api/product` (singular) if that is runtime truth |
| `isActive` without `isApproved` in public queries | Add shared `isPublicMarketplaceBusiness()` filter |
| Products visible but checkout fails | Filter list/search/featured/cart at source |
| Featured route alternate | Deprecate `/api/products/featured` in docs if it still exists server-side |

---

## Phase 3 — Define backend doc hierarchy

Mirror the frontend structure:

```
docs/README.md                          ← hub (start here)
├── PLATFORM_OPERATING_MODEL.md         ← source of truth (mirror frontend)
├── MARKETPLACE_VENDOR_ELIGIBILITY.md   ← mirror frontend + backend file refs
├── PROJECT_STATUS.md                   ← living (backend ship posture)
├── ARCHITECTURE.md                     ← Express/Mongo layout, middleware, deploy
├── API_INVENTORY.md                    ← all routes: method, path, auth, filters
├── DATA_MODELS.md                      ← Business, Order, Product, User key fields
├── PAYMENTS_AND_STRIPE.md              ← PaymentIntent, Connect, webhooks, refunds
├── VENDOR_ONBOARDING.md                ← stage1, payment, approve, isApproved
├── SHIPPING_AND_TAX.md                 ← business-level rules, order snapshot
├── AUTH_AND_SESSION.md                 ← cookies, roles, CORS origins
├── SECURITY_POSTURE.md                 ← auth per route; known risks + status
├── ENVIRONMENT.md                      ← env var names only
├── FRONTEND_CONTRACT.md                ← link to frontend API_CONTRACTS.md + drift check
└── archive/README.md                   ← dated audits indexed, not promoted
```

**Rule of thumb (copy to backend `docs/README.md`):**

- “What is the platform supposed to do?” → `PLATFORM_OPERATING_MODEL.md`
- “What routes exist and who can call them?” → `API_INVENTORY.md`
- “Where are we today?” → `PROJECT_STATUS.md`
- “Old sprint notes?” → `archive/README.md`

---

## Phase 4 — Write / align source-of-truth docs

### 4a. `PLATFORM_OPERATING_MODEL.md`

**Do not invent a different story.** Start from the frontend file and add backend-specific sections:

- MongoDB collections and key fields (`Business.isApproved`, `Business.isActive`, `Order.status`, etc.)
- Middleware order (auth → role → business scope)
- Webhook-driven state transitions (payment → `ordered`)
- What the backend enforces vs what the frontend only displays

Cross-link:

```markdown
Frontend mirror: Digital-Builders-757/mosaic-biz-frontend-launch/docs/PLATFORM_OPERATING_MODEL.md
```

### 4b. `API_INVENTORY.md`

One table per domain. Minimum columns:

| Method | Path | Auth | Roles | Eligibility / filters | Controller file |
|--------|------|------|-------|----------------------|-----------------|

Mark **canonical** vs **legacy** vs **deprecated**.

### 4c. `FRONTEND_CONTRACT.md`

Explicit drift checklist — run after every frontend release:

```markdown
## Contract check (date: YYYY-MM-DD)

| Frontend endpoint (API_CONTRACTS.md) | Backend route | Match? |
|--------------------------------------|---------------|--------|
| GET /api/featured-products             |               |        |
| POST /api/orders/initiate            |               |        |
| ...                                  |               |        |
```

### 4d. Fix inline code comments

Grep backend for misleading path strings:

```bash
rg "/api/products" --glob "**/*.{js,ts,md}"   # plural in comments?
rg "featured" routes/
rg "app.use.*product" .
```

Update comments to match `app.use('/api/product', ...)` (or whatever `app.js` shows).

---

## Phase 5 — Archive pass (same as frontend)

1. Create `docs/archive/README.md` with grouped links (sprint, security audit snapshots, old API lists).
2. Add banner to top of each archived doc:

   ```markdown
   > **Archived — YYYY-MM-DD.** See docs/archive/README.md. Current behavior: PLATFORM_OPERATING_MODEL.md
   ```

3. Remove archived docs from “new developer” reading paths in `docs/README.md`.
4. Delete stub files that only say “moved to …”.

**Do not delete** dated QA — index them.

---

## Phase 6 — Cross-repo verification script

Run after doc PR merges on both sides:

### A. Endpoint parity

For each row in frontend `docs/API_CONTRACTS.md`, confirm backend `API_INVENTORY.md` has the same method + path.

### B. Runtime smoke (read-only)

```bash
API=https://api.mosaicbizhub.com

curl -s "$API/api/featured-products?page=1&limit=5" | head
curl -s "$API/api/products/list?page=1&limit=5" | head
curl -s "$API/api/business?page=1&limit=5" | head
```

Document response shape in backend `API_INVENTORY.md` (not necessarily in frontend).

### C. Eligibility behavior

| Scenario | Expected |
|----------|----------|
| Business `isActive=true`, `isApproved=false` | Not in `GET /api/business`; products not in list/search/featured |
| Both true | Listed publicly |
| Ineligible product | `POST /api/cart/add` → 4xx with clear message |
| Eligible + Connect ready | `POST /api/orders/initiate` succeeds |

### D. Sign-off table (paste in both repos’ `PROJECT_STATUS.md`)

| Check | Frontend doc | Backend doc | Runtime | Owner | Date |
|-------|--------------|-------------|---------|-------|------|
| Featured route | API_CONTRACTS | API_INVENTORY | curl 200 | | |
| Eligibility filter | MARKETPLACE_VENDOR_ELIGIBILITY | MARKETPLACE_VENDOR_ELIGIBILITY | QA account | | |
| Order initiate | PLATFORM_OPERATING_MODEL | PAYMENTS_AND_STRIPE | test mode | | |

---

## Phase 7 — Backend agent prompt (copy-paste)

Use this to kick off an agent session on `mosaic-backend`:

---

**Mission:** Documentation redesign + contract alignment with Mosaic frontend.

**Reference (read first):**

- Frontend `docs/PLATFORM_OPERATING_MODEL.md`
- Frontend `docs/API_CONTRACTS.md`
- Frontend `docs/MARKETPLACE_VENDOR_ELIGIBILITY.md`
- Frontend `docs/BACKEND_DOCUMENTATION_REDESIGN_GUIDE.md` (this file)

**Tasks:**

1. Inventory all `docs/**/*.md`; categorize as source-of-truth / living / reference / archive.
2. Create or restructure `docs/README.md` hub (active vs archive sections).
3. Create `docs/PLATFORM_OPERATING_MODEL.md` — mirror frontend platform story; add Mongo models, middleware, webhooks.
4. Create `docs/API_INVENTORY.md` — every route with auth, roles, eligibility filters, controller path.
5. Create `docs/FRONTEND_CONTRACT.md` — table mapping frontend `API_CONTRACTS.md` endpoints to backend routes; flag drift.
6. Create `docs/archive/README.md`; add archive banners to superseded docs.
7. Fix stale route comments (`/api/product` vs `/api/products`, featured-products canonical path).
8. Implement `isPublicMarketplaceBusiness()` and apply to public catalog/cart endpoints (see `BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md`).
9. Add tests for eligibility filters where test patterns exist.
10. Open PR with summary, doc hierarchy diagram, and QA checklist.

**Out of scope unless broken:** changing webhook event types, Connect account creation flow.

**Deliverables in PR:**

- [ ] `docs/README.md` hub
- [ ] `docs/PLATFORM_OPERATING_MODEL.md`
- [ ] `docs/API_INVENTORY.md`
- [ ] `docs/FRONTEND_CONTRACT.md`
- [ ] `docs/archive/README.md`
- [ ] Eligibility code + tests
- [ ] No contradiction with frontend `API_CONTRACTS.md` for listed endpoints

---

## Phase 8 — Ongoing maintenance (prevent drift)

| Trigger | Action |
|---------|--------|
| New frontend API call | Add to `API_CONTRACTS.md` + backend `API_INVENTORY.md` in same PR cycle |
| New backend route | Add to `API_INVENTORY.md`; notify frontend if UI should call it |
| Business rule change | Update **both** `PLATFORM_OPERATING_MODEL.md` files |
| Sprint / QA doc | File under `docs/archive/` with date prefix; link from archive index only |
| Release | Update both `PROJECT_STATUS.md` files + run `FRONTEND_CONTRACT.md` checklist |

### Suggested PR template (backend)

```markdown
## Docs
- [ ] API_INVENTORY.md updated for route changes
- [ ] PLATFORM_OPERATING_MODEL.md updated if behavior changed
- [ ] FRONTEND_CONTRACT.md drift check dated

## Cross-repo
- [ ] Matching frontend API_CONTRACTS.md row exists
- [ ] Eligibility rules consistent with MARKETPLACE_VENDOR_ELIGIBILITY.md
```

---

## Quick reference — platform truths both repos must share

| Topic | Agreed behavior |
|-------|-----------------|
| Public vendor listing | `isApproved && isActive` |
| Checkout blockers | Above + Stripe Connect ready for payment |
| Featured products | `GET /api/featured-products` only (canonical) |
| Product router | `/api/product` mount (singular) — verify in `app.js` |
| Order create | `POST /api/orders/initiate` → pending order + PaymentIntent |
| Payment confirm | Stripe webhook → `ordered` / `paid` |
| Shipping | Vendor-defined business-level rates; snapshot on order |
| Fulfillment | Vendor ships, enters tracking; not platform warehouse |
| Cart | Single-vendor checkout only |
| Roles | `customer`, `business_owner`, `admin` |

---

## Related frontend docs

| Doc | Purpose |
|-----|---------|
| [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) | Copy baseline for backend mirror |
| [API_CONTRACTS.md](API_CONTRACTS.md) | Consumer contract to verify against |
| [MARKETPLACE_VENDOR_ELIGIBILITY.md](MARKETPLACE_VENDOR_ELIGIBILITY.md) | Eligibility rules |
| [BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md](BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md) | Narrow implementation prompt |
| [BACKEND_FRONTEND_ROUTE_CONTRACT.md](BACKEND_FRONTEND_ROUTE_CONTRACT.md) | Legacy path map |
| [archive/README.md](archive/README.md) | How we demoted frontend QA sprawl |

---

## Meeting one-liner

> We run one platform story in two repos: frontend docs say what the UI does and calls; backend docs say what the API enforces and stores. `PLATFORM_OPERATING_MODEL` and `API_INVENTORY` / `API_CONTRACTS` are the pair that must stay in lockstep; everything else is either living status or archive.
