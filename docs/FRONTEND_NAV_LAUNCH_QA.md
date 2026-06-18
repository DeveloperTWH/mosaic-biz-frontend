# Frontend Nav Launch QA

**Branch:** `fix/frontend-header-nav-launch-polish`  
**Date (UTC):** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`  
**Baseline:** Nav IA merged via PR #108  
**Related issue:** [#91 — Footer route audit and broken link cleanup](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/91)

**Severity:** Post-launch polish — not a launch blocker.

---

## Scope

Launch-pass verification of header, hamburger, bottom nav, footer, and Become a Vendor CTAs. No full redesign. Old nav cleanup branches were **not** re-merged (already on `main`).

---

## Desktop header (≥1280px)

| Check | Expected | Result |
|-------|----------|--------|
| Primary nav items | HOME, SHOP, BECOME A VENDOR, LEARN + login/cart | Pass (PR #108) |
| Desktop MORE dropdown | Absent | Pass |
| SHOP dropdown links | Products, Foods, Services, Vendors, Search | Pass |
| BECOME A VENDOR | `/become-a-vendor` | Pass |
| `aria-label="Main navigation"` | Present on `DesktopNav` | Pass |

---

## Mobile hamburger

| Check | Expected | Result |
|-------|----------|--------|
| Open/close control | `aria-label` toggles Open/Close menu | Pass |
| Drawer sections | Marketplace, Become a Vendor, Explore, Account | Pass |
| Legal links in drawer | None (footer only) | Pass |
| Duplicate FAQ | None | Pass |

---

## Bottom nav (mobile)

| Check | Expected | Result |
|-------|----------|--------|
| Tabs | Home, Shop, Discover, Cart, Account | Pass |
| `aria-label="Primary"` | Present | Pass |
| Tap targets | ≥44px (polish branch) | Pass (code review) |
| Safe-area padding | Present on `(home)` layout | Pass |

---

## Footer

| Check | Expected | Result |
|-------|----------|--------|
| Legal column | 8 links via `FOOTER_LEGAL_LINKS` | Pass |
| Shop / For vendors / Support columns | Route to existing pages | Pass |
| `/blogs` dead link | Removed — homepage shows "Stories coming soon" | Pass |

---

## Known non-routes (documented only)

| Item | Status |
|------|--------|
| Shipping policy | No dedicated route — do not link until page exists |
| Contact social `href="#"` | Placeholder — pending real social URLs |

---

## Become a Vendor CTA consistency

Normalized primary marketplace CTAs to **"Become a Vendor"** (matches `navConfig.ts`):

| File | Change |
|------|--------|
| `products/components/JoinVendorBanner.tsx` | Label normalized |
| `foods/components/JoinVendorBanner.tsx` | Label normalized |
| `services/components/JoinVendorBanner.tsx` | Label normalized |
| `Components/VendorCtaBand.tsx` | Label normalized |
| `Components/VendorExpandCta.tsx` | Default label normalized |

Page titles and long-form copy (e.g. how-to-use headings) unchanged.

---

## Doc sync

| Doc | Update |
|-----|--------|
| `FRONTEND_LIVE_DOMAIN_SMOKE_PROOF.md` | Removed stale "nav cleanup branch" blocker |
| `FRONTEND_FINAL_MVP_UX_SMOKE.md` | Marked nav cleanup done (#108) |
| `MOBILE_APP_NAV_AUDIT.md` | Removed stale MORE / drawer sitemap |
| `FRONTEND_LAUNCH_WORK_ORDER.md` | Proof pack link → this doc |

---

## Build

```text
npm run build → Pass (68 routes)
```

---

## Regression checklist

- [ ] Desktop header at 1280px — no MORE menu
- [ ] Hamburger opens/closes; Explore links work
- [ ] Bottom nav active states on `/`, `/products`, `/search`, `/cart`, `/login`
- [ ] Footer legal links resolve (200)
- [ ] Join vendor banners on `/products`, `/foods`, `/services` → `/become-a-vendor`
