# Frontend Search Param Contract

**Branch:** `fix/frontend-search-param-normalization`  
**Date (UTC):** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`  
**Module:** [`app/(home)/Components/publicSearch.ts`](../app/(home)/Components/publicSearch.ts)

**Severity:** Post-launch cleanup — not a launch blocker.

---

## Canonical URL params (shareable links)

| Param | Purpose | Example |
|-------|---------|---------|
| `q` | Search keyword | `/search?q=shoes` |
| `city` | Location / state filter | `/search?city=Virginia` |
| `minorityType` | Minority business type filter | `/search?minorityType=...` |
| `tab` | Entity tab on `/search` only (`services`, `foods`; omit for products) | `/search?q=coach&tab=services` |
| `category`, `subcategory`, `badge`, `sort`, `priceMin`, `priceMax`, `page` | Listing pages (`/products`, etc.) | `/products?q=bag&category=...` |

---

## Legacy aliases (read-only backward compatibility)

Parsed by `parseListingFiltersFromSearchParams` — all map to internal `keyword` / `location` state:

| Legacy | Maps to |
|--------|---------|
| `keyword`, `q`, `search` | `keyword` |
| `location`, `city` | `location` |
| `categoryId` | `category` |
| `subcategoryId` | `subcategory` |

When `/search` loads with legacy `keyword`, `search`, or `location` in the URL, the page `router.replace`s to canonical `q` / `city`.

---

## Internal React state

`PublicSearchFilters` uses `keyword` and `location` in components (`PublicSearchFilterBar`, etc.). URL/API mapping happens at boundaries only.

---

## API params (backend contract — unchanged)

| Endpoint | Query params |
|----------|--------------|
| `GET /api/public/search` | `keyword`, `location`, `minorityType` |
| `GET /api/products/list`, `/api/services/list`, `/api/food/list` | `search`, `city`, `minorityType`, `categoryId`, … via `listingFiltersToApiParams` |
| `GET /api/business` (vendors) | `search`, `city`, `productCategory` |

**Do not introduce** `/api/products/featured`. Featured homepage uses `GET /api/featured-products` only.

---

## Unsupported / non-search params

| Param | Notes |
|-------|-------|
| `type` | Auth routing only (`type=vendor`, `type=customer`) — not a search filter |
| `categoryId`, `categorySlug` on `/services` | Still used on services listing (follow-up normalization out of scope for this PR) |

---

## Writers (after this PR)

| Function | Emits |
|----------|-------|
| `buildSearchPageUrl` | Delegates to `buildSearchPageUrlWithTab` → `q`, `city`, … |
| `buildListingPageUrl("/products", …)` | `q`, `city`, … |
| `search/page.tsx` `handleSearch` | `buildSearchPageUrlWithTab` |

---

## Acceptance checks

| URL | Expected |
|-----|----------|
| `/search?q=shoes` | Loads search with keyword "shoes" |
| `/search?keyword=shoes` | Same filters; URL replaced to `?q=shoes` |
| `/search?location=Virginia` | Same as `?city=Virginia`; canonicalized on load |
| `/search?city=Virginia` | Location filter applied |
| `/search` (no params) | Honest empty state — no API call |

---

## Build

```text
npm run build → Pass
```
