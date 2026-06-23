# Mosaic Biz Hub — Platform Operating Model

**Type:** Reference (source of truth)  
**Audience:** PM, QA, frontend, backend, stakeholders  
**Last updated:** 2026-06-23

This document describes **what the platform is supposed to do** — in plain language and with technical anchors. Use it for meetings, onboarding, and cross-repo alignment. When code or older docs disagree with this file, treat this as the intended operating model and file a defect.

**Related docs:**

- [MARKETPLACE_VENDOR_ELIGIBILITY.md](MARKETPLACE_VENDOR_ELIGIBILITY.md) — admin vs public vendor visibility
- [BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md](BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md) — backend implementation prompt
- [API_CONTRACTS.md](API_CONTRACTS.md) — frontend API consumption
- [STRIPE_CONNECT_FRONTEND_FLOW.md](STRIPE_CONNECT_FRONTEND_FLOW.md) — vendor payout onboarding

---

## One-sentence summary

**Mosaic Biz Hub is a managed multi-vendor marketplace** where approved minority-owned businesses operate independent storefronts, customers discover and purchase from them, Stripe processes and routes payments, **vendors fulfill their own orders**, and admins govern trust, access, and marketplace activity.

Mosaic is **not** a warehouse or shipping company. It is the digital shopping center, payment coordinator, and trust layer.

---

## Mental model by role

| Role | Real-world equivalent | Primary surfaces |
|------|----------------------|------------------|
| Customer | Shopper | `/products`, `/cart`, `/checkout`, `/customer/order` |
| Vendor (`business_owner`) | Independent shopkeeper | `/partners/*` onboarding, `/partners/[id]/*` dashboard |
| Admin | Mall manager / trust officer | `/admin/*` |
| Frontend | Storefronts, carts, dashboards | This repo |
| Backend API | Security, ledger, rules engine | `Techware-Hut/mosaic-backend` |
| Stripe | Cash register + payout network | PaymentIntents + Connect |
| Carrier | USPS, UPS, FedEx, courier | **Outside** Mosaic in MVP |

---

## End-to-end commercial heartbeat

```text
Vendor applies → Admin approves → Vendor completes profile
    → Vendor selects plan → Vendor connects Stripe
    → Vendor creates listings → Customer discovers listings
    → Customer adds to cart → Backend creates order + PaymentIntent
    → Stripe confirms payment (webhook) → Vendor accepts order
    → Vendor ships + enters tracking → Customer receives order
    → Return / refund / review paths may follow
```

Products, services, and food share the marketplace shell but may use **different backend models and fulfillment flows**. Do not assume product checkout proves service booking or food ordering.

---

## Vendor eligibility and public visibility

A business is **publicly listable** only when **both** are true:

| Field | Meaning |
|-------|---------|
| `isApproved` | Admin finalized the vendor application |
| `isActive` | Admin toggle on the business record |

**Admin “Active” alone does not mean public.** The admin UI now shows three separate states: Approved, Admin active, Public on marketplace.

Public endpoints that must enforce `isApproved && isActive`:

- `GET /api/business` — vendor directory (`/vendors`)
- Product list, search, and public detail endpoints
- `POST /api/cart/add`
- Ideally `GET /api/cart` (flag or strip ineligible lines)

`POST /api/orders/initiate` already rejects ineligible vendors at checkout. Frontend guardrails in `lib/marketplace/businessEligibility.ts` block add-to-cart and checkout earlier when status is known.

**Stripe Connect is separate:** a vendor may be approved but cannot receive payments until Connect onboarding completes (`stripeConnectAccountId`, charges/transfers enabled).

---

## Vendor journey

### 1. Account and application

1. Register as `business_owner`.
2. Complete Stage 1 application + document upload.
3. Pay $24.99 verification fee.
4. Submit application (`POST /api/vendor-onboarding/submit` — blocked until payment succeeds).
5. Admin reviews and approves or rejects.

On approval, backend must set `isApproved: true` (and admin may activate with `isActive: true`).

### 2. Storefront setup

- Complete business profile (name, description, images, address, categories).
- Select subscription tier and pay.
- Connect Stripe for payouts (`/partners/payout-setup`).
- Configure **business-level** shipping and tax settings.
- Create listings (products, services, or food depending on business type).

### 3. Order fulfillment (products)

Vendors are responsible for **physical fulfillment**:

1. See paid orders in partner dashboard.
2. Accept or reject each order.
3. Package the product (vendor supplies boxes, labels, postage).
4. Ship via carrier of vendor’s choice.
5. Enter tracking ID and tracking URL in Mosaic.
6. Mark shipped, then delivered.

Mosaic does **not** purchase shipping labels or calculate live USPS/UPS/FedEx rates in MVP.

---

## Customer journey

1. **Discover** — browse `/products`, `/services`, `/foods`, `/vendors`, `/search`.
2. **Featured products** — canonical route: `GET /api/featured-products` (not `/api/products/featured`).
3. **Detail** — view listing, variants, price, vendor.
4. **Cart** — add/update/remove items; **single-vendor cart only** at checkout today.
5. **Checkout** — shipping address, delivery speed, server-recalculated totals.
6. **Pay** — Stripe Elements; order created before payment completes.
7. **Track** — order history, status emails, tracking when vendor ships.

