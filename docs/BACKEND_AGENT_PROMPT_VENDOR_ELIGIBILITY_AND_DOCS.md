# Backend Agent Prompt — Vendor Eligibility + Platform Documentation

**Copy everything below the line into your backend agent session** (repo: `Techware-Hut/mosaic-backend`, base URL: `https://api.mosaicbizhub.com`).

---

## Context

The Mosaic Biz Hub frontend (`Digital-Builders-757/mosaic-biz-frontend-launch`) shipped vendor eligibility guardrails on `develop` @ `671d7f98`. Production symptom:

- Admin shows many businesses as "Active"
- `/vendors` only lists businesses that are **both** approved and active (e.g. only Satya Electronics)
- Products from inactive/unapproved vendors still appear in catalog/cart
- Checkout fails at `POST /api/orders/initiate` with "not an approved vendor"

**Root cause:** `isActive` and `isApproved` are separate flags. Admin UI previously conflated them. Public listing and checkout require both. Public product endpoints do not consistently filter by eligible `businessId`.

Frontend reference: `docs/MARKETPLACE_VENDOR_ELIGIBILITY.md` and `docs/PLATFORM_OPERATING_MODEL.md` in the frontend repo.

---

## Your mission

1. **Fix backend enforcement** so public marketplace data matches eligibility rules.
2. **Align admin finalize/activate flows** so approval sets `isApproved: true` and public listing semantics are unambiguous.
3. **Update backend documentation** to match the platform operating model (vendor journey, shipping, orders, payments, eligibility).
4. **Add tests** where the repo has patterns for route/integration tests.
5. **Open a PR** with a clear summary and QA steps.

Do **not** change Stripe Connect onboarding routes or payment webhook handlers unless required for eligibility checks. Do **not** break `GET /api/featured-products` — it is the canonical featured-products route.

---

## Eligibility rules (source of truth)

A business is **publicly listable** when:

```text
isApproved === true AND isActive === true
```

Optionally also require Stripe Connect readiness for **checkout** (already enforced at order initiate) — but public **listing** should not require Connect; only purchasability should.

Document these three admin states clearly:

| State | Field(s) | Effect |
|-------|----------|--------|
| Approved | `isApproved` | Vendor application finalized |
| Admin active | `isActive` | Admin toggle |
| Public on marketplace | both true | Appears on `/vendors`, public catalog, cart |

---

## Required code changes

### 1. Shared eligibility helper

Create or centralize something like:

```javascript
function isPublicMarketplaceBusiness(business) {
  return Boolean(business?.isApproved && business?.isActive);
}
```

Use it in all public read paths and cart mutations. Export for reuse in controllers/services.

### 2. Filter public endpoints

Apply eligibility filter (by `businessId` or populated `business`):

| Endpoint | Expected behavior |
|----------|-------------------|
| `GET /api/business` | Return only eligible businesses (confirm current filter matches `isApproved && isActive`) |
| `GET /api/products/list` | Exclude products whose business is ineligible |
| `GET /api/ranked` | Exclude ineligible businesses’ listings |
| `GET /api/public/search` | Exclude ineligible listings |
| `GET /api/public/product/:id` | 404 or structured error if business ineligible |
| `GET /api/public/products/business/:businessId` | 404 if business ineligible |
| `GET /api/public/product/vendor-profile/:id` | 404 if business ineligible (frontend uses this for eligibility probe) |
| `GET /api/featured-products` | Exclude featured products from ineligible businesses |

### 3. Cart enforcement

| Endpoint | Expected behavior |
|----------|-------------------|
| `POST /api/cart/add` | Reject with 400/403 and clear message if vendor business is ineligible |
| `GET /api/cart` | Either remove ineligible lines or return per-line `vendorEligibility: { eligible, code, message }` |

Suggested error message (match frontend patterns):

```text
This vendor is not approved to accept orders on Mosaic Biz Hub.
```

### 4. Order initiate (verify, don’t regress)

`POST /api/orders/initiate` — confirm it checks `isApproved && isActive` and Stripe Connect. Return consistent error codes/messages the frontend already maps.

