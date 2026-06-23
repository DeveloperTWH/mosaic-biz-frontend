# Public Screenshot QA Runbook

**Issue:** #115
**Last updated:** 2026-06-23

## Purpose

Use repeatable Playwright screenshots as PR evidence for public route visual QA. This is not a pixel-perfect regression gate. The goal is to capture comparable proof across common desktop and mobile widths.

## Command

```bash
npm run test:screenshots
```

Screenshots are attached to the Playwright HTML report and written under Playwright test artifacts. Do not commit generated screenshots.

## Pilot Route Group

The pilot spec lives at `e2e/tests/public-screenshot-pilot.spec.ts` and captures:

| Route | Purpose |
| --- | --- |
| `/` | Homepage and primary CTA layout |
| `/products` | Product browse hero/cards |
| `/services` | Service browse hero/cards |
| `/vendors` | Vendor directory hero/cards |
| `/search` | Empty search and filter state |

## Viewports

| Name | Size |
| --- | --- |
| `mobile-390` | 390 x 844 |
| `desktop-1366` | 1366 x 768 |

Manual QA should also inspect these widths when a PR touches layout-heavy surfaces:

| Width | Use |
| --- | --- |
| 320 | Small mobile minimum |
| 375 | Common iPhone width |
| 390 | Modern mobile baseline |
| 414 | Large mobile |
| 768 | Tablet portrait |
| 1024 | Tablet/compact desktop |
| 1366+ | Desktop |

## PR Checklist

- Run `npm run test:screenshots` for visual changes that touch public routes.
- Attach or link the Playwright HTML report artifact in the PR.
- Include mobile nav open/closed proof when header, drawer, or bottom nav changes.
- Include checkout/cart screenshots only when the PR intentionally touches commerce surfaces.
- Do not point screenshot tests at production with live credentials.

## Future Expansion

Add route groups for content pages, auth pages, checkout states, vendor profile details, and mobile nav open/closed once the pilot stays stable for one QA round.
