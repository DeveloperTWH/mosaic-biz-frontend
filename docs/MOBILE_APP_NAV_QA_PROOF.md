# Mobile App Navigation QA Proof — Epic #95 / Issue #103

**Repo:** Digital-Builders-757/mosaic-biz-frontend-launch  
**Branch:** `sprint/mobile-nav-qa-103`  
**Feature stack tip:** `589b0e2044152d4ebe551a2771335f7662a57f0e` (`fix: prevent mobile sticky commerce overlap`)  
**QA commit (this doc):** `a539b6e39b720c532f35611e2903db9cc9502c5d` (`docs: add mobile app navigation QA proof`; branch tip `sprint/mobile-nav-qa-103`)  
**Test date:** 2026-06-18  
**Tester:** Cursor agent (local dev server + browser automation)  
**Environment:** `http://localhost:3000` (Next.js dev), API at `http://localhost:3001` **offline** during QA

## Scope

Proof pack for the mobile app-style navigation stack merged on this branch:

| Commit     | Summary                                      |
|------------|----------------------------------------------|
| `e0180860` | feat: add mobile bottom app navigation       |
| `5d1d61db` | style: polish mobile marketplace and homepage UX |
| `589b0e20` | fix: prevent mobile sticky commerce overlap  |

**Key files under test:**

- `app/(home)/Components/nav/MobileBottomNav.tsx`
- `app/(home)/Components/nav/MobileNavDrawer.tsx`
- `app/(home)/Components/nav/navConfig.ts`
- `app/(home)/Components/Navbar.tsx`
- `app/(home)/Components/MobileStickyActionBar.tsx`
- `app/globals.css` (`--bottom-nav-h`, `--commerce-sticky-h`, `.with-commerce-sticky`)

## Viewports tested

| Profile  | Width × height | Device class   |
|----------|----------------|----------------|
| iPhone   | 390 × 844      | iOS (Safari-like) |
| Android  | 412 × 915      | Pixel-class      |

Breakpoint rule: bottom nav visible below `xl` (1280px); hidden on commerce sticky routes and `/checkout`.

## Pages tested

| Route | Role |
|-------|------|
| `/` | Home |
| `/products` | Marketplace / shop |
| `/search` | Category / discovery |
| `/product/[id]` | Product detail (commerce sticky) |
| `/cart` | Cart |
| `/login?type=customer` | Auth (no site chrome) |
| `/checkout` | Checkout (bottom nav hidden) |
| Hamburger drawer | Secondary nav on `/products` |

## Pass / fail matrix

Legend: **Pass** = meets acceptance for this QA batch. **Partial** = nav shell OK; blocked by missing API/data. **Fail** = defect to track.

### iPhone 390 × 844

| Page | Bottom nav | Active tab | Header | Hamburger | Cart reachable | No H-scroll | Sticky / padding | Contrast | Result |
|------|------------|------------|--------|-----------|----------------|-------------|------------------|----------|--------|
| `/` | Visible | Home | Logo + menu | N/A | Via bottom nav | Pass | N/A | Pass | **Pass** |
| `/products` | Visible | Shop | Logo + menu | Opens drawer | Via bottom nav | Pass | N/A | Pass | **Pass** |
| `/search` | Visible | Discover | Logo + menu | N/A | Via bottom nav | Pass | N/A | Pass | **Pass** |
| `/product/507f1f77bcf86cd799439011` | **Hidden** | N/A | Logo + menu | N/A | N/A | Pass | Sticky bar not rendered (API offline) | Pass | **Partial** |
| `/cart` | Visible | Cart | Logo + menu | N/A | Current route | Pass | N/A | Pass | **Pass** |
| `/login?type=customer` | **Hidden** (auth layout) | N/A | N/A | N/A | N/A | **Fail** (horizontal overflow detected) | N/A | Pass | **Partial** |
| `/checkout` | **Hidden** | N/A | Logo + menu | N/A | N/A | Pass | N/A | Pass | **Pass** |
| Hamburger (`/products`) | Visible under drawer | Shop | Close works | Opens secondary IA | N/A | Pass | Body lock OK | Pass | **Pass** |

### Android 412 × 915

| Page | Bottom nav | Active tab | No H-scroll | Result |
|------|------------|------------|-------------|--------|
| `/` | Visible | Home | Pass | **Pass** |
| `/products` | Visible | Shop | Pass | **Pass** |
| `/search` | Visible | Discover | Pass | **Pass** |
| `/cart` | Visible | Cart | Pass | **Pass** |

