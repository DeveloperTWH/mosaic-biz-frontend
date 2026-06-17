# Frontend Smoke Checklist

Repo: `Digital-Builders-757/mosaic-biz-frontend-launch`  
Use after preview deploy. Mark pass/fail with evidence (screenshot, URL, or Sentry issue link).

## Build and deploy

- [ ] `npm run build` passes on release branch
- [ ] Preview deploy loads without 500 on `/`
- [ ] `NEXT_PUBLIC_API_BASE_URL` points to `https://api.mosaicbizhub.com`

## Public marketplace

- [ ] Homepage loads without beta modal blocking interaction
- [ ] Hero shows Explore Marketplace + Become a Vendor CTAs
- [ ] Featured products load via `GET /api/featured-products`
- [ ] `/products`, `/services`, `/foods`, `/search` render without console errors
- [ ] Search empty state shows helpful copy when no results
- [ ] Product detail `/product/[id]` loads for a known product

## Auth

- [ ] `/login?type=customer` renders
- [ ] `/login?type=vendor` renders
- [ ] `/signup?type=vendor` renders

## Cart and checkout (frontend path only)

- [ ] `/cart` loads (empty and with items)
- [ ] `/checkout/address` reachable from cart flow
- [ ] `/checkout/payment` shows loading state
- [ ] `/payment-success?payment_intent=...&redirect_status=succeeded` shows receipt or clear error
- [ ] Payment failure shows clear message (not blank page)

## Vendor flow

- [ ] `/become-a-vendor` and `/partners` load
- [ ] Onboarding progress steps visible when application exists
- [ ] `/partners/tier-selection` renders plan cards
- [ ] `/partners/dashboard` loads for approved vendor
- [ ] Orders tab shows empty state when no orders

## Admin

- [ ] `/signin` admin login works
- [ ] `/admin` dashboard loads
- [ ] `/admin/vendor-applications` loads
- [ ] `/admin/businesses` loads
- [ ] `/admin/products` loads (featured toggle uses admin API)

## Legal and footer

- [ ] Footer links: privacy, terms, refund-return, dispute
- [ ] Consumer Login → `/login?type=customer`
- [ ] Vendor trust badge and consumer trust badge pages load

## Responsive (phone width ~390px)

- [ ] Homepage hero text does not overflow
- [ ] Navbar menu usable
- [ ] Vendor dashboard tabs scroll horizontally without layout break
- [ ] Cart/checkout forms usable (tap targets, no horizontal scroll)

## Monitoring

- [ ] Sentry DSN configured in Vercel (after PR #1 merge)
- [ ] Test error appears in Sentry preview (then remove test trigger)

## Known gaps (document, do not mark pass)

- [ ] `/foods/shop/[id]` stub page
- [ ] `/dashboard` customer placeholder
- [ ] Mock routes: `/products/[productid]/[id]`, `/services/[id]/[serviceId]`
- [ ] Grocery checkout "coming soon" in cart
