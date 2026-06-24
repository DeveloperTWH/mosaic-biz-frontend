# Frontend SEO Metadata Audit

**Issues:** #113, related #109
**Last updated:** 2026-06-23

## Scope Covered

This pass adds a shared metadata helper at `lib/seo/metadata.ts` and route-level metadata for the launch-critical public surfaces below.

| Route group | Status | Notes |
| --- | --- | --- |
| `/` | Covered | Root layout has brand title template, description, Open Graph, Twitter, canonical `/`. |
| `/products` | Covered | Product browse metadata plus fallback for legacy product browse children. |
| `/services` | Covered | Service browse metadata plus fallback for legacy service detail children. |
| `/foods` | Covered | Food and grocery browse metadata plus fallback for food detail aliases. |
| `/vendors` | Covered | Vendor directory metadata plus fallback for legacy vendor alias children. |
| `/search` | Covered | Search metadata with safe generic copy. |
| `/product/[id]` | Covered | Safe generic fallback metadata. Dynamic product SEO fields are deferred. |
| `/service/[slug]` | Covered | Safe generic fallback metadata. Dynamic service SEO fields are deferred. |
| `/vendor-profile/*` | Covered | Safe generic fallback metadata for product, service, and food vendor profiles. |
| `/about`, `/contact`, `/faq`, `/how-to-use-this-app` | Covered | Brand/content-page titles and descriptions. |
| `/become-a-vendor`, `/refer-a-vendor` | Covered | Vendor acquisition titles and descriptions. |
| `/privacy`, `/terms`, `/refund-return`, `/dispute` | Covered | Policy metadata. |
| `/consumer/terms`, `/vendor/terms` | Covered | Audience-specific policy metadata. |
| `/consumer/trustbadge`, `/vendor/trustbadge` | Covered | Trust badge guide metadata. |
| `/cart`, `/checkout`, `/payment-success` | Covered | Transactional metadata with `noIndex`. |
| `/login`, `/signin`, `/signup`, `/forgot-password` | Covered | Account metadata with `noIndex`. |

## Safety Rules

- Metadata copy must not invent inventory, reviews, shipping guarantees, vendor eligibility, or payment outcomes.
- Transactional and account routes use `noIndex`.
- Dynamic detail pages currently use honest generic fallback copy until backend-provided SEO fields are available.
- `NEXT_PUBLIC_APP_URL` remains the canonical origin source. Invalid values fall back to `https://mosaicbizhub.com`.

## Backend SEO Fields Needed Later

Dynamic share previews would improve if backend detail responses expose:

| Surface | Useful fields |
| --- | --- |
| Product detail | `seoTitle`, `seoDescription`, primary share image, canonical slug, vendor business name. |
| Service detail | `seoTitle`, `seoDescription`, cover image, canonical slug, business name. |
| Food vendor profile | Business name, short description, cover image, canonical slug. |
| Vendor profile | Business name, short description, logo/cover image, canonical slug. |

Until those fields exist and are stable, the frontend uses safe fallback route metadata.

## Verification

- `npm run test:unit`
- `npm run build`
- `npx playwright test e2e/tests/public-marketplace.spec.ts`
