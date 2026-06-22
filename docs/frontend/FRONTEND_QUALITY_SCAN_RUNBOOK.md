# Frontend Quality Scan Runbook — Issue #114

**Branch:** `test/frontend-quality-scan-harness`  
**Parent:** #109 · **Epic:** #162  
**Last updated:** 2026-06-21

---

## Purpose

Repeatable, non-destructive quality scans for public Mosaic Biz Hub routes:

- **Accessibility** — axe-core via Playwright (`@axe-core/playwright`)
- **Performance** — Lighthouse CI (desktop + mobile targets)
- **Broken links** — internal link checker on seed public routes
- **Route stability** — HTTP status + crash detection on seed routes

No forms are submitted, no accounts created, no cart/checkout/payment routes scanned.

**Generated artifacts (do not commit):** `quality-reports/`, `.lighthouseci/` (Lighthouse CI temp files including `assertion-results.json`), Playwright report dirs — all listed in `.gitignore`. The scan orchestrator removes `.lighthouseci/` after each run; final reports live under `quality-reports/`.

---

## Tooling inventory (before this harness)

| Tool | Status before #114 |
|------|-------------------|
| ESLint | Present (`npm run lint`) — static analysis only |
| Prettier | Present |
| Playwright E2E | Not on `main` (added separately in #163 branch) |
| Lighthouse / LHCI | **Not present** |
| axe CLI / Playwright axe | **Not present** (axe-core only as transitive dep) |
| Linkinator / broken-link automation | **Not present** — manual docs only (`docs/LINK_QA_AUDIT.md`) |

---

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run quality:scan` | Full harness: build if needed, start local server, Playwright + Lighthouse, summary reports |
| `npm run quality:scan:playwright` | axe + route smoke + links only (expects server at `QUALITY_SCAN_BASE_URL`) |
| `npm run quality:scan:lighthouse` | Desktop + mobile Lighthouse CI (expects running server) |
| `npm run quality:scan:report` | Print `quality-reports/summary.md` |

---

## Environment variable names (values not committed)

| Variable | Purpose |
|----------|---------|
| `QUALITY_SCAN_PORT` | Local Next.js port (default `3098`) |
| `QUALITY_SCAN_BASE_URL` | Scan target origin (default `http://127.0.0.1:3098`) |
| `QUALITY_SCAN_REUSE_SERVER` | Set to `1` when orchestrator already started the server |
| `NEXT_PUBLIC_API_BASE_URL` | API origin for page bootstrapping (mocked in Playwright scans) |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL passed to Next.js during scans |

---

## Seed public routes

| Route | Label |
|-------|-------|
| `/` | Homepage |
| `/products` | Products |
| `/services` | Services |
| `/foods` | Food |
| `/vendors` | Vendors |
| `/search` | Search |
| `/about` | About |
| `/contact` | Contact |
| `/faq` | FAQ |
| `/privacy` | Privacy |
| `/terms` | Terms |
| `/refund-return` | Refund & return |
| `/dispute` | Dispute resolution |
| `/consumer/terms` | Consumer terms |

Excluded by design: `/cart`, `/checkout`, `/payment*`, `/login`, `/signup`, `/admin/*`, `/partners/*`, `/customer/*`.

---

## Targets

### Desktop

- Playwright project: `desktop-chrome` (1366×768)
- Lighthouse preset: `desktop` (`lighthouserc.cjs`)

### Mobile

- Playwright project: `mobile-chrome` (Pixel 5 profile, Chromium engine)
- Lighthouse: `formFactor: mobile` (`lighthouserc.mobile.cjs`)

axe accessibility rules run on desktop HTML for all seed routes (same markup; avoids duplicate mobile axe runtime).

---

## CI policy

**Fail the scan** when:

- axe reports **critical** or **serious** violations on seed routes
- an internal link from seed routes returns **4xx/5xx** or network error
- a seed route returns **HTTP ≥ 400** or throws an uncaught page error

**Warn only** (non-blocking in harness v1):

- Lighthouse performance below documented baselines
- moderate/minor axe findings (still written to per-route JSON reports)

---

## Local execution

```bash
npm install
npx playwright install chromium
npm run build
npm run quality:scan
```

Reports:

- `quality-reports/summary.json` — machine-readable aggregate
- `quality-reports/summary.md` — human-readable aggregate
- `quality-reports/axe/*.json` — per-route axe results
- `quality-reports/links/broken-links.json` — link audit
- `quality-reports/lighthouse/desktop/` — desktop Lighthouse artifacts
- `quality-reports/lighthouse/mobile/` — mobile Lighthouse artifacts
- `quality-reports/playwright-report.json` — Playwright JSON reporter

---

## CI execution (GitHub Actions sketch)

```yaml
- run: npm ci
- run: npx playwright install chromium
- run: npm run build
- run: npm run quality:scan
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: quality-reports
    path: quality-reports/
```

Run on pull requests touching `app/`, `quality/`, or `playwright.quality.config.ts`. Do **not** point scans at production.

---

## API mocking strategy

Public marketplace pages fetch backend data on load. Playwright scans stub read-only GET routes at `NEXT_PUBLIC_API_BASE_URL` so scans remain deterministic without mutating production or staging data.

---

## Related docs

- [LINK_QA_AUDIT.md](../LINK_QA_AUDIT.md) — manual link inventory
- [FRONTEND_ROUTE_MAP.md](FRONTEND_ROUTE_MAP.md) — route evidence
- [FRONTEND_VISUAL_QA_SURFACE.md](FRONTEND_VISUAL_QA_SURFACE.md) — human QA checklist
