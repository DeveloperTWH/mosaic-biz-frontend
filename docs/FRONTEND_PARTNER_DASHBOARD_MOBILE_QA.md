# Frontend Partner Dashboard Mobile QA

**Branch:** `fix/frontend-partner-dashboard-mobile-overflow`  
**Date (UTC):** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`  
**Route:** `/partners/dashboard`  
**Related:** [FRONTEND_LAUNCH_WORK_ORDER.md](FRONTEND_LAUNCH_WORK_ORDER.md) §2 mobile polish · Issue [#125](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/125)

**Severity:** Post-launch UX polish — not a launch blocker.

---

## Problem (before)

- Tab bar used `min-w-[760px]` forcing page-level horizontal scroll below ~760px viewport width.
- `TaxSettingsTab` used fixed `grid-cols-[1.4fr_180px]` on all breakpoints.

---

## Changes

| File | Change |
|------|--------|
| `app/(partner)/partners/dashboard/page.tsx` | Mobile: horizontal tab strip with snap scroll; desktop: preserved multi-column grid. Added `overflow-x-hidden` on main and content card. Tab list ARIA roles. |
| `app/(partner)/partners/dashboard/components/TaxSettingsTab.tsx` | Stack category/rate rows on mobile; table header hidden below `sm`. |

**Out of scope (documented):**

- No bottom nav added to `(partner)` layout.
- No middleware or credentialed API changes.
- Embedded listing tables may still scroll horizontally inside their own `overflow-x-auto` wrappers (acceptable for wide data tables).

---

## QA matrix

| Viewport | Check | Expected | Result |
|----------|-------|----------|--------|
| 375px | Page body horizontal overflow | `document.documentElement.scrollWidth === clientWidth` | Pass (code review) |
| 390px | Tab strip | Tabs scroll within strip; no page overflow | Pass (code review) |
| 390px | Unauthenticated shell | 200, "Vendor Dashboard" renders, no crash | Pass (production baseline) |
| 768px | Tab layout | Multi-column grid (`md:grid-cols-*`) | Pass (code review) |
| 768px | Tax settings tab | Two-column category/rate grid | Pass (code review) |

---

## Build

```text
npm run build → Pass (68 routes)
```

---

## Auth / API behavior

- Unauthenticated users still see dashboard shell (middleware does not block `/partners/*`).
- `GET /api/business/my` errors logged to console only — unchanged.
- No backend contract changes.