### 5. Admin flows

| Area | Expected behavior |
|------|-------------------|
| Vendor application finalize / approve | Must set `isApproved: true` on the Business |
| `PATCH /api/admin/business/status/:id` | Document that `isActive` alone does not make a business public |
| Admin business list API | Return both `isApproved` and `isActive` explicitly (do not derive a single "active" flag) |

### 6. Data audit script (optional but valuable)

Add a one-off script or admin diagnostic endpoint (auth-protected) listing:

- Businesses with `isActive && !isApproved`
- Businesses with products in public indexes but ineligible status
- Count of cart lines referencing ineligible businesses

---

## Documentation updates (backend repo)

Create or update these docs to align with frontend `docs/PLATFORM_OPERATING_MODEL.md`:

### `docs/PLATFORM_OPERATING_MODEL.md` (new or replace stale overview)

Include:

- One-sentence platform summary (marketplace, not warehouse)
- Role table (customer, vendor, admin)
- End-to-end commercial heartbeat diagram (text or mermaid)
- Vendor eligibility (`isApproved && isActive`)
- Vendor journey: application → approval → profile → plan → Stripe → listings
- Customer journey: browse → cart → checkout → pay → track
- Shipping MVP: vendor-defined business-level rates (flat or quantity-based); vendor fulfills; no live carrier rates; tracking required
- Single-vendor checkout constraint
- Order/payment sequence: initiate → PaymentIntent → webhook → ordered
- Canonical routes: `GET /api/featured-products`, `POST /api/orders/initiate`, `/api/product` mount (singular)

### `docs/MARKETPLACE_VENDOR_ELIGIBILITY.md`

Mirror frontend doc; add backend file references (middleware, controllers, query filters).

### `docs/API_INVENTORY.md` or equivalent

For each public endpoint, note whether eligibility filter is applied.

### Fix stale comments

Search for `/api/products` (plural) in route file comments where router mounts at `/api/product` (singular). Update comments to match actual mount paths.

---

## Testing checklist

Run and document:

1. Seed or use QA business with `isActive: true, isApproved: false` — must **not** appear on `GET /api/business`, product list, or search.
2. Same business’s product — must **not** be addable to cart.
3. Approved + active business — appears on `/api/business`, products listable, cart add succeeds (if Connect ready).
4. `POST /api/orders/initiate` with ineligible vendor — consistent 4xx + message.
5. Admin approve application — sets `isApproved: true`; after activate, business appears publicly.
6. `GET /api/featured-products` — no regressions; ineligible featured items excluded.

---

## PR description template

```markdown
## Summary
Align public marketplace endpoints and cart with vendor eligibility (`isApproved && isActive`).
Update platform documentation to match intended operating model.

## Changes
- Centralized eligibility helper
- Filtered public product/business/search/featured endpoints
- Cart add/get enforcement
- Admin approve sets isApproved
- Docs: PLATFORM_OPERATING_MODEL.md, MARKETPLACE_VENDOR_ELIGIBILITY.md

## QA
- [ ] Ineligible business hidden from GET /api/business
- [ ] Ineligible products hidden from list/search/featured
- [ ] POST /api/cart/add rejected for ineligible vendor
- [ ] Order initiate unchanged for eligible vendor with Connect
- [ ] Admin approve flow sets isApproved

## Frontend coordination
Frontend guardrails already deployed on develop @ 671d7f98.
After backend deploy, retest: /vendors, product detail, cart, checkout.
```

---

## Out of scope (unless explicitly requested)

- Multi-vendor cart/checkout
- Live USPS/UPS/FedEx rate integration
- Shipping label purchase
- Changing Stripe webhook event handling
- Removing legacy `/api/products/featured` route (can deprecate in docs if it exists server-side)

---

## Environments

- Production API: `https://api.mosaicbizhub.com`
- Frontend production: `https://mosaic-biz-frontend-launch.vercel.app`
- Frontend integration: `develop` branch on Vercel preview

After merge, coordinate deploy order: **backend first**, then verify frontend against production API.
