# Homepage Redesign — Scope Audit

**Branch:** `feat/homepage-redesign`  
**Audit date:** 2026-06-17  
**Purpose:** Separate in-scope public marketplace redesign from out-of-scope area changes before PR.

---

## IN SCOPE — keep for this PR

### Theme tokens and toolchain

- `tailwind.config.js`
- `app/globals.css`
- `lib/fonts.ts`
- `lib/utils.ts`
- `package.json`
- `package-lock.json`
- `eslint.config.mjs`
- `.prettierrc`
- `.prettierignore`
- `postcss.config.mjs` (deleted — Tailwind toolchain)

### Shared UI

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/index.ts`

### Homepage and public chrome

- `app/(home)/layout.tsx`
- `app/(home)/page.tsx`
- `app/(home)/Components/AnnouncementBar.tsx` (new)
- `app/(home)/Components/Hero.tsx`
- `app/(home)/Components/Navbar.tsx`
- `app/(home)/Components/Footer.tsx`
- `app/(home)/Components/HomeSearchSection.tsx` (new)
- `app/(home)/Components/BrowseByCategory.tsx` (new)
- `app/(home)/Components/TrustBar.tsx` (new)
- `app/(home)/Components/VendorCtaBand.tsx` (new)
- `app/(home)/Components/VendorSpotlightComingSoon.tsx` (new)
- `app/(home)/Components/VendorStoriesComingSoon.tsx` (new)
- `app/(home)/Components/CategoryPills.tsx` (new)
- `app/(home)/Components/HowitWorks.tsx`
- `app/(home)/Components/BrowsServices.tsx`
- `app/(home)/Components/BrowsbyFoodndGrocerry.tsx`
- `app/(home)/Components/ShopProducts.tsx`
- `app/(home)/Components/PublicSearchFilterBar.tsx`

### Public page hero

- `app/(home)/Components/PublicPageHero.tsx` (new)
- Deleted legacy heroes: `about`, `contact`, `foods`, `products`, `services` `HeroSection.tsx`
- `app/(home)/foods/page.tsx`
- `app/(home)/products/ProductsClient.tsx`
- `app/(home)/services/page.tsx`
- `app/(home)/services/[id]/page.tsx`
- `app/(home)/about/page.tsx`
- `app/(home)/contact/page.tsx`
- `app/(home)/vendors/page.tsx`
- `app/(home)/how-to-use-this-app/page.tsx`

### Public marketplace listing bodies

- `app/(home)/products/components/BrowsCategories.tsx`
- `app/(home)/products/components/FilterAccordion.tsx`
- `app/(home)/products/components/JoinVendorBanner.tsx`
- `app/(home)/products/components/ProductServices.tsx`
- `app/(home)/products/[productid]/Component/BannerSection.tsx`
- `app/(home)/products/[productid]/Component/SearchPageContent.tsx`
- `app/(home)/Components/BrowseFoods.tsx`
- `app/(home)/foods/components/BookYourServices.tsx`
- `app/(home)/foods/components/FilterAccordion.tsx`
- `app/(home)/foods/components/JoinVendorBanner.tsx`
- `app/(home)/foods/components/ProductCard.tsx`
- `app/(home)/services/components/BookYourServices.tsx`
- `app/(home)/services/components/FilterAccordion.tsx`
- `app/(home)/services/components/JoinVendorBanner.tsx`
- `app/(home)/services/components/ProductCard.tsx`
- `app/(home)/services/[id]/components/ServiceCard.tsx`

### Secondary public pages

- `app/(home)/about/components/AboutContent.tsx`
- `app/(home)/vendors/components/VendorGrid.tsx`

### Documentation

- `docs/STYLE_GUIDE.md`
- `docs/HOMEPAGE_REDESIGN_SCOPE_AUDIT.md` (this file)
- `docs/HOMEPAGE_MARKETPLACE_REDESIGN_QA_REPORT.md`

---

## OUT OF SCOPE — reverted from this PR

### Auth (5 files)

- `app/(auth)/layout.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/verify-otp/page.tsx`

### Checkout and payment (6 files)

- `app/(home)/checkout/address/ClientForm.tsx`
- `app/(home)/checkout/buy-now/page.tsx`
- `app/(home)/checkout/page.tsx`
- `app/(home)/checkout/payment/page.tsx`
- `app/(home)/payment-success/page.tsx`
- `app/payment/layout.tsx`

### Partner onboarding (24 files)

- `app/(home)/partners/add-food/components/ServiceImages.tsx`
- `app/(home)/partners/add-food/page.tsx`
- `app/(home)/partners/add-product/components/ProductDetails.tsx`
- `app/(home)/partners/add-product/components/RichTextEditor.tsx`
- `app/(home)/partners/add-product/components/VariationAttributes.tsx`
- `app/(home)/partners/add-product/page.tsx`
- `app/(home)/partners/add-service/components/ServiceImages.tsx`
- `app/(home)/partners/add-service/page.tsx`
- `app/(home)/partners/business-profile/page.tsx`
- `app/(home)/partners/business/new/page.tsx`
- `app/(home)/partners/components/CategoryRequestModal.tsx`
- `app/(home)/partners/final-review/components/Congratulations.tsx`
- `app/(home)/partners/final-review/page.tsx`
- `app/(home)/partners/foods/components/EditFoodModal.tsx`
- `app/(home)/partners/foods/page.tsx`
- `app/(home)/partners/page.tsx`
- `app/(home)/partners/payout-setup/page.tsx`
- `app/(home)/partners/products/components/AddDiscountModal.tsx`
- `app/(home)/partners/products/components/EditProductModal.tsx`
- `app/(home)/partners/products/components/ViewProductModal.tsx`
- `app/(home)/partners/products/components/product-modal/EditProductModal.tsx`
- `app/(home)/partners/products/page.tsx`
- `app/(home)/partners/services/components/EditBusinessInfoModal.tsx`
- `app/(home)/partners/services/components/EditChildServiceModal.tsx`
- `app/(home)/partners/services/components/EditServiceModal.tsx`
- `app/(home)/partners/services/page.tsx`

### Partner dashboard (7 files)

- `app/(partner)/layout.tsx`
- `app/(partner)/partners/dashboard/components/BookingsTab.tsx`
- `app/(partner)/partners/dashboard/components/InquiriesTable.tsx`
- `app/(partner)/partners/dashboard/components/OrdersTab.tsx`
- `app/(partner)/partners/dashboard/components/ShippingSettingsTab.tsx`
- `app/(partner)/partners/dashboard/components/TaxSettingsTab.tsx`
- `app/(partner)/partners/dashboard/page.tsx`

### Admin (1 file)

- `app/(admin)/layout.tsx`

---

## NEEDS REVIEW — decisions

| File | Decision | Rationale |
|------|----------|-----------|
| `app/(home)/become-a-vendor/page.tsx` | **REVERT** | Vendor onboarding adjacent; only removed unused import |
| `app/(home)/products/[productid]/Component/BannerSection.tsx` | **KEEP** | Gradient overlay only on product detail banner |
| `app/(home)/products/[productid]/Component/SearchPageContent.tsx` | **KEEP** | Dead import removal only |

---

## Follow-up issues from reverted work

Document styling ideas found in out-of-scope files for future PRs:

1. **Auth token migration** — Apply brand-navy/gold button tokens to login, signup, forgot-password, verify-otp.
2. **Checkout dusk styling** — Align checkout address, payment, buy-now, and payment-success with marketplace palette.
3. **Partner onboarding hub** — `/partners/*` pages need surface-cream/dashboard token consistency.
4. **Partner dashboard** — Bookings, orders, tax, shipping tabs styling pass.
5. **Admin layout** — Brand token alignment for admin shell.

---

## Forbidden-change confirmation (post-revert)

| Check | Status |
|-------|--------|
| `.env` / secrets staged | None |
| GitHub Actions modified | None |
| `middleware.ts` modified | No |
| API endpoint changes | No |
| `/api/featured-products` canonical | Yes — `lib/api/featured-products.ts`, `ShopProducts.tsx` |
| `/api/products/featured` used | No |
| Fake stats/ratings added | No |