_(Product sticky bar and login overflow re-validated on iPhone; Android spot-check on primary commerce routes.)_

## Verification checklist

- [x] Bottom nav appears on home, shop, search, cart (< xl)
- [x] Bottom nav hidden on `/product/*` and `/checkout`
- [x] Active state: Home, Shop, Discover, Cart tabs match route (`aria-current="page"`)
- [x] Mobile header: logo + hamburger only (no duplicate cart/account in header)
- [x] Hamburger drawer: secondary links (Foods, Services, Vendors, Learn, More, account when logged in)
- [x] Cart reachable from bottom nav
- [x] No horizontal overflow on public `(home)` routes tested
- [ ] Commerce sticky bar + `with-commerce-sticky` body padding — **blocked** (API offline; product never loaded)
- [x] Text contrast acceptable on dusk shell + white cards (spot-check)

## Build / lint / typecheck

Run on branch `sprint/mobile-nav-qa-103` at feature commit `589b0e20` (build re-run at QA time; QA doc at branch tip):

| Command | Result | Notes |
|---------|--------|-------|
| `npm run build` | **Pass** (exit 0) | Next.js production build completed |
| `npx tsc --noEmit` | **Pass** (exit 0) | No TypeScript errors |
| `npm run lint` | **Fail** (exit 1) | 658 problems (341 errors, 317 warnings) — **pre-existing repo-wide**; not introduced by mobile nav stack |

## Screenshots

Captured during QA at 390px width (local browser automation). Attach to PR #103 body at review time:

| File | Page / state |
|------|----------------|
| `docs/qa-screenshots/mobile-nav-home-iphone-390.png` | Home + bottom nav |
| `docs/qa-screenshots/mobile-nav-products-iphone-390.png` | Shop / marketplace |
| `docs/qa-screenshots/mobile-nav-search-iphone-390.png` | Discover / search |
| `docs/qa-screenshots/mobile-nav-cart-iphone-390.png` | Cart |
| `docs/qa-screenshots/mobile-nav-login-iphone-390.png` | Customer login (auth layout) |
| `docs/qa-screenshots/mobile-nav-product-detail-iphone-390.png` | Product detail — bottom nav hidden |
| `docs/qa-screenshots/mobile-nav-hamburger-drawer-iphone-390.png` | Hamburger drawer open |
| `docs/qa-screenshots/mobile-nav-home-android-412.png` | Home at Android width |

Related prior assets: `docs/qa-screenshots/homepage-mobile.png`, `docs/qa-screenshots/products-mobile.png`.

## Known follow-up issues (not hidden)

1. **Login horizontal overflow** — `/login?type=customer` reports `scrollWidth > clientWidth` at 390px. Auth layout is outside `(home)` chrome; fix deferred (not part of mobile nav stack).
2. **Commerce sticky bar end-to-end** — Could not verify sticky purchase bar, `with-commerce-sticky` class, or body padding swap with live product data; local API (`localhost:3001`) was unreachable. Route-level bottom-nav suppression on `/product/*` **verified**.
3. **`/vendor-profile/product-vendor/*`** — Still shows bottom nav (not in `COMMERCE_STICKY_ROUTE_PREFIXES`). Intentional gap vs product/service/food detail routes; track if vendor storefront should use sticky bar.
4. **Duplicate FAQ in hamburger drawer** — FAQ appears under both Learn and More sections (`navConfig.ts` MORE_LINKS + LEARN_LINKS).
5. **Navbar auth refresh** — Bottom nav Account href may not update until reload after login (`auth:login` listener exists but header/session sync is inconsistent).
6. **ESLint debt** — 658 existing lint findings; mobile nav QA does not resolve repo-wide lint.
7. **Empty marketplace locally** — Product grid empty when API offline; card polish and listing layout verified structurally only.

## Manual re-test (when API available)

1. Open a live product → confirm **only** `MobileStickyActionBar` at bottom (no bottom nav), `html.with-commerce-sticky`, no double-stacked fixed UI.
2. Repeat for `/vendor-profile/service-vendor/[id]` and `/vendor-profile/food-vendor/[id]`.
3. Scroll product detail — last content not hidden behind sticky bar.
4. Complete login → confirm Account tab routes to `/customer/order`.

## Sign-off

| Gate | Status |
|------|--------|
| QA doc present | Yes |
| Build passes | Yes |
| Known issues documented | Yes |
| Production deploy | **Not triggered** |
| Merge to main | **Out of scope** |
