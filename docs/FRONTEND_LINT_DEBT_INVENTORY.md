# Frontend Lint Debt Inventory

**Branch:** `audit/frontend-lint-debt-inventory`  
**Date (UTC):** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`  
**Base commit:** `main` @ `a1e0dccf`  
**Command:** `npm run lint` / `npx eslint . --format json`

**Severity:** Post-launch cleanup — **not a deployment blocker** (`npm run build` passes).

---

## Totals

| Metric | Count |
|--------|------:|
| **Total problems** | **662** |
| Errors | 345 |
| Warnings | 317 |
| Files with messages | 187 |

Matches baseline documented in [FRONTEND_LIVE_DOMAIN_SMOKE_PROOF.md](FRONTEND_LIVE_DOMAIN_SMOKE_PROOF.md).

---

## By ESLint rule (top 15)

| Rule | Count | Type |
|------|------:|------|
| `@next/next/no-img-element` | 133 | Prefer `next/image` |
| `no-restricted-syntax` (hex Tailwind) | 128 | Custom warn — hardcoded `#` colors |
| `react/no-unescaped-entities` | 109 | Apostrophes/quotes in JSX text |
| `react-hooks/set-state-in-effect` | 100 | Hooks pattern |
| `react-hooks/rules-of-hooks` | 67 | Conditional hooks |
| `react-hooks/exhaustive-deps` | 53 | Missing deps |
| `react-hooks/immutability` | 24 | React Compiler / hooks |
| `react-hooks/refs` | 17 | Ref usage during render |
| `react-hooks/static-components` | 15 | Component created in render |
| Other (≤6 each) | 16 | Mixed |

---

## By area

| Area | Total | Errors | Warnings |
|------|------:|-------:|---------:|
| `app/(home)` | 465 | 217 | 248 |
| `app/(partner)` | 139 | 91 | 48 |
| `app/admin` | 40 | 27 | 13 |
| `app/(auth)` | 14 | 6 | 8 |
| `app/other` | 3 | 3 | 0 |
| Root / misc | 1 | 1 | 0 |

---

## Launch-risk subset

Issues in **public launch paths** (nav, search, `publicSearch`, middleware) that are **errors**:

| Path | Error count |
|------|------------:|
| `app/(home)/Components/nav/*` | **0** |
| `app/(home)/search/*` | **0** |
| `app/(home)/Components/publicSearch.ts` | **0** |
| `middleware.ts` | **0** |
| `app/(auth)/login`, `signup` | **6** (hooks rules — pre-existing; auth pages still render in prod smoke) |

**Conclusion:** No lint errors block marketplace nav/search launch paths. Auth hook violations are medium-priority post-launch fixes.

---

## Phased cleanup plan

### Phase 1 — CI guard (recommended next)
- Fail CI only on **new** lint errors in changed files (eslint incremental / lint-staged).
- Do **not** mix repo-wide lint fixes with feature PRs.

### Phase 2 — Public marketplace (`app/(home)`)
- Replace raw `<img>` with `next/image` where low-risk (133 warnings/errors).
- Migrate hex Tailwind to design tokens (128 `no-restricted-syntax` warnings).

### Phase 3 — Partner/admin (`app/(partner)`, `app/admin`)
- Reduce `any` and hooks violations in onboarding/dashboard flows.
- Target files touched by authenticated vendor work.

### Phase 4 — Auth (`app/(auth)`)
- Fix conditional hooks in login/signup (6 errors).

---

## Follow-up issue categories (optional)

| Category | Approx. count | Suggested label |
|----------|--------------:|-----------------|
| `no-img-element` migration | 133 | `post-launch`, `dx` |
| Hex Tailwind token migration | 128 | `post-launch`, `design-system` |
| React hooks debt | ~276 | `post-launch`, `react` |
| Unescaped entities | 109 | `post-launch`, `low-risk` |

Link epic: [#109 — Frontend quality systems](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/issues/109)

---

## Build gate (unchanged)

```text
npm run build → Pass (68 routes)
npm run lint  → Fail (662 pre-existing — inventory only, no fixes in this PR)
```

---

## Rules

- This PR adds **documentation only** — no application code changes.
- Do not combine lint mass-fix with launch-polish behavior PRs (#132–#134).