The customer’s browser does not dictate final price. Backend validates stock, prices, vendor eligibility, shipping, and tax on `POST /api/orders/initiate`.

---

## Admin journey

Admins govern trust and marketplace operations — they do not sell inventory.

| Area | Responsibility |
|------|----------------|
| Vendor applications | Review, approve/reject Stage 1 |
| Businesses | Approve, activate/deactivate, investigate status mismatches |
| Categories | Product, service, food taxonomy |
| Products | List, feature toggle; full moderation workflow may vary |
| Orders | View all orders; investigate payment/fulfillment issues |
| Content | FAQs, testimonials, CMS pages |
| Escalation | Refunds/disputes when vendor response is inadequate |

---

## Shipping model (MVP)

### Who sets the price?

**The vendor**, at the **business** level via shipping settings:

- `GET /api/business/:id/shipping-settings`
- `PUT /api/business/:id/shipping-settings`

### Pricing systems

| System | Behavior |
|--------|----------|
| Flat rate | Same shipping price regardless of quantity |
| Quantity based | Tiered prices by item count in cart |

For each system, vendor configures standard, express, and local delivery rates, plus optional free-shipping threshold.

### How checkout calculates shipping

At cart/checkout the backend:

1. Sums product subtotal (tax-inclusive in current implementation).
2. Counts total items.
3. Checks free-shipping threshold.
4. Looks up vendor’s rate for selected delivery speed.
5. Stores shipping method, amount, and tier **on the order** (snapshot).

### Who ships?

**The vendor.** They buy postage, pack the order, hand off to a carrier, and enter tracking in the partner dashboard. Customer shipping charges are included in the Stripe payment; proceeds route to the vendor’s Connect account (minus platform fee) so the vendor can cover fulfillment.

### Known limitations

- **Single-vendor checkout** — cart resets when switching vendors; backend rejects multi-vendor orders.
- **No live carrier rates** — vendor-defined flat/quantity rates only.
- **Possible display mismatch** — older product-level shipping hints vs business-level checkout calculation; test product page vs cart totals.
- **Free-shipping threshold** — currently evaluated on tax-inclusive subtotal; confirm business policy.

---

## Orders and payments

### Order creation

Primary route: `POST /api/orders/initiate`

Sequence:

1. Customer submits checkout.
2. Backend validates cart, stock, prices, vendor eligibility, Connect readiness, shipping, tax.
3. Backend creates order (`status: created`, `paymentStatus: pending`).
4. Backend creates Stripe PaymentIntent (vendor Connect destination).
5. Frontend completes payment with `clientSecret`.
6. Stripe webhook `payment_intent.succeeded` marks order paid (`status: ordered`).

### Order statuses (product orders)

`created` → `ordered` → `accepted` → `shipped` → `delivered`

Alternate paths: `rejected`, `cancelled`, `returned`, `refunded`

### Multi-vendor checkout

The marketplace is multi-vendor overall, but **each checkout is single-vendor** in the current implementation. `groupOrderId` in the order model supports grouped customer experience in future; do not promise multi-vendor cart in MVP without backend + frontend changes.

---

## API path conventions

| Topic | Canonical |
|-------|-----------|
| Featured products | `GET /api/featured-products` |
| Product CRUD router mount | `/api/product` (singular) — some backend file comments incorrectly say `/api/products` |
| Order initiation | `POST /api/orders/initiate` |
| Public vendor directory | `GET /api/business` |

Verify runtime paths in deployed API, not stale comments.

---

## Frontend guardrails (2026-06-23)

| Surface | Behavior |
|---------|----------|
| Admin businesses | Separate Approved / Admin active / Public on marketplace |
| Product detail | Eligibility banner; block add-to-cart when ineligible |
| Cart | Preflight eligibility; disable Place order when blocked |
| Checkout | Maps backend “not an approved vendor” to shopper-safe copy |
| `/vendors` | Copy explains public listing requires approval + active |

Implementation: `lib/marketplace/businessEligibility.ts`, `lib/marketplace/fetchPublicVendorEligibility.ts`, `lib/admin/businessStatusDisplay.ts`.

---

## What still requires backend alignment

See [MARKETPLACE_VENDOR_ELIGIBILITY.md](MARKETPLACE_VENDOR_ELIGIBILITY.md) and [BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md](BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md).

Until backend filters public catalog/cart endpoints, ineligible vendor products may still appear in browse/search while checkout fails — frontend mitigates but does not replace server enforcement.

---

## Meeting-ready phrasing

> Mosaic Biz Hub is a marketplace, not a warehouse. Vendors set their own shipping prices, fulfill their own orders, and enter tracking. Customers pay through Stripe; money routes to the vendor’s connected account. A vendor appears publicly only when admin has both approved the application and activated the business. Checkout requires an approved, active vendor with Stripe Connect ready.
