# Marketplace vendor eligibility

**See also:** [PLATFORM_OPERATING_MODEL.md](PLATFORM_OPERATING_MODEL.md) for the full platform picture (shipping, orders, payments).

This document explains why admin "Active" businesses may not appear on `/vendors`, and why checkout can fail for products that still appear in the catalog.

## Customer-facing rules

A vendor is **publicly listable** only when **both** are true:

| Field | Meaning |
|-------|---------|
| `isApproved` | Vendor application finalized by admin |
| `isActive` | Admin toggle on the business record |

Public endpoints that should enforce this:

- `GET /api/business` — vendor directory (`/vendors`)
- `GET /api/products/list`, `GET /api/ranked`, `GET /api/public/search`
- `GET /api/public/product/:id`
- `GET /api/public/products/business/:businessId`
- `POST /api/cart/add`
- `GET /api/cart` — should flag or remove lines from ineligible vendors

`POST /api/orders/initiate` already blocks unapproved vendors (source of the checkout error).

## Admin UI (frontend)

The admin business list now shows three distinct states:

- **Approved** — vendor application finalized
- **Admin active** — `isActive` toggle
- **Public on marketplace** — approved **and** active

Previously the UI used `isActive ?? isApproved`, which marked businesses as "Active" when only one flag was true.

## Backend follow-up (required)

**Ready-to-send prompt:** [BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md](BACKEND_AGENT_PROMPT_VENDOR_ELIGIBILITY_AND_DOCS.md)

Run a backend agent against `Techware-Hut/mosaic-backend` to:

1. Align `GET /api/business` filters with `isApproved && isActive` (and any onboarding/Connect requirements).
2. Filter public product list/detail endpoints by eligible `businessId`.
3. Reject `POST /api/cart/add` for ineligible vendors with a clear message.
4. On `GET /api/cart`, return `vendorEligibility` metadata or strip invalid lines.
5. Ensure admin `PATCH /api/admin/business/status/:id` cannot imply public listing without `isApproved`.
6. Ensure vendor application finalize sets `isApproved: true`.

## Frontend diagnostics

- Checkout failures log to the console as `[marketplace] Checkout blocked by vendor eligibility` with business/product IDs.
- A `marketplace:checkout-eligibility-failed` browser event is dispatched for future monitoring hooks (e.g. Sentry).
