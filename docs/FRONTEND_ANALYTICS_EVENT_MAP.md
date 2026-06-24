# Frontend Analytics Event Map

**Issue:** #119
**Last updated:** 2026-06-23

## Launch Decision

Implementation should remain deferred until the team chooses an analytics destination. This document defines the launch event contract now so Vercel Analytics, PostHog, GA4, Segment, or a future backend collector can be wired without guessing.

No paid ad tracking, cross-site tracking, raw PII, tokens, full addresses, payment details, or free-form form text should be included.

## Privacy Rules

- Use anonymous/session identifiers supplied by the analytics provider, not raw user emails or phone numbers.
- Never send passwords, OTPs, auth tokens, Stripe secrets, payment intent client secrets, card details, message bodies, or uploaded document names.
- Prefer route, listing type, safe IDs, counts, booleans, and coarse status values.
- For validation errors, send field keys and error categories only, not the user-entered value.
- Keep vendor/customer role as a coarse enum only when the user is authenticated and the role is already known to the client.

## Priority Events

| Priority | Event name | Trigger | Safe payload |
| --- | --- | --- | --- |
| P0 | `homepage_cta_clicked` | Shopper or vendor CTA from home | `cta`, `destination`, `position` |
| P0 | `category_clicked` | Browse category card click | `listingType`, `categoryId`, `categorySlug` |
| P0 | `search_submitted` | Public search submitted | `hasKeyword`, `hasLocation`, `hasMinorityType`, `activeTab` |
| P0 | `listing_card_clicked` | Product/service/food card click | `listingType`, `listingId`, `vendorId`, `sourceRoute` |
| P0 | `vendor_profile_viewed` | Vendor profile route loaded | `profileType`, `vendorId`, `sourceRoute` |
| P0 | `add_to_cart_clicked` | Product detail add-to-cart | `productId`, `vendorId`, `hasVariant`, `blockedReason` |
| P0 | `checkout_started` | Customer begins checkout | `itemCount`, `vendorCount`, `hasShipping` |
| P0 | `checkout_completed` | Payment success page loaded | `orderCount`, `currency`, `status` |
| P0 | `checkout_failed` | Checkout/payment error shown | `stage`, `errorKind`, `requestIdPresent` |
| P0 | `vendor_application_started` | Vendor application entry opened | `entryRoute`, `selectedType` |
| P0 | `vendor_onboarding_step_completed` | Vendor completes a step | `step`, `status`, `paymentStatus` |
| P1 | `featured_listing_clicked` | Featured product/card click | `listingType`, `listingId`, `position` |
| P1 | `filter_changed` | Browse/search filter changed | `listingType`, `filterKey`, `hasValue` |
| P1 | `form_validation_failed` | Client validation blocks submit | `formName`, `fieldKeys`, `errorCount` |
| P1 | `support_contact_clicked` | Contact/support mail/phone/social click | `method`, `sourceRoute` |
| P2 | `empty_state_seen` | Empty/low inventory panel visible | `surface`, `listingType`, `hasFilters` |

## Implementation Notes

- Put provider-specific code behind a thin helper such as `lib/analytics/events.ts`.
- The helper should no-op when the provider is not configured.
- Sentry should continue to own exceptions and request correlation, not product analytics.
- Checkout analytics must not include Stripe client secrets, PaymentIntent metadata, card data, or customer contact fields.

## Launch Coverage Target

Before public launch, implement P0 events only. P1/P2 events are useful after the first QA round confirms the core journeys are stable.
