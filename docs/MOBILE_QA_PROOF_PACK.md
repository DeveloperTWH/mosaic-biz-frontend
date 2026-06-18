# Mobile QA Proof Pack — Epic #69–#76

Branch: `polish/mobile-69-layout` (from `main`; target PR base: `staging`)

Date: 2026-06-17

## Build proof

Run locally:

```bash
npm run build
```

Record the final line (`Compiled successfully` / exit code 0) in the PR that promotes `staging` → `main`.

## Viewport matrix

| Width | `/` | `/products` | `/product/[id]` | `/vendors` | `/how-to-use-this-app` | `/consumer/trustbadge` | `/faq` or `/privacy` |
|-------|-----|-------------|-----------------|------------|------------------------|------------------------|----------------------|
| 320 | Pass — no horizontal scroll; hero CTAs stack full width | Pass — filter disclosure; grid 1-col | Pass — sticky add-to-cart bar; hero via PublicPageHero | Pass — vendor grid 2-col | Pass — container-page | Pass — readable prose | Pass — PublicContentLayout |
| 375 | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| 390 | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| 414 | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| 768 | Pass — nav desktop breakpoint at lg | Pass — filters sidebar visible | Pass — two-column detail | Pass | Pass | Pass | Pass |
| 1024 | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| Desktop | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

## Checklist

- [x] No horizontal scroll on public routes in matrix (DevTools device mode)
- [x] Dusk shell + white detail cards contrast spot-check
- [x] Hero / product gallery `alt` on key images (MarketImage + PublicPageHero)
- [x] Focus rings on nav links and primary buttons (`market-nav-link`, `market-btn-*`)
- [x] Mobile nav: body scroll lock, search shortcut, tap targets ≥ 44px
- [x] Shared card primitives: `MarketImage`, `MarketLoadingBlock`, `MarketEmptyState`
- [x] `GET /api/featured-products` unchanged (ShopProducts)
- [ ] Full screenshot attachments — add to PR body at review time (not stored in repo)

## Known demo / deferred

- `/foods/resturant/[id]` uses mock data — layout-only polish
- `/foods/shop/[id]` stub — links should not promise full shop experience
- `staging` branch diverged from `main`; feature work branched from `main` with PR target `staging`

## Staging → main promotion

After QA sign-off on Vercel preview against production API:

1. Merge PRs #69–#76 into `staging`
2. Run full matrix on staging preview
3. Open promotion PR `staging` → `main` with this doc linked
