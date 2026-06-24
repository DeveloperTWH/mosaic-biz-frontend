# Frontend Marketplace Regression Pre-Change Report

Branch: `fix/frontend-launch-regression-recovery`  
Starting SHA: `fd80547c`  
Base: `origin/develop`

This report was prepared before code changes. Evidence is from static source inspection of the current frontend branch, plus the tester-reported service-detail screenshot/repro notes in the work order.

## Route And API Map

| Surface | Route | Components | API caller | Query/body contract observed |
| --- | --- | --- | --- | --- |
| Marketplace search entry | `/search`, shared public search bars | `app/(home)/Components/PublicSearchFilterBar.tsx`, `app/(home)/Components/publicSearch.ts` | Search page helpers call listing APIs through `lib/api/products.ts`, `lib/api/search.ts`, `lib/api/foods.ts` | URL currently writes `q`, `city`, `minorityType`, `category`, `subcategory`, `badge`, `sort`, `priceMin`, `priceMax`, `page`, `tab`. API helper currently sends `search`, `city`, `minorityType`, `categoryId`, `subcategoryId`, `badge`, `sort`, `page`, `price`. |
| Marketplace location selection | Shared on `/products`, `/services`, home/search | `PublicSearchFilterBar`, `publicSearch.ts` | No available-location endpoint is called | Static `US_STATE_OPTIONS` list renders every state; selected state is sent as `city`, not `state`. |
| Service results | `/services` | `app/(home)/services/page.tsx`, `BookYourServices.tsx`, `FilterAccordion.tsx`, `ProductCard.tsx` | `GET /api/services/list`, `GET /api/categories/services`, `GET /api/services/subcategories/:categoryId`, `GET /api/minority-types` | Expected list response shape: `{ success?, data: Service[], total, page, totalPages, limit }`. Current request sends `search`, `city`, `minorityType`, `page=1`, `limit=10`, plus `categoryId`, `subcategoryId`, `badge`, `price`. |
| Service listing cards | `/services` results grid | `BookYourServices.tsx`, `ProductCard.tsx`, `TrustBadge` | Same `/api/services/list` response | Cards link to `/vendor-profile/service-vendor/:serviceId` and use `businessDetails.badge` or `badge`. |
| Service detail page | `/vendor-profile/service-vendor/[serviceId]` | `app/(home)/vendor-profile/service-vendor/[serviceId]/page.tsx` | `GET /api/public/services/:serviceId`, `GET /api/service/:serviceId/reviews?page=1&limit=10`, `POST /api/service/:serviceId/reviews`, `POST /api/enquiries/reveal`, `POST /api/bookings/service/:serviceId` through `lib/api/serviceBookings.ts` | Expected detail shape: `{ success: true, data: { service, business } }`. Booking body sends `{ name, email, phone, services, date, slot }` with credentials and optional bearer token. |
| Product listing count | `/products` | `app/(home)/products/ProductsClient.tsx`, `ProductServices.tsx` | `GET /api/products/list` | Public count comes from response `total`, with fallback to API array length. This is the correct public marketplace source for the public shop page. |
| Vendor product inventory | `/partners/products` and legacy `/partners/[businessid]/inventory` table | `app/(home)/partners/products/page.tsx`, `useProducts.ts`, `ProductsTable.tsx`; `app/(partner)/partners/[businessid]/components/ProductTable.tsx` | `GET /api/business/my`, `GET /api/product/business/:businessId`, legacy `GET /api/private/products/list?businessId=&page=&limit=` | Vendor count on `/partners/products` is `products.length` after local filtering, so it is a vendor inventory count, not a public marketplace count. Legacy table receives server-paginated vendor products and pagination props. |
| Product delete action | `/partners/products`, legacy dashboard inventory | `useProducts.ts`, `ConfirmDialog.tsx`, legacy `ProductTable.tsx`, `DeleteConfirmationModal.tsx` | `DELETE /api/product/delete-product/:productId`, legacy variant `DELETE /api/product/delete-variant/:productId/:variantId` | New hook uses the correct singular product route and `credentials: include`, but currently reports success from JSON `message` even if `response.ok` is false. |
| Empty/loading/error states | Public products/services, vendor products | `MarketLoadingBlock`, `MarketEmptyState`, `MarketErrorState`, vendor product table states | Same list/delete endpoints above | Public products and services have loading/error blocks. Services can display an error and still render an empty list underneath. Legacy vendor product table checks empty before `isLoading`/`error`, hiding failures behind an empty state. |
| Booking actions | Service detail | `ServiceVendorProfilePage`, `MobileStickyActionBar`, `createServiceBooking` | `POST /api/bookings/service/:serviceId` | Existing API behavior is preserved; layout work should only change responsive classes/copy around unavailable slots. |
| Cart and checkout entry points | `/cart`, `/checkout`, `/checkout/address`, `/checkout/payment`, `/checkout/buy-now` | `app/(home)/cart/page.tsx`, `utils/cartUtils.ts`, `lib/api/orders.ts`, buy-now checkout page | `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/update/:cartItemId`, `PUT /api/cart/update-quantity`, `DELETE /api/cart/remove/:cartItemId`, `DELETE /api/cart/remove`, `GET /api/public/product/:productId`, `GET /api/public/product/vendor-profile/:businessId`, `POST /api/orders/initiate` | Out of scope for changes per safety boundaries; inspected to confirm entry points and contracts. |

