# Navigation Cleanup Audit — Hamburger Menu Simplification

**Branch:** `sprint/hamburger-menu-simplification`  
**Audit date:** 2026-06-18  
**Repo:** Digital-Builders-757/mosaic-biz-frontend-launch

## Executive summary

The mobile hamburger drawer duplicated footer/legal content via a **More** section (9 links including Terms, Privacy, refund, dispute, consumer/vendor terms, trust badges). FAQ also appeared twice (Learn + More). Bottom nav already covers Home, Shop, Discover, Cart, and Account. This pass removes legal/policy links from the hamburger, centralizes legal links in `navConfig.ts` + footer, and shortens the drawer to marketplace exploration, business CTAs, help, and account.

---

## Current state (before changes)

### Bottom nav (`BOTTOM_NAV_ITEMS`)

| Tab | Route |
|-----|-------|
| Home | `/` |
| Shop | `/products` |
| Discover | `/search` |
| Cart | `/cart` |
| Account | `/login?type=customer` (dynamic when logged in) |

### Hamburger drawer (before)

| Section | Items |
|---------|-------|
| Shop | Foods, Services, Vendors |
| CTA | Become a Vendor |
| Learn | About, Contact, How to Use This App, FAQ |
| More | FAQ *(duplicate)*, Terms & Conditions, Privacy Policy, Dispute Resolution, Refunds and Returns, Consumer Terms, Vendor Terms, Consumer Trust Badges, Vendor Trust Badges |
| Account | Login buttons or My Orders / Bookings / Dashboard + Logout |

**Problem:** 20+ drawer links; legal/compliance reads like a sitemap.

### Desktop header (`DesktopNav`)

| Item | Children |
|------|----------|
| HOME | — |
| SHOP | Products, Foods, Services, Vendors, Search |
| BECOME A VENDOR | — |
| LEARN | About, Contact, How to Use This App, FAQ |
| MORE | Terms, Privacy, Dispute, Refunds, Consumer/Vendor Terms, Trust Badges *(FAQ excluded)* |

Desktop unchanged in this pass except shared config cleanup.

### Footer (before)

| Column | Links |
|--------|-------|
| Shop | Products, Services, Foods, Search, Browse vendors |
| For vendors | Become a vendor, Refer a vendor, Vendor signup, Vendor login, Trust badges – vendor, Vendor terms |
| Support | About, Contact, FAQs, How to use, Consumer login, Privacy, Terms, Refunds, Dispute, Trust badges – consumer |

Legal links mixed into Support column; Consumer Terms (`/consumer/terms`) missing from footer.

---

## Detected public routes (relevant)

| Category | Routes |
|----------|--------|
| Marketplace | `/`, `/products`, `/foods`, `/services`, `/vendors`, `/search`, `/product/[id]`, `/cart` |
| Vendor onboarding | `/become-a-vendor`, `/refer-a-vendor`, `/signup?type=vendor`, `/login?type=vendor` |
| Customer account | `/login?type=customer`, `/signup?type=customer`, `/customer/order`, `/customer/bookings` |
| Support / learn | `/about`, `/contact`, `/faq`, `/how-to-use-this-app` |
| Legal / policy | `/terms`, `/privacy`, `/refund-return`, `/dispute`, `/consumer/terms`, `/vendor/terms`, `/consumer/trustbadge`, `/vendor/trustbadge` |
| Commerce | `/checkout/*`, `/payment-success` |
| Partner (vendor) | `/partners/dashboard`, `/partners/*` |

### Routes not found (do not link)

| Label | Referenced by | Status |
|-------|---------------|--------|
| `/blogs` | `FeatureBlogs.tsx` homepage component | **No page** — do not add to nav |
| Shipping policy | — | **No dedicated route** — document only |

### Duplicates identified

- FAQ in hamburger Learn + More
- Privacy/Terms/Refund in hamburger More + footer Support
- Products + Search in bottom nav; excluded from drawer Shop (correct)

---

## Recommended final structure

### Bottom nav (unchanged)

Home, Shop, Discover, Cart, Account — primary mobile actions.

### Hamburger (after)

