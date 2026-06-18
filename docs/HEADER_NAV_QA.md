# Header & Mobile Navigation QA — Epic #107–#111

**Type:** QA / regression proof  
**Last updated:** 2026-06-18  
**Repo:** mosaic-biz-frontend  
**Scope:** Public header, announcement bar, desktop nav, tablet compact bar, mobile drawer

## Issue mapping

| Issue | Title | Status |
|-------|-------|--------|
| #107 | Header, hamburger menu, and responsive navigation redesign | Done |
| #108 | Fix responsive header breakpoint and prevent nav overflow | Done |
| #109 | Redesign mobile hamburger menu as polished drawer/sheet | Done |
| #110 | Clean public navigation information architecture and CTA hierarchy | Done |
| #111 | Header/mobile navigation accessibility QA pass | Done |

## Architecture summary

| Viewport | Behavior |
|----------|----------|
| **≥1280px (xl)** | Full desktop nav: HOME, SHOP, BECOME A VENDOR, LEARN + login/cart |
| **<1280px** | Compact header (logo, cart, account, hamburger) + slide-in drawer |

**Source files:**

- [`app/(home)/Components/Navbar.tsx`](../app/(home)/Components/Navbar.tsx) — orchestrator
- [`app/(home)/Components/nav/navConfig.ts`](../app/(home)/Components/nav/navConfig.ts) — single link config
- [`app/(home)/Components/nav/DesktopNav.tsx`](../app/(home)/Components/nav/DesktopNav.tsx)
- [`app/(home)/Components/nav/HeaderActions.tsx`](../app/(home)/Components/nav/HeaderActions.tsx)
- [`app/(home)/Components/nav/MobileNavDrawer.tsx`](../app/(home)/Components/nav/MobileNavDrawer.tsx)
- [`app/(home)/Components/AnnouncementBar.tsx`](../app/(home)/Components/AnnouncementBar.tsx)

## Information architecture

### Desktop (xl+)

| Item | Contents |
|------|----------|
| HOME | `/` |
| SHOP | Products, Foods, Services, Vendors, Search |
| BECOME A VENDOR | `/become-a-vendor` |
| LEARN | About, Contact, How to Use This App, FAQ |

Legal/policy links live in the **footer Legal** column only (not header or hamburger). See [NAVIGATION_CLEANUP_AUDIT.md](NAVIGATION_CLEANUP_AUDIT.md).

### Mobile/tablet drawer

1. **Marketplace** — Foods, Services, Vendors (Products/Search via bottom nav)
2. **Become a Vendor** — primary button CTA
3. **Explore** — About, Contact, How It Works, FAQ, Refer a Vendor
4. **Account** — login, orders/bookings/dashboard, logout

Bottom nav (mobile): Home, Shop, Discover, Cart, Account — see [MOBILE_APP_NAV_QA_PROOF.md](MOBILE_APP_NAV_QA_PROOF.md).

## Screenshot matrix (attach to PR)

| State | 375px | 768px | 1280px | 1440px |
|-------|-------|-------|--------|--------|
| Header closed | ☐ | ☐ | ☐ | ☐ |
| Drawer open (Marketplace/Explore/Account visible) | ☐ | ☐ | N/A | N/A |
| Announcement bar visible | ☐ | ☐ | ☐ | ☐ |
| Logged-out login dropdown (desktop) | N/A | N/A | ☐ | ☐ |

## Viewport checklist — horizontal scroll

Verify **no horizontal scroll** at:

| Width | Header closed | Drawer open |
|-------|---------------|-------------|
| 320px | ☐ | ☐ |
| 375px | ☐ | ☐ |
| 390px | ☐ | ☐ |
| 414px | ☐ | ☐ |
| 768px | ☐ | ☐ |
| 1024px | ☐ | ☐ |
| 1280px | ☐ | N/A |
| 1440px | ☐ | N/A |

## Close behavior checklist

| Action | Expected | Pass |
|--------|----------|------|
| X button in drawer | Menu closes | ☐ |
| Backdrop/overlay click | Menu closes | ☐ |
| Navigation link click | Menu closes, route changes | ☐ |
| Escape key | Menu closes | ☐ |
| Resize to ≥1280px | Menu closes | ☐ |

## Accessibility checklist (#111)

| Requirement | Implementation | Pass |
|-------------|----------------|------|
| Hamburger accessible name | `aria-label="Open menu"` / `"Close menu"` | ☐ |
| Menu state announced | `aria-expanded` on hamburger | ☐ |
| Drawer association | `aria-controls="mobile-nav-drawer"` | ☐ |
| Dialog semantics | `role="dialog"`, `aria-modal="true"`, `aria-label="Site navigation"` | ☐ |
| Focus visible | `focus-visible:ring-market-gold/*` on interactive elements | ☐ |
| Initial focus on open | Close button receives focus | ☐ |
| Escape to close | `keydown` listener | ☐ |
| Touch targets | `min-h-11 min-w-11` on hamburger, close, drawer links | ☐ |
| No nested buttons | Login uses styled `Link` elements | ☐ |
| Scroll lock | `body overflow: hidden` while drawer open | ☐ |
| Contrast | Drawer text on `bg-market-surface` readable | ☐ |
| Cart aria-label | Includes item count when > 0 | ☐ |

## Routes smoke-tested

| Route | Notes |
|-------|-------|
| `/` | Header renders, no overlap |
| `/products` | Sticky offset correct |
| `/cart` | Cart icon/badge |
| `/login?type=customer` | Login links work |
| `/become-a-vendor` | CTA visible desktop + drawer |
| `/faq` | Under LEARN dropdown (desktop) and Explore (drawer) |
| `/consumer/terms` | Footer Legal column only |

## Announcement bar

| Check | Pass |
|-------|------|
| Default `--announcement-h: 0px` (no flash when dismissed) | ☐ |
| Visible bar sets `--announcement-h: 2.25rem` | ☐ |
| Header `top` follows announcement height | ☐ |
| Drawer top offset includes announcement | ☐ |

## Z-index stack

| Layer | z-index |
|-------|---------|
| AnnouncementBar | 60 |
| Navbar header | 50 |
| MobileNavDrawer | 55 |
| CartSyncPrompt | 1100 |

## Build verification

```bash
npm run build
```

| Check | Pass |
|-------|------|
| `npm run build` succeeds | ☐ |
| No auth/API/checkout changes | ☐ |
| `GET /api/featured-products` untouched | ☐ |

## Guardrails confirmed

- No backend behavior changes
- No API contract changes
- No auth logic changes
- No checkout/Stripe changes
- All existing routes preserved
- Language selector: N/A (not in codebase)
