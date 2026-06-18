# Mosaic Biz Hub — Style Guide

This document is the source of truth for visual design in `mosaic-biz-frontend`. Tokens live in [`tailwind.config.js`](../tailwind.config.js); shared utilities live in [`app/globals.css`](../app/globals.css); reusable components live in [`components/ui/`](../components/ui/).

## Brand colors

Use Tailwind tokens — never hardcode hex in components.

| Token | Hex | Use |
|-------|-----|-----|
| `brand-navy` | `#0B1426` | Primary dark background, footer, hero base |
| `brand-navy-light` | `#1A1F71` | Buttons, nav accents, secondary dark surfaces |
| `brand-purple` | `#2E1A47` | Gradient mid-tone |
| `brand-purple-light` | `#4C2A6A` | Hover states on purple surfaces |
| `brand-teal` | `#14B8A6` | Links, success accents |
| `brand-teal-dark` | `#0D9488` | Teal hover |
| `brand-gold` | `#C7A040` | Primary CTA, accents, dividers |
| `brand-gold-light` | `#E5C76B` | Gold hover |
| `brand-cream` | `#FFF6E0` | Warm backgrounds, badges (alias: `custom-soil`) |
| `brand-muted` | `#5F5F5F` | Secondary body text |
| `brand-orange` | `#CE5F44` | Category accents (alias: `custom-orange`) |
| `brand-yellow` | `#F9AE53` | Category accents (alias: `custom-yellow`) |
| `brand-sky` | `#16A1C0` | Category accents (alias: `custom-blue`) |

### Public marketplace (`market-*`) — PR #30 dusk shell

Use on homepage and public listing routes (`/products`, `/foods`, `/services`, `/vendors`, `/about`). **Do not** apply `market-*` to auth, checkout, or partner dashboard — those keep `brand-*` / `surface-*`.

| Token | Hex | Use |
|-------|-----|-----|
| `market-bg` | `#120B2F` | Page background |
| `market-surface` | `#18123A` | Cards, panels |
| `market-elevated` | `#211747` | Raised surfaces, filter panels |
| `market-header` | `#0A0618` | Header-adjacent dark bands |
| `market-pill` | `#2D2652` | Pills, chips, inactive controls |
| `market-text` | `#EDE7FF` | Primary text on dark |
| `market-muted` | `#A9A2D8` | Secondary text on dark |
| `market-gold` | `#E2B84B` | Primary CTA on marketplace |
| `market-gold-hover` | `#F5D76E` | CTA hover |
| `market-teal` | `#2DD4BF` | Links, accents on dark |
| `market-glow` | `#7E22CE` | Glow accents |

**Backgrounds & shadows:** `bg-market-hero`, `bg-market-glow-radial`, `bg-market-cta-band`, `shadow-market-card`, `shadow-market-glow`.

**When to use which family:**

| Surface | Tokens |
|---------|--------|
| Public marketplace (browse) | `market-*` |
| Auth, checkout, payment success | `brand-*` |
| Partner dashboard, onboarding forms | `surface-*`, `dashboard-*` |
| Legal / legacy pages | Migrate toward `brand-*`; many still legacy |

### Dashboard / partner surfaces

| Token | Hex | Use |
|-------|-----|-----|
| `surface-cream` | `#f7f2eb` | Partner dashboard page background |
| `surface-panel` | `#fcfaf6` | Cards, panels |
| `border-warm` | `#ebe2d3` | Panel borders |
| `dashboard-gold` | `#c9a44a` | Dashboard CTAs (maps to brand gold family) |
| `dashboard-text` | `#1c1c1c` | Dashboard primary text |
| `dashboard-muted` | `#8e816d` | Dashboard labels and eyebrows |
| `dashboard-input-border` | `#ddd3c4` | Form field borders |
| `dashboard-border-light` | `#e6dccd` | Table and section dividers |
| `dashboard-warn-border` | `#e4b2a8` | Error/warning panel borders |
| `dashboard-warn-bg` | `#fff3f0` | Error/warning panel backgrounds |
| `dashboard-warn-text` | `#9f4332` | Error/warning text |

### Gradients & shadows

- `bg-brand-gradient` — hero, CTA bands
- `bg-hero-gradient` — hero overlay
- `shadow-glass` — elevated cards, dropdowns

## Legacy hex deprecation map

When migrating old code, replace:

| Replace | With |
|---------|------|
| `#1A1F71`, `#1a1f71` | `brand-navy-light` |
| `#0B1426` | `brand-navy` |
| `#d1aa45`, `#c19a38`, `#c9a44a` | `brand-gold` or `dashboard-gold` |
| `#FFF6E0`, `#fbf4e6`, `#fff6df` | `brand-cream` |
| `#5F5F5F` | `brand-muted` |
| `#03989e` | `brand-teal` |
| `#f7f2eb`, `#fcfaf6`, `#ebe2d3` | `surface-cream`, `surface-panel`, `border-warm` |
| `hover:bg-blue-700` | `hover:bg-brand-navy` or `hover:bg-brand-teal-dark` |
| `bg-blue-600`, `bg-blue-900` | `bg-brand-navy-light`, `bg-brand-navy` |

Legacy `custom-*` tokens remain as aliases for backward compatibility but should not be used in new code.

## Typography

| Role | Font | Tailwind class |
|------|------|----------------|
| Body & headings | Poppins | `font-poppins` |
| Labels & subcopy | Montserrat | `font-montserrat` |
| Optional accent | Mulish | `font-mulish` |

Fonts load via `next/font` in [`app/(home)/layout.tsx`](../app/(home)/layout.tsx). Do not use Google CDN `@import` for fonts.

**Root scale:** `html { font-size: 14.4px }` — all rem-based Tailwind sizes are ~90% of default. Keep this until a deliberate redesign.

### Heading patterns

```html
<h2 class="section-heading">Section Title</h2>
<div class="section-divider"></div>
```

For headings on dark backgrounds:

```html
<h2 class="section-heading-inverse">Ready to grow?</h2>
```

Legacy `.heading` (42px zinc) is deprecated — use `.section-heading`.

## Layout

| Pattern | Class / value |
|---------|---------------|
| Page container | `.container-page` → `max-w-7xl px-4 sm:px-6 lg:px-8` |
| Wide content | `max-w-[1400px]` for product grids only |
| Section spacing | `py-12` to `py-16` |
| Fixed header offset | `with-fixed-header` on `<html>`; `--header-h`, `--announcement-h` CSS vars |

## Components

Shared UI lives in `components/ui/`. Prefer these over hand-rolled buttons:

| Component | Variants |
|-----------|----------|
| `Button` | `default` (gold), `secondary` (navy), `outline`, `ghost`, `destructive` |
| `Input` | Standard form input with brand focus ring |
| `Card` | Panel with warm border for dashboard/marketing |

### Button utility classes (globals.css)

- `.btn-primary` — gold CTA
- `.btn-secondary` — navy filled
- `.btn-outline-white` — ghost on dark backgrounds
- `.dropdown-link` — nav dropdown item on dark panels

### Public marketplace utility classes (`app/globals.css`)

Use on public marketplace routes and education pages inside the `market-page` shell.

| Class | Use |
|-------|-----|
| `.market-btn-primary` / `.market-btn-secondary` / `.market-btn-outline` | Marketplace CTAs with `focus-visible` rings and `:disabled` opacity |
| `.market-card-light` | White elevated card on dusk pages — step cards, resource cards |
| `.market-card-light-title` | Headings on white cards — `text-brand-navy` |
| `.market-card-light-body` | Body copy on white cards — `text-brand-muted` |
| `.market-step-badge` | Numbered step badges (gold circle) |
| `.market-support-callout` | Info callout on dusk background (not `bg-blue-50`) |
| `.market-input` | Text fields; border `white/15`, gold focus ring |
| `.market-label` | Form field labels (`text-market-muted`) |
| `.market-select` | Native `<select>` — extends `.market-input` with `appearance-none pr-10` |
| `.market-select-wrap` + `.market-select-chevron` | Wrapper + chevron for native selects |
| `.market-card` | Listing card shell — border `white/15`, gold hover border |
| `.market-card-media` | Card image area (`bg-market-elevated`) |
| `.market-card-placeholder` | Missing image/logo placeholder |
| `.market-card-title` / `.market-card-desc` | Title and body hierarchy |
| `.market-card-price` / `.market-card-price-sale` | Price display (gold / sale red) |
| `.market-card-footer` | Badge/footer row inside cards |
| `.market-card-action` | Card CTA label (View, Shop, etc.) |
| `.market-empty-state` / `.market-empty-state-title` | Empty listing panels |
| `.market-result-count` | “Showing X–Y of Z” result counts |
| `.market-carousel-btn` | Carousel prev/next with focus ring |
| `.market-dropdown-link` | Custom dropdown list items (e.g. `CustomSelect`) |
| `.filter-panel` + `.accordion-*` | Sidebar filter accordion (shared across listings) |