| Section | Items |
|---------|-------|
| Marketplace | Foods, Services, Vendors |
| CTA | Become a Vendor |
| Explore | About, Contact, How It Works, FAQ, Refer a Vendor |
| Account | Role-aware login / orders / dashboard |

**Removed from hamburger:** entire More section (all legal/policy links).

### Footer legal column (after)

Dedicated **Legal** column via `FOOTER_LEGAL_LINKS`: Privacy, Terms, Refunds, Dispute, Consumer Terms, Vendor Terms, Trust badges.

### Desktop MORE dropdown

Uses same `LEGAL_POLICY_LINKS` as footer (no FAQ in dropdown).

---

## Files to change

| File | Change |
|------|--------|
| `app/(home)/Components/nav/navConfig.ts` | Add `DRAWER_EXPLORE_LINKS`, `LEGAL_POLICY_LINKS`, `FOOTER_LEGAL_LINKS`; keep desktop arrays |
| `app/(home)/Components/nav/MobileNavDrawer.tsx` | Replace Learn/More with Explore; rename Shop → Marketplace |
| `app/(home)/Components/Footer.tsx` | Add Legal column; import `FOOTER_LEGAL_LINKS`; dedupe Support |

---

## Owner confirmation needed (no action)

1. **`/blogs`** — linked from homepage `FeatureBlogs` but no route; create page or fix component separately.
2. **Shipping policy** — no route exists; add page before linking.
3. **`/vendor-profile/product-vendor/*`** — vendor storefront; not in hamburger (bottom nav Shop tab covers).

---

## Implementation log

**Completed:** 2026-06-18

### What changed

- Removed **More** section (9 legal/policy links) from mobile hamburger drawer.
- Replaced **Learn** section with **Explore** (About, Contact, How It Works, FAQ, Refer a Vendor).
- Renamed drawer **Shop** → **Marketplace** (Foods, Services, Vendors only).
- Centralized legal links in `LEGAL_POLICY_LINKS` and `FOOTER_LEGAL_LINKS` in `navConfig.ts`.
- Footer: added dedicated **Legal** column; moved trust badges and terms out of Support/For vendors duplicates; added missing **Consumer terms** (`/consumer/terms`).
- Desktop MORE dropdown unchanged in behavior — still shows legal links via `LEGAL_POLICY_LINKS`.

### Files changed

| File | Summary |
|------|---------|
| `app/(home)/Components/nav/navConfig.ts` | `DRAWER_EXPLORE_LINKS`, `DRAWER_MARKETPLACE_LINKS`, `LEGAL_POLICY_LINKS`, `FOOTER_LEGAL_LINKS` |
| `app/(home)/Components/nav/MobileNavDrawer.tsx` | Simplified sections; removed legal links |
| `app/(home)/Components/Footer.tsx` | 4-column layout with Legal column from config |
| `docs/NAVIGATION_CLEANUP_AUDIT.md` | This audit |

### Final hamburger structure

1. **Marketplace** — Foods, Services, Vendors  
2. **Become a Vendor** (CTA)  
3. **Explore** — About, Contact, How It Works, FAQ, Refer a Vendor  
4. **Account** — Customer/Vendor login or role-aware dashboard links  

### Final footer legal links

Privacy policy, Terms of service, Refunds & returns, Dispute resolution, Consumer terms, Vendor terms, Trust badges – consumer, Trust badges – vendor.

### Intentionally excluded

| Item | Reason |
|------|--------|
| Terms, Privacy, Refund, etc. in hamburger | Belong in footer / desktop MORE only |
| Products, Search in hamburger | Covered by bottom nav Shop + Discover |
| Blog / Stories | No `/blogs` route exists |
| Shipping policy | No dedicated route exists |

### Validation