## Confirmed Root Causes

1. Location selector is static and over-promises availability.
   - `PublicSearchFilterBar` renders `US_STATE_OPTIONS` directly.
   - No frontend call exists for available states derived from active/approved listing data.
   - Small safe fix: keep the select honest with "All locations" and support copy that says results depend on current marketplace listings; document the missing backend contract instead of inventing counts or filtering all listings in the browser.

2. State selection is sent as `city`.
   - `buildListingPageUrl` writes `city`.
   - `listingFiltersToApiParams` sends `api.city`.
   - `/services` and `/products` local fetchers also build `city` params from the state dropdown.
   - Small safe fix: canonicalize the shared state dropdown value to `state`, preserve legacy `city` parsing for inbound links, and update local list fetchers to send `state`.

3. Service filters have split source of truth.
   - `/services` keeps local state and partially mutates URL for category only.
   - Badge, price, sort, and location are not consistently represented in URL or restored on back navigation.
   - Small safe fix: move `/services` onto `useListingFilters`, fetch from parsed URL filters, and use the existing `buildListingPageUrl`/`listingFiltersToApiParams` helper.

4. Service sort UI does not request anything.
   - `BookYourServices.tsx` renders a sort `<select>` without `value` or `onChange`.
   - Small safe fix: wire it to `sort` URL/API params using known values `price_asc`, `price_desc`, `rating`, and `newest`.

5. Badge filter options are incomplete and cursor behavior is misleading.
   - Service and product filter accordions list `Silver`, `Gold`, `Platinum`, `Diamond`; backend-facing filter values are lower-cased.
   - `Bronze` appears elsewhere in the product/vendor flows, but marketplace filters omit it.
   - Small safe fix: centralize public badge filter options and include `bronze`, preserving lower-case API values.

6. Service detail layout can overflow or hide the right panel.
   - Detail layout uses `lg:grid-cols-[2fr_1fr]` without explicit `min-w-0` on columns.
   - Contact rows use fixed `grid-cols-[96px_1fr]`; hours use `grid-cols-[120px_1fr]`.
   - Booking service rows use horizontal service/price layout that can compress on narrow sidebars.
   - Small safe fix: add `min-w-0`, responsive row grids, smaller fixed media at narrow widths, and mobile-safe wrapping without changing booking APIs.

7. New vendor product delete success handling is unsafe.
   - `useProducts.deleteProduct` accepts `data.message || data.success` as success without checking `response.ok`.
   - Page closes the confirm dialog before the request completes and refreshes twice after success.
   - Small safe fix: extract/test the delete API caller, require HTTP success, keep the modal open while deleting, disable buttons, show progress text, and refresh exactly once on success.

8. Legacy vendor product inventory hides errors behind empty state.
   - `ProductTable.tsx` returns "No products yet" before considering `isLoading` or `error`.
   - Small safe fix: render loading and error states first, then empty state; also fix the malformed `min-w-[800px` class while touching the table.

## Findings Disproven Or Deferred

- Product public count is not sourced from vendor inventory on `/products`; it comes from `/api/products/list.total`.
- `/partners/products` count is a vendor inventory count, not a public marketplace count. It should not be relabeled as public availability.
- Current frontend evidence does not show an approved available-location API contract. Do not fabricate state counts or derive eligibility by fetching all listings client-side.
- Cart/checkout and Stripe surfaces were inspected for entry points only and are outside this PR's change scope.

## Backend Follow-Up Contract Needed

Add a focused backend issue for an available-location endpoint, for example:

`GET /api/marketplace/locations?listingType=products|services|foods`

Expected response:

```json
{
  "success": true,
  "data": {
    "states": [
      { "state": "Virginia", "country": "United States", "count": 12 }
    ],
    "cities": [
      { "city": "Richmond", "state": "Virginia", "country": "United States", "count": 5 }
    ]
  }
}
```

Rules:

- Include only listings attached to approved and active businesses.
- Include only published/active marketplace listings.
- Counts must come from the canonical server query, not client-side aggregation.
- If counts are expensive, return states without counts and let the UI avoid count display.

## Proposed Smallest Safe Fix Batch

- Update shared listing search helpers to use canonical `state` for state-dropdown filters, while parsing legacy `city` and `location`.
- Wire `/services` to URL-derived filters with consistent badge, category, subcategory, price, sort, page, and state params.
- Add clear-filter handling and more accurate empty-state copy.
- Add shared badge option constants and include Bronze on product/service filter accordions.
- Fix service detail responsive classes for the main grid, sidebar rows, booking selector rows, calendar labels, and mobile sticky spacing.
- Extract and test vendor product delete API behavior, require HTTP success, and add delete-in-progress UI.
- Fix legacy vendor product inventory loading/error ordering and the malformed table width class.
- Add targeted unit tests for query construction/persistence/reset/pagination, product delete URL/method/failure, product count source helpers, and responsive class constants where practical.
