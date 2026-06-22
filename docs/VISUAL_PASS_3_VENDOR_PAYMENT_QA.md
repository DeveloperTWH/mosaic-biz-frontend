# Visual Pass 3 — Vendor Payment & Submission QA (#180)

**Issue:** [#180](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/180)  
**Epic:** [#177](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/177)  
**Last updated:** 2026-06-22

---

## Shared component

| Component | Path | Variants |
|-----------|------|----------|
| `VendorOnboardingStatusPanel` | `app/(home)/partners/components/VendorOnboardingStatusPanel.tsx` | `processing`, `pending`, `correction`, `success`, `error`, `info` |

Used on payment page and `/partners` hub banners.

---

## State matrix

| State | Route | Visual treatment | Primary action |
|-------|-------|------------------|----------------|
| Loading payment | `/partners/business/payment` | Shell + spinner | — |
| Payment form | `/partners/business/payment` | Stripe `PaymentElement` in light card | Pay Application Fee |
| Confirming payment | `/partners/business/payment` | Blue processing panel | Disabled pay button |
| Submitting application | `/partners/business/payment` | Blue processing panel | Disabled pay button |
| Payment pending confirmation | `/partners/business/payment` | Amber pending panel | Retry confirmation |
| Payment + submit success | `/partners/business/payment` | Green success panel | Auto-redirect to `/partners` |
| Stripe return processing | `/partners` | Info panel | Submit disabled while processing |
| Paid, needs submit | `/partners` | Amber correction panel | Submit application |
| Rejected | `/partners` | Red error panel | — |
| Stage 1 verified | `/partners` | Green success panel | Continue to Business Profile |
| Final review incomplete step | `/partners/final-review` | Red badge: **Incomplete** | Expand step to fix |

---

## Guardrails verified

- No changes to Stripe PaymentIntent creation, webhooks, or charge logic
- Success copy shown only after backend submission path completes
- Retry buttons disabled while confirming/submitting
- Payment page wrapped in `VendorApplicationShell variant="market"`

---

## Manual QA checklist

Viewports: **375px**, **768px**, desktop

1. Open `/partners/business/payment` with valid session storage payment payload — summary + secure payment cards readable.
2. Trigger payment success (test mode) — see confirming → submitting → success panels without duplicate CTAs.
3. Simulate pending confirmation — retry button works once; disabled while loading.
4. On `/partners`, paid-but-not-submitted shows amber panel with distinct copy from payment pending.
5. Refresh during pending — state remains sensible (no false “submitted” message).
6. Final review: incomplete steps show **Incomplete** badge (not “Incompleted”).

---

## Commands

```powershell
npm run build
```

---

## Build proof

| Command | Result |
|---------|--------|
| `npm run build` | Document after run |

---

## Out of scope (follow-up issues)

- #181 partner hub / legacy dashboard token migration
- #182 customer storefront → purchase continuity
- #184 full screenshot proof pack
