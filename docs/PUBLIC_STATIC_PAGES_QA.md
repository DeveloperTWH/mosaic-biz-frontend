# Public Static Pages — Layout & QA (#90, #89, #93)

**Epic:** [#88](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/88)  
**Issues:** [#90](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/90) shared layout · [#89](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/89) terms readability · [#93](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/93) a11y/mobile QA  
**Last updated:** 2026-06-22

---

## Shared layout (#90)

| Component | Path | Purpose |
|-----------|------|---------|
| `PublicContentLayout` | `app/(home)/Components/PublicContentLayout.tsx` | Hero + container; `proseVariant="legal"` for policy pages |
| `PolicyPageCta` | `app/(home)/Components/PolicyPageCta.tsx` | Full-width CTA band below legal content |

### Pages using `PublicContentLayout`

| Route | `proseVariant` | Notes |
|-------|----------------|-------|
| `/terms` | `legal` | Main platform terms |
| `/privacy` | `legal` | Privacy policy |
| `/refund-return` | `legal` | Refund & return |
| `/dispute` | `legal` | Dispute resolution |
| `/faq` | `legal` | FAQ accordion content |
| `/consumer/terms` | `legal` | Consumer terms + vendor CTA footer |
| `/vendor/terms` | `legal` | Vendor terms + become-a-vendor CTA |

### Documented intentional exceptions

| Route | Pattern | Reason |
|-------|---------|--------|
| `/about` | `PublicPageHero` + section components | Marketing storytelling layout |
| `/contact` | `PublicPageHero` + dark form shell | Interactive inquiry form |
| `/how-to-use-this-app` | `PublicPageHero` + `market-card-light` grid | Guided journey cards |
| `/consumer/trustbadge` | `PublicPageHero` + badge table | Trust badge explainer |
| `/vendor/trustbadge` | Same as consumer trustbadge | Vendor-facing badge copy |

---

## Readability (#89)

- Policy pages use `market-surface-light` + `market-prose-light` (`text-brand-navy` headings, `text-brand-muted` body).
- Removed legacy `text-gray-500` / `text-gray-700` on migrated routes.
- CTA bands use `bg-brand-navy/85` with focus-visible rings on links.

---

## Mobile & accessibility QA checklist (#93)

Run at **320, 375, 390, 414, 768, 1280** px.

| Check | Pass criteria |
|-------|---------------|
| Contrast | Body text readable on light legal card; no dark-on-dark prose |
| Heading order | Single `h1` per page; sections use `h2`/`h3` in order |
| Horizontal scroll | None on legal pages at mobile widths |
| Header overlap | Hero title visible below fixed header |
| Keyboard focus | Tab through header links, in-page links, footer legal links |
| Link states | Visible focus ring on CTA and inline policy links |
| Images | Hero/background decorative; logo alt text present in nav |

### Routes in quality scan seed list

See `quality/publicRoutes.ts` — includes `/consumer/terms`, `/vendor/terms`, and core legal routes.

---

## Commands

```powershell
npm run build
npm run quality:scan:playwright   # optional — requires local server
```

---

## Build proof

Document result here after merge:

| Command | Result |
|---------|--------|
| `npm run build` | Pass |
