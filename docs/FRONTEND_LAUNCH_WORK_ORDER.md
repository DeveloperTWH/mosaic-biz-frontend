# Frontend Launch Work Order

**Type:** Operating playbook  
**Last updated:** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`  
**Use when:** Backend/API/domain connectivity is being fixed in parallel — keep frontend moving on safe work.

Phased roadmap: [ROADMAP.md](ROADMAP.md)  
Proof pack: [FRONTEND_NAV_LAUNCH_QA.md](FRONTEND_NAV_LAUNCH_QA.md)

---

## Context

The domain/API team is sorting out `app.mosaic...`, CORS, and environment variables. Frontend should not idle. Continue launch-readiness work that **does not require backend connectivity**, while documenting anything blocked honestly.

### Known API blocker (do not mask)

| Endpoint | Error | Routes |
|----------|-------|--------|
| `/api/vendor-onboarding/onboarding-data` | `Failed to fetch` | `/partners/business-profile` |
| `/api/business/my` | `AxiosError: Network Error` | `/partners/dashboard` |

Likely causes: `NEXT_PUBLIC_API_BASE_URL`, final app domain, CORS, cookies, backend deployment.

---

## Rules

| Do | Do not |
|----|--------|
| Improve nav, static layout, fallbacks, QA docs | Commit directly to `main` without review |
| Show honest loading/empty/error states | Fake live API data |
| Keep legal links in footer | Hide network/auth errors silently |
| Document API-blocked routes | Make onboarding/dashboard look complete when API is down |
| Preserve desktop behavior unless nav cleanup | Change backend contracts or API route names |
| Run `npm run build` before PR | Touch Stripe/payment/order logic |
| Branch from `main` for polish work | Deploy from polish branches without approval |

---

## Work order (priority)

### 1. Navigation cleanup

| Task | Acceptance |
|------|------------|
| Remove desktop header **More** | HOME, SHOP, BECOME A VENDOR, LEARN + login/cart only |
| Simplify hamburger | Marketplace, CTA, Explore, Account — not a sitemap |
| Remove legal/policy from header/drawer | Footer Legal column has all 8 links |
| Polish bottom nav | Home, Shop, Discover, Cart, Account; active state; safe-area; 44px taps |
| Remove duplicate FAQ in drawer | FAQ once under Explore |

**Status (2026-06-18):** Done on `main` via PR #108; verified in polish sprint.

---

### 2. Static / mobile visual polish

| Task | Acceptance |
|------|------------|
| Homepage readability | No pale text on light cards; mobile spacing |
| Legal/FAQ pages | `market-surface-light` + `market-prose-light` |
| Product card skeletons | Grid placeholders on `/products`, `/services`, `/foods`, `/search`, `/vendors` |
| Honest API failure UI | No infinite spinners; `MarketEmptyState` with CTA |
| Vendor profile fallbacks | Loading/error on live `/vendor-profile/*` |
| Product detail error state | `/product/[id]` shows unavailable state on fetch failure |

**Status (2026-06-18):** Done on branch `sprint/frontend-launch-polish-with-api-blockers-documented` @ `66b20b72`.

---

### 3. Proof docs

| Deliverable | Location |
|-------------|----------|
| Route checklist | [FRONTEND_NAV_LAUNCH_QA.md](FRONTEND_NAV_LAUNCH_QA.md) |
| Screenshot checklist | Same |
| API blocker list | Same + [ROADMAP.md](ROADMAP.md) Track B |
| Test matrix (with/without backend) | Same |
| Build/lint/tsc results | Same |

---

## Sprint workflow

### Phase 1 — Repo check

```powershell
git status
git branch --show-current
git fetch origin
```

Confirm: bottom nav present? Header More removed? Do not start broad rewrites.

### Phase 2–6 — Implementation

Follow work order above. See [ROADMAP.md](ROADMAP.md) Phase 1 for next items (#74, #76–#84).

### Phase 7 — Documentation

Create or update `docs/FRONTEND_NAV_LAUNCH_QA.md` with branch, date, commit, changes, blockers, checklists.

### Phase 8 — Validation

```powershell
npm install
npm run build
npm run lint
npx tsc --noEmit
```

Document lint debt if repo-wide; note whether changed files added new errors.

### Phase 9 — Commit

```text
style: polish frontend launch UI with API blockers documented
```

Exclude `.gh-comment-*.md`, `.pr-body-*.md` drafts from commits.

---

## What QA can test without backend

- Navigation (header, drawer, bottom nav, footer legal)
- Static pages: `/`, `/about`, `/contact`, `/faq`, `/how-to-use-this-app`, legal routes
- Layout, spacing, readability
- Skeleton loading UI
- Error UI (invalid product ID, vendors with API down)
- Legacy route redirects (`next.config.ts`)

## What requires staging / live backend

- Live listings and search results
- Vendor storefronts with real data
- Product detail with real inventory
- Partner dashboard and business profile
- Cart, checkout, authenticated flows

---

## Related GitHub issues

#73 Visual Pass 2 epic · #74 Readability · #75 Header/hamburger · #76 Cards · #77 Detail hierarchy · #78 Homepage storytelling · #79 Public content · #80 CTA/footer · #81 WCAG · #82 Proof pack · #83 Vendor profile · #84 Demo audit · #95 Mobile nav · #97 Bottom nav · #98 Hamburger · #101 Sticky commerce · #103 Mobile nav QA

---

## Launch-readiness language

| Claim | When valid |
|-------|------------|
| **Frontend PR readiness** | Build passes; API blockers documented; no fake data |
| **Production launch readiness** | Track B resolved; staging E2E pass; legal/business sign-off |

Do not claim production launch while partner routes show network errors due to env/domain/CORS.