| Command | Result |
|---------|--------|
| `npm install` | Pass |
| `npm run build` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run lint` | Fail (pre-existing repo-wide debt) |
| `npm run test` | N/A |
| `npm run typecheck` | N/A |

### Follow-up recommendations

1. Fix `FeatureBlogs.tsx` `/blogs` link (dead route) or add blog section.
2. Add shipping policy page if business requires it, then add to `FOOTER_LEGAL_LINKS`.
3. Remove duplicate FAQ note from `MOBILE_APP_NAV_QA_PROOF.md` on next QA pass.

---

## Header More Section Removal

**Branch:** `sprint/remove-header-more-section`  
**Completed:** 2026-06-18

### Why "More" was removed

The desktop header **MORE** dropdown duplicated footer legal/compliance content (Terms, Privacy, dispute, refunds, consumer/vendor terms, trust badges). That made the header feel like a legal document directory and distracted from core marketplace actions. Legal and policy links belong in the footer; the header should focus on shopping, vendor onboarding, trust-building learn content, login, and cart.

### Links removed from desktop header

These 8 links were removed from the desktop **MORE** dropdown (via `MORE_DROPDOWN_LINKS` / `LEGAL_POLICY_LINKS`):

| Label | Route |
|-------|-------|
| Terms & Conditions | `/terms` |
| Privacy Policy | `/privacy` |
| Dispute Resolution Process | `/dispute` |
| Refunds and Returns | `/refund-return` |
| Terms and Conditions – Consumer | `/consumer/terms` |
| Terms and Conditions – Vendor | `/vendor/terms` |
| Trust Badges – Consumer | `/consumer/trustbadge` |
| Trust Badges – Vendor | `/vendor/trustbadge` |

Mobile hamburger **More** section was already removed in the prior hamburger simplification pass — no regression.

### Where those links now live

All removed links remain in the footer **Legal** column via `FOOTER_LEGAL_LINKS` in [`Footer.tsx`](../app/(home)/Components/Footer.tsx):

- Privacy policy → `/privacy`
- Terms of service → `/terms`
- Refunds & returns → `/refund-return`
- Dispute resolution → `/dispute`
- Consumer terms → `/consumer/terms`
- Vendor terms → `/vendor/terms`
- Trust badges – consumer → `/consumer/trustbadge`
- Trust badges – vendor → `/vendor/trustbadge`

No new routes were added. Shipping policy still has no dedicated route.

### Final desktop header structure

| Item | Contents |
|------|----------|
| HOME | `/` |
| SHOP | Products, Foods, Services, Vendors, Search |
| BECOME A VENDOR | `/become-a-vendor` |
| LEARN | About, Contact, How to Use This App, FAQ |
| Header actions | Login dropdown (Customer/Vendor) + Cart |

**Removed:** MORE dropdown.

### Final mobile drawer structure (unchanged)

1. **Marketplace** — Foods, Services, Vendors  
2. **Become a Vendor** (CTA)  
3. **Explore** — About, Contact, How It Works, FAQ, Refer a Vendor  
4. **Account** — Customer/Vendor login or role-aware dashboard links  

### Footer legal/policy structure (unchanged)

Dedicated **Legal** column: Privacy policy, Terms of service, Refunds & returns, Dispute resolution, Consumer terms, Vendor terms, Trust badges – consumer, Trust badges – vendor.

### Config cleanup

- Removed `MORE_DROPDOWN_LINKS` and deprecated `MORE_LINKS` from [`navConfig.ts`](../app/(home)/Components/nav/navConfig.ts).
- Kept `LEGAL_POLICY_LINKS` and `FOOTER_LEGAL_LINKS` for footer use.
- Updated `LEGAL_POLICY_LINKS` comment to footer-only.

### Files changed (this pass)

| File | Summary |
|------|---------|
| `app/(home)/Components/nav/DesktopNav.tsx` | Removed MORE `NavDropdown` |
| `app/(home)/Components/nav/navConfig.ts` | Removed MORE exports; footer-only legal comment |
| `docs/NAVIGATION_CLEANUP_AUDIT.md` | This section |

### Follow-up recommendations

1. Update [`docs/HEADER_NAV_QA.md`](HEADER_NAV_QA.md) desktop IA table — still references MORE and old mobile More section.
2. Add shipping policy page if business requires it, then add to `FOOTER_LEGAL_LINKS`.
3. Fix `FeatureBlogs.tsx` `/blogs` dead link or add blog route.
