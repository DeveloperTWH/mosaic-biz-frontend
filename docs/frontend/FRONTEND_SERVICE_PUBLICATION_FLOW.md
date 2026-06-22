# Frontend Service Publication Flow — Issue #185

**Branch:** `fix/frontend-service-publication-visibility-flow`  
**Issue:** [#185](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/185)  
**Backend contract:** Model A (one parent `Service` per business, embedded `services[]` children, additive `publication` metadata)  
**Last updated:** 2026-06-22

---

## Root cause (frontend)

| # | Issue | Fix |
|---|--------|-----|
| 1 | Partner inventory forms sent `services: [{ name }]` only | Full child DTO via `ChildServiceFields` + `serializeServiceChildren()` |
| 2 | Success toasts on HTTP 2xx without reading response | `parseServiceMutationResponse()` + `getPublicationSuccessMessage()` |
| 3 | Inventory used `isPublished` only; wrong public URL | Status badges from `getInventoryStatus()`; public link → `/vendor-profile/service-vendor/:id` |

---

## Approved DTO

### Request — `POST /api/service`, `PUT /api/service/:id`

```json
{
  "businessId": "…",
  "title": "Salon Services",
  "description": "Professional services",
  "isPublished": false,
  "price": 25,
  "duration": "30 min",
  "services": [{
    "name": "Haircut",
    "description": "Standard cut",
    "durationMinutes": 30,
    "price": 25,
    "image": "https://…"
  }],
  "categories": [{ "categoryId": "…", "subcategoryIds": [] }],
  "coverImage": "https://…",
  "images": [],
  "videos": [],
  "features": ["…"],
  "amenities": [],
  "businessHours": [],
  "location": { "type": "Point", "coordinates": [-76.2, 36.8] },
  "contact": { "phone": "…", "email": "…", "address": "…" },
  "faq": [],
  "maxBookingsPerSlot": 1
}
```

### Before (broken)

```json
{
  "services": [{ "name": "Haircut" }],
  "price": 0,
  "duration": "30 min",
  "isPublished": true
}
```

### After (canonical)

See request example above — every child includes `durationMinutes` and `price`.

### Response (owner create/update)

```json
{
  "success": true,
  "service": { "_id": "…", "isPublished": true, "services": […] },
  "publication": {
    "isPublished": true,
    "isPubliclyVisible": true,
    "publicEligibility": "eligible",
    "publicBlockers": [],
    "nextAction": "…"
  }
}
```

When `publication` is absent (older API), publish success falls back to `GET /api/public/services/:id` probe before claiming visibility.

---

## UX copy

| Scenario | Message |
|----------|---------|
| Draft saved | Draft saved. This service is not visible to customers yet. |
| Published + verified public | Service published and visible to customers. |
| Published + business ineligible | Your service was saved, but your business is not currently eligible for public display. |
| Published but public probe fails | Service saved, but public listing could not be verified yet. |

---

## Inventory status matrix

| Status | Condition | Public link |
|--------|-----------|-------------|
| Draft | `!isPublished` | Hidden |
| Published | `isPublished` + publicly visible | `/vendor-profile/service-vendor/:id` |
| Published but not publicly eligible | `publicEligibility === business_inactive` or `isPubliclyVisible === false` | Hidden |
| Publication failed | `publicBlockers.length > 0` | Hidden |

---

## Files changed

| File | Change |
|------|--------|
| `lib/api/services.ts` | API client, serializers, publication helpers |
| `lib/api/services.test.ts` | Unit tests (13 suites) |
| `types/service.ts` | `ServiceChild`, `ServicePublication` |
| `inventory/components/ChildServiceFields.tsx` | Shared child option editor |
| `inventory/add-service/CreateServiceForm.tsx` | Draft/publish + response-driven UX |
| `inventory/edit-service/.../EditServiceForm.tsx` | Draft/publish/unpublish |
| `components/ServiceTable.tsx` | Status badges, row actions, verified public link |
| `inventory/page.tsx`, `partners/[businessid]/page.tsx` | `onServicesChanged` refresh |

---

## Verification

| Command | Result |
|---------|--------|
| `npm run build` | Pass |
| `npm run test:unit` | Pass (19 tests) |
| `npm run lint` | Baseline debt unchanged (not introduced in scope) |

### Manual smoke checklist (#185)

- [ ] Save draft → inventory **Draft**, no public link
- [ ] Publish valid service → inventory **Published**, appears on `/services`, detail at `/vendor-profile/service-vendor/:id`
- [ ] Invalid child (price 0) → inline errors, form preserved
- [ ] Inactive business → eligibility message, no false public claim
- [ ] Publish existing draft → same `_id`, no duplicate
- [ ] Unpublish → public 404, inventory row remains
- [ ] Refresh/re-login → status from API
- [ ] Mobile 390px → create, draft, publish, view-public

### Screenshot evidence paths

Capture on preview after backend contract deploy:

- `docs/frontend/evidence/service-publication/inventory-draft-desktop.png`
- `docs/frontend/evidence/service-publication/inventory-published-desktop.png`
- `docs/frontend/evidence/service-publication/create-form-mobile-390.png`
- `docs/frontend/evidence/service-publication/public-listing-desktop.png`

---

## Risks

| Risk | Mitigation |
|------|------------|
| Backend `publication` block not deployed | Public probe fallback; types isolated in `lib/api/services.ts` |
| Legacy `/service/[slug]` route still exists | Inventory links only to vendor-profile canonical route |

## Rollback

Revert branch `fix/frontend-service-publication-visibility-flow` — restores thin child payloads and optimistic publish toasts.

## Not tested in this PR

- Live API against repaired backend branch (backend proof doc branch not on GitHub at implementation time)
- Full browser smoke with vendor test credentials on production
- Stripe, Connect, bookings, auth changes (out of scope)

---

## Related endpoints

| Surface | Endpoint |
|---------|----------|
| Create/update | `POST /api/service`, `PUT /api/service/:id` |
| Owner list | `GET /api/private/services/list` |
| Owner read | `GET /api/service/:id` |
| Public list | `GET /api/services/list` |
| Public detail | `GET /api/public/services/:serviceId` |

Do **not** close #185 until a newly published service is visible in vendor inventory, public `/services`, and `/vendor-profile/service-vendor/:id`.
