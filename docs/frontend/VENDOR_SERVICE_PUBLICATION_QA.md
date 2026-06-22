# Vendor Service Publication QA (#185)

**Issue:** [#185](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/185)  
**Epic:** [#177](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/177)  
**PR:** [#186](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/186)  
**Last updated:** 2026-06-22 (post-backend integration smoke)

---

## Summary

Partner inventory and legacy add-service flows treat backend responses as source of truth for publication state. Draft vs publish actions produce distinct copy; inventory refreshes after redirect; public links target `/vendor-profile/service-vendor/:id` and appear only when visibility is verified.

---

## Routes

| Route | Flow |
|-------|------|
| `/partners/[slug]/inventory/add-service` | Primary create — Save Draft / Publish Service |
| `/partners/[slug]/inventory/edit-service/[id]` | Edit — Save Draft / Publish / Unpublish |
| `/partners/[slug]/inventory` | Status badges + row publish/unpublish |
| `/partners/add-service` | Legacy onboarding — Save Draft / Publish Service |

---

## Status labels (inventory — PR #186)

| Status | Meaning |
|--------|---------|
| Draft | `isPublished: false` |
| Published | Published and publicly eligible |
| Published but not publicly eligible | Published but business/listing rules block marketplace |
| Publication failed | Backend returned blockers |

---

## Success copy matrix

| Action | Expected toast |
|--------|----------------|
| Save Draft | “Draft saved. This service is not visible to customers yet.” |
| Publish + public verify OK | “Service published and visible to customers.” |
| Publish + business inactive | Saved message + eligibility detail |
| Publish + public verify fails | “Service saved, but public listing could not be verified yet.” |

---

## Post-backend smoke results (2026-06-22)

| Scenario | API (server-side) | PR preview UI | Production UI (main) |
|----------|-------------------|---------------|----------------------|
| 1 Save draft | Pass | Blocked (CORS) | Pass (Unpublished badge) |
| 2 Publish draft | Pass | Blocked (CORS) | Partial (legacy Published badge) |
| 3 Publish from create | Blocked (Model A one parent) | Blocked (CORS) | N/A |
| 4 Edit published | Pass | Blocked (CORS) | Not PR UI |
| 5 Unpublish | Pass | Blocked (CORS) | Pass (Unpublished badge) |
| 6 Validation failure | Pass (400) | Not captured | Not captured |
| 7 Ineligible business | Not tested | Not tested | Not tested |
| 8 Auth/session | Pass (401 unauthenticated) | Login blocked (CORS) | Pass (login 200) |

Evidence pack: [evidence/service-publication/README.md](evidence/service-publication/README.md)

---

## Commands

```powershell
npm run test:unit
npm run build
npm run lint
$env:SMOKE_EMAIL = "<vendor email>"; $env:SMOKE_PASSWORD = "<password>"; ./scripts/service-publication-api-smoke.ps1
```

---

## Build / test proof (2026-06-22)

| Command | Result |
|---------|--------|
| `npm run test:unit` | 22 pass |
| `npm run build` | Pass |
| `npm run lint` | 756 repo-wide issues; 4 in touched #185 form files (baseline debt) |

---

## Known limits

- **PR preview CORS:** Vercel preview origin returns HTTP 500 on OPTIONS preflight to production API — vendor UI smoke on preview is blocked until backend allowlists preview URLs.
- **Owner `publication` block:** Not observed on live `PUT /api/service/:id` responses (backend gap vs Model A proof doc).
- **Public detail on draft:** `GET /api/public/services/:id` returned 200 with `isPublished:false` during API smoke (backend visibility gap).
- Scenario 7 requires a dedicated ineligible business fixture.
