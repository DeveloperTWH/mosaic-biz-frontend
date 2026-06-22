# Vendor Service Publication QA (#185)

**Issue:** [#185](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/185)  
**Epic:** [#177](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/177)  
**Last updated:** 2026-06-22

---

## Summary

Vendor service create/update flows now treat the backend response as source of truth for publication state. Draft vs publish actions produce distinct copy, inventory refreshes after redirect, and public listing links only appear when the public-read endpoint confirms visibility.

---

## Routes

| Route | Flow |
|-------|------|
| `/partners/[slug]/inventory/add-service` | Primary create form — Save Draft / Publish Service |
| `/partners/[slug]/inventory/edit-service/[id]` | Edit + publish toggle |
| `/partners/[slug]/inventory` | Inventory table with status badges and publish/unpublish |
| `/partners/add-service` | Legacy onboarding create — Save Draft / Publish Service |

---

## Status labels (inventory)

| Status | Meaning |
|--------|---------|
| Draft | `isPublished: false` — not visible publicly |
| Published | Published and publicly eligible |
| Published but not publicly eligible | Published on record but business/listing rules block marketplace visibility |
| Publication failed | Backend returned blockers |

Detail text shows `publication.nextAction` or `publication.publicBlockers` when present.

---

## Success copy matrix

| Action | Expected toast |
|--------|----------------|
| Save Draft | “Draft saved. This service is not visible to customers yet.” |
| Publish + public verify OK | “Service published and visible to customers.” |
| Publish + business inactive | Saved message + detail about eligibility |
| Publish + public verify fails | “Service saved, but public listing could not be verified yet.” |

---

## Public URL contract

Marketplace cards and inventory “View Public” links use:

`/vendor-profile/service-vendor/{serviceId}`

Verified via `GET /api/public/services/:serviceId`.

---

## Manual smoke checklist

Use a non-production `business_owner` test account.

1. **Draft save** — Save Draft on add-service → inventory shows Draft, no public link.
2. **Publish active business** — Publish Service → inventory shows Published, View Public opens storefront.
3. **Inventory refresh** — After create/edit redirect, new row appears without manual refresh (`?updated=1`).
4. **Publish ineligible business** — If business inactive, badge shows ineligible + actionable detail (no false “visible” toast).
5. **Unpublish** — Unpublish from inventory → Draft status, public link hidden.
6. **Legacy add-service** — `/partners/add-service` draft vs publish buttons behave consistently.

---

## Commands

```powershell
npm run test:unit
npm run build
```

---

## Build / test proof

| Command | Result |
|---------|--------|
| `npm run test:unit` | Document after run |
| `npm run build` | Document after run |

---

## Known limits

- Public visibility still requires backend rules: `Service.isPublished === true` and owning `Business.isActive === true`.
- Legacy `/api/service/parent` flow remains for `/partners/add-service`; partner inventory uses `POST /api/service`.
- Runtime smoke against staging API requires credentials — not run in harness-only CI.