**Native `<select>` note:** OS option menus cannot be fully themed; closed state uses `market-select`. Prefer `CustomSelect` for fully themed dropdowns where needed.

## Patterns

### Section block

```tsx
<section className="py-16">
  <div className="container-page text-center">
    <h2 className="section-heading">Browse by Category</h2>
    <div className="section-divider" />
    <p className="mt-4 font-montserrat text-sm text-gray-600">Subcopy here</p>
  </div>
</section>
```

### Hero CTA (public marketplace)

```tsx
<Link href="/products" className="market-btn-primary min-w-[220px]">Explore Marketplace</Link>
<Link href="/become-a-vendor" className="market-btn-outline min-w-[220px]">Become a Vendor</Link>
```

### Light card on dusk page

When placing `bg-white` cards inside `market-page`, **always** use light-card utilities — never inherit `market-text`:

```tsx
<article className="market-card-light">
  <h3 className="market-card-light-title">Step title</h3>
  <p className="market-card-light-body">Body copy</p>
</article>
```

### Vendor expand CTA band

Reuse `VendorExpandCta` from `app/(home)/Components/VendorExpandCta.tsx` instead of duplicating `w-screen ml-[-50vw]` bands.

### Glass navbar

Header uses `.glass-header` on `#site-header` with brand-navy frosted background.

## House design patterns (Epic #54)

Inspired by stronger Digital Builders projects (ViZb, TOTL) — **Mosaic stays distinct**:

| Pattern | Mosaic implementation |
|---------|----------------------|
| Bold section hierarchy | `market-section-heading` + `market-section-divider` on dusk; centered subcopy `text-market-muted` |
| Dark-background discipline | `market-page` shell; no pale lavender (`market-text`) on white surfaces |
| Elevated cards | `market-card` (dusk) or `market-card-light` (white on dusk) with `shadow-market-card` |
| Readable text hierarchy | Titles `font-poppins semibold`; body `font-montserrat` with `leading-relaxed` and `max-w-2xl` subcopy |
| Premium buttons | `market-btn-primary` for primary path; `market-btn-outline` for secondary on dark bands |
| Visible focus states | `focus-visible:ring-market-gold/*` on nav, footer, buttons |
| Mobile-first polish | `min-h-11` tap targets; stack grids at `md:` / `lg:` breakpoints |

## Do / Don't

**Do**

- Use `brand-*` and `surface-*` tokens
- Use `components/ui` for buttons and inputs
- Use `.section-heading` + `.section-divider` for marketing sections
- Use `hover:bg-brand-navy` instead of generic blue hovers

**Don't**

- Hardcode `#hex` in `className` or inline `style`
- Use `text-market-text` or inherit dusk body color on `bg-white` cards — use `market-card-light-title` / `market-card-light-body`
- Use pale lavender subcopy on white cards (fails WCAG)
- Use `w-screen ml-[-50vw]` full-bleed bands (causes horizontal overflow) — use `VendorExpandCta` or `w-full`
- Load fonts from Google CDN in CSS
- Use `custom-*` in new code (use `brand-*` equivalents)
- Mix `max-w-6xl` and `max-w-7xl` on adjacent sections without reason

## Migration status

| Area | Status |
|------|--------|
| Homepage + public chrome (`app/(home)/Components/*`) | **v3** — `market-*` dusk shell (PR #30) |
| Public listings (`/products`, `/foods`, `/services`, `/vendors`) | **v3.1** — readability polish (#41/#42/#44); shared `market-card-*` + form classes |
| Public heroes (`PublicPageHero`) | **v3** — shared dark hero |
| Auth (`app/(auth)/*`) | v2 — `brand-*` navy/gold buttons |
| Checkout (`app/(home)/checkout/*`) | v2 — `brand-*` (out of PR #30 scope) |
| Payment success (`app/(home)/payment-success`) | v2 — `brand-*` |
| Partner dashboard | v2 — `surface-*` / `dashboard-*` (forms partially migrated) |
| Vendor onboarding hub (`app/(home)/partners/page.tsx`) | v2 — `brand-*` on CTAs and progress |
| Vendor education (`/become-a-vendor`) | **v3.2** — Epic #54 Batch 1: `PublicPageHero`, light cards, `market-btn-*` CTAs |
| Vendor profiles / payment inline styles | Legacy — not yet migrated |
| Legal pages (FAQ, privacy, terms) | Legacy — Arial CSS files |
