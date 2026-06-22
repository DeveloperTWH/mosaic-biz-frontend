# Visual Pass 3 — Auth & Onboarding Form QA

**Epic:** [#177](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/177)  
**Issues:** [#179](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/179) shared form controls · [#178](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/178) onboarding shell · [#154](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/154) form readability · [#140](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/140) auth hooks lint

**Last updated:** 2026-06-22

---

## Shared form primitives (#179)

| Component | Path | Surfaces |
|-----------|------|----------|
| `FormField` | `components/ui/form-field.tsx` | `auth`, `dashboard`, `market` |
| `Input` | `components/ui/input.tsx` | same |
| `Textarea` | `components/ui/textarea.tsx` | same |
| `Select` | `components/ui/select.tsx` | same |
| `Button` | `components/ui/button.tsx` | auth CTAs (existing) |

Token reference: [`docs/STYLE_GUIDE.md`](../STYLE_GUIDE.md) — auth uses `brand-*`, partner onboarding dashboard uses `dashboard-*` / `surface-cream`, stage-1 application uses `market-*`.

---

## Onboarding shell (#178)

| Route | Shell variant | File |
|-------|---------------|------|
| `/partners` | `dashboard` | `app/(home)/partners/page.tsx` |
| `/partners/business/new` | `market` | `app/(home)/partners/business/new/page.tsx` |
| `/partners/business-profile` | `dashboard` | `app/(home)/partners/business-profile/page.tsx` |

Shell component: `app/(home)/partners/components/VendorApplicationShell.tsx`

---

## Migration inventory (remaining legacy forms)

| Area | Status | Notes |
|------|--------|-------|
| Auth login/signup/forgot/OTP | Migrated in #154 batch | `AuthPageShell` + shared inputs |
| Stage 1 `business/new` | Uses shared `FormField` | Local `InputField` removed |
| Partner hub `/partners` | Dashboard shell + tokens | Stage CTAs use `dashboard-gold` |
| Business profile | Dashboard shell + label contrast | Disabled fields keep readable gray-700 on gray-100 |
| `/partners/business/payment` | Not touched | Payment-safe guardrail |
| Customer account/checkout | Partial | Cart readability only where faint; no Stripe changes |
| Admin signin | Legacy | Post-launch |

---

## Grep audit targets (post-pass)

Run before closing #154:

```powershell
rg "text-gray-400|text-gray-500|bg-blue-900" app/(auth) app/(home)/partners
```

Expect zero matches in migrated auth routes; partner hub may retain semantic status colors (green/amber panels).

---

## Build proof

```powershell
npm run build
npx eslint "app/(auth)/login/page.tsx" "app/(auth)/signup/page.tsx" --format stylish
```

Auth hook errors (#140) should be **0** after pass.

---

## Routes tested

- `/login?type=customer`, `/login?type=vendor`
- `/signup?type=customer`, `/signup?type=vendor`
- `/verify-otp`
- `/forgot-password?type=customer`
- `/partners`, `/partners/business/new`, `/partners/business-profile`

Viewport widths: 320, 375, 390, 414, 768, desktop.
