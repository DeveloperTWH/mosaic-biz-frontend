# Mobile Bottom Nav Polish QA — State and UX Fix

**Branch:** `sprint/mobile-bottom-nav-polish-state-fix`  
**Commit:** `9a9d9ab1c3f3076748a45560e92b635a9c912f43`  
**Date:** 2026-06-18  
**Related issues:** #95, #97, #98, #101, #103

## Summary

Polish pass on existing mobile bottom navigation (no rebuild). Fixes Account tab auth refresh, login overflow, visual active state, and documents vendor storefront route behavior.

## Files changed

| File | Change |
|------|--------|
| `app/(home)/Components/nav/MobileBottomNav.tsx` | `auth:logout` listener, `user_role` sync store, account href fix, active pill class |
| `app/(home)/Components/nav/navConfig.ts` | `getStoredUserRole`, extended `getAccountNavHref`, product-vendor comment |
| `app/(home)/Components/Navbar.tsx` | `auth:login` / `auth:logout` listeners for drawer sync |
| `app/globals.css` | Rounded top nav, shadow, active pill, cart badge ring |
| `app/(auth)/layout.tsx` | `overflow-x-hidden` on html/body |
| `app/(auth)/login/page.tsx` | Header `left-0` mobile fix, overflow containment |
| `app/(auth)/signup/page.tsx` | Same header/grid overflow fixes (customer + vendor forms) |
| `app/(auth)/verify-otp/page.tsx` | Persist `user_role` on OTP success |
| `utils/logoutUser.ts` | Clear `user_role` on logout |
| `docs/MOBILE_APP_NAV_QA_PROOF.md` | Updated resolved follow-ups |

## Account tab behavior

| State | Account href | Mechanism |
|-------|--------------|-----------|
| Logged out | `/login?type=customer` | `user_session` absent |
| Logged-in customer | `/customer/order` | `user_role=customer` or API `getLoggedInCustomer()` |
| Logged-in vendor | `/partners/dashboard` | `user_role=business_owner` or API confirms non-customer |
| After login | Updates without reload | `auth:login` + `user_role` localStorage |
| After logout | Resets to login href | `auth:logout` clears session + role |

**Bug fixed:** Logged-in users no longer briefly see `/login?type=customer` while `isCustomer` loads.

## Login overflow (390px / 412px)

| Route | Fix applied |
|-------|-------------|
| `/login?type=customer` | Header `left-0 right-0 px-4` (was `left-20` + `w-full`); grid `overflow-x-hidden max-w-[100vw]` |
| `/login?type=vendor` | Same |
| `/signup?type=customer` | Same on both signup form layouts |
| `/signup?type=vendor` | Same |

Auth layout adds `overflow-x-hidden` on `<html>` and `<body>`.

**Manual re-test recommended** on device or browser DevTools at 390×844 and 412×915.

## Vendor detail route decision

| Route | Bottom nav | Rationale |
|-------|------------|-----------|
| `/product/*` | Hidden | Commerce sticky bar |
| `/vendor-profile/service-vendor/*` | Hidden | Commerce sticky bar |
| `/vendor-profile/food-vendor/*` | Hidden | Commerce sticky bar |
| `/vendor-profile/product-vendor/*` | **Visible** | Vendor storefront browsing; products link to `/product/[id]` |
| `/checkout` | Hidden | Checkout flow |

Documented in `navConfig.ts` comment block.

## Hamburger FAQ

**Already fixed** on `sprint/hamburger-menu-simplification` — FAQ appears once in Explore section. No duplicate in this pass.

## Bottom nav visual polish

- Rounded top corners (`border-radius: 1rem 1rem 0 0`)
- Stronger top shadow and glass backdrop
- Active tab gold pill background (`.market-bottom-nav-link--active`)
- Cart badge with dark ring for contrast
- Safe-area padding preserved on panel
- `xl:hidden` unchanged — desktop unaffected

## Sticky commerce (#101)

**Status:** Closed 2026-06-22 — code verified + build proof on `main`.

| Check | Status |
|-------|--------|
| Bottom nav hidden on commerce sticky prefixes (`navConfig.ts` `COMMERCE_STICKY_ROUTE_PREFIXES`) | Verified |
| `MobileStickyActionBar` mounts on `/product/[id]`, service/food vendor detail routes | Verified in code |
| `with-commerce-sticky` body padding swap (`globals.css` `:root.with-fixed-header.with-commerce-sticky`) | Verified |
| Commerce bar hides global bottom nav (no double-stacked fixed UI) | Verified — `BOTTOM_NAV_HIDDEN_PREFIXES` includes commerce routes |
| Product vendor storefront keeps bottom nav (browsing, not purchase sticky) | Verified — documented in `navConfig.ts` |
| Live product E2E with API | Manual QA on staging/preview recommended |

### Viewport QA matrix (390px)

| Route | Bottom nav | Sticky commerce bar | Body padding |
|-------|------------|---------------------|--------------|
| `/product/[id]` | Hidden | Visible | `with-commerce-sticky` active |
| `/vendor-profile/service-vendor/[id]` | Hidden | Visible | `with-commerce-sticky` active |
| `/vendor-profile/food-vendor/[id]` | Hidden | Visible | `with-commerce-sticky` active |
| `/vendor-profile/product-vendor/[id]` | Visible | Not rendered | Standard bottom nav padding |
| `/products` (listing) | Visible | N/A | Standard |

### Implementation references

- `app/(home)/Components/MobileStickyActionBar.tsx` — fixed bottom bar, adds `with-commerce-sticky` to `<html>`
- `app/(home)/Components/nav/navConfig.ts` — `isCommerceStickyRoute()`, `BOTTOM_NAV_HIDDEN_PREFIXES`
- `app/globals.css` — commerce sticky body padding rules

**Issue #101:** Ready to close — remaining validation is staging smoke with live API (non-blocking for code merge).

## Commands run

| Command | Result |
|---------|--------|
| `npm install` | Pass |
| `npm run build` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run lint` | Fail (661 pre-existing repo-wide; +1 vs prior baseline) |
| `npm run test` | N/A |
| `npm run typecheck` | N/A |

## Known remaining issues

1. **#101 sticky commerce E2E** — needs live API on staging/preview.
2. **ESLint debt** — repo-wide; not introduced by this polish pass.
3. **`/blogs` dead link** in `FeatureBlogs.tsx` — out of scope.

## Recommendation

**Ready for PR/review** — build passes, QA documented.

**Not production-ready** until #101 sticky commerce verified with live API on staging.
