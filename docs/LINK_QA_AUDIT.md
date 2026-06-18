# Public link & CTA audit — Epic #75 / #91

Date: 2026-06-18 (updated after header MORE removal)

Primary CTA label normalized to **Become a vendor** (footer, hero, VendorCtaBand, terms CTA).

## Header & drawer

| Link | Location | Expected | Status |
|------|----------|----------|--------|
| `/` | Navbar HOME | Homepage | OK |
| `/products` | Navbar SHOP, Hero, BrowseByCategory | Product listing | OK |
| `/services` | Navbar SHOP | Services listing | OK |
| `/foods` | Navbar SHOP | Food listing | OK |
| `/vendors` | Navbar SHOP | Vendor directory | OK |
| `/search` | Navbar SHOP, bottom nav Discover | Unified search | OK |
| `/become-a-vendor` | Navbar, Footer, Hero, VendorCtaBand | Vendor onboarding | OK — label normalized |
| `/about` | Navbar LEARN, drawer Explore, Footer Support | About page | OK |
| `/contact` | Navbar LEARN, drawer Explore, Footer Support | Contact page | OK |
| `/how-to-use-this-app` | Navbar LEARN, drawer Explore | How-to guide | OK |
| `/faq` | Navbar LEARN, drawer Explore, Footer Support | FAQ | OK |
| `/refer-a-vendor` | Drawer Explore, Footer For vendors | Refer a vendor | OK |
| `/login?type=customer` | Navbar, Footer Support | Customer login | OK |
| `/login?type=vendor` | Navbar, Footer For vendors | Vendor login | OK |
| `/cart` | Header actions, bottom nav | Cart | OK |

## Footer Legal column

| Link | Location | Expected | Status |
|------|----------|----------|--------|
| `/privacy` | Footer Legal | Privacy policy | OK |
| `/terms` | Footer Legal | Terms of service | OK |
| `/refund-return` | Footer Legal | Refund policy | OK |
| `/dispute` | Footer Legal | Dispute resolution | OK |
| `/consumer/terms` | Footer Legal | Consumer terms | OK |
| `/vendor/terms` | Footer Legal | Vendor terms | OK |
| `/consumer/trustbadge` | Footer Legal | Consumer trust badges | OK |
| `/vendor/trustbadge` | Footer Legal | Vendor trust badges | OK |

## Other public routes

| Link | Location | Expected | Status |
|------|----------|----------|--------|
| `/product/[id]` | Product cards | Live product detail | OK |
| `/service/[slug]` | Service routes | Service detail | OK |
| `/vendor-profile/product-vendor/[id]` | Product detail seller link | Vendor profile | OK |
| `/foods/shop/[id]` | Food cards (if linked) | Stub — do not promise full shop | Deferred |
| `/blogs` | FeatureBlogs homepage | Blog listing | **No route** — tracked in #91 |

## Removed from header (2026-06-18)

Legal/policy links were removed from desktop **MORE** dropdown and mobile hamburger **More** section. They remain in the footer Legal column only. See [NAVIGATION_CLEANUP_AUDIT.md](NAVIGATION_CLEANUP_AUDIT.md).

## Fixes applied

- Hero secondary CTA: **Become a vendor** (was mixed Apply/Become wording)
- VendorCtaBand: **Become a vendor**
- Terms page CTA: **Become a vendor**
- Footer Legal column centralized via `FOOTER_LEGAL_LINKS` in navConfig
