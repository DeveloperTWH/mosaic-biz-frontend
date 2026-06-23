# Mosaic Biz Hub — Frontend

Next.js marketplace frontend for **Mosaic Biz Hub** — a platform connecting consumers to verified minority-owned businesses (products, services, and food).

| Item | Value |
|------|--------|
| Launch repo | [Digital-Builders-757/mosaic-biz-frontend-launch](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch) |
| Integration branch | `develop` |
| Production branch | `main` |
| API | `https://api.mosaicbizhub.com` (backend: `Techware-Hut/mosaic-backend`) |
| Docs hub | **[docs/README.md](docs/README.md)** |
| Current status | [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) |

**Branching:** feature branches → `develop` → `main`. See [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md). Merging to `main` auto-deploys production on Vercel.

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm

---

## Local development

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create `.env.local` (not committed) with at least:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001   # local backend, or https://api.mosaicbizhub.com for API-only checks
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

**Note:** Calling the production API from `localhost` often fails in the browser due to CORS. Run the backend locally on `:3001` for full UI dev, or use a Vercel preview for integration QA.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build — **release gate** |
| `npm run start` | Serve production build |

---

## Documentation

All internal docs: **[docs/README.md](docs/README.md)**

| Doc | Purpose |
|-----|---------|
| [Platform operating model](docs/PLATFORM_OPERATING_MODEL.md) | **Source of truth** — how the platform is supposed to work |
| [Project status](docs/PROJECT_STATUS.md) | Where we are today (living) |
| [Vendor eligibility](docs/MARKETPLACE_VENDOR_ELIGIBILITY.md) | Admin vs public marketplace visibility |
| [Project breakdown](docs/PROJECT_BREAKDOWN.md) | Frontend architecture overview |
| [Architecture](docs/ARCHITECTURE.md) | Routes, env, deployment, auth |
| [API contracts](docs/API_CONTRACTS.md) | Canonical endpoints |
| [Roadmap](docs/ROADMAP.md) | Phased next steps |
| [Style guide](docs/STYLE_GUIDE.md) | Design tokens |
| [Git workflow](docs/GIT_WORKFLOW.md) | Feature → `develop` → `main` |
| [Smoke checklist](docs/FRONTEND_SMOKE_CHECKLIST.md) | Preview QA |
| [Archive index](docs/archive/README.md) | Dated QA proofs — not current behavior |
| [Backend doc redesign guide](docs/BACKEND_DOCUMENTATION_REDESIGN_GUIDE.md) | Align `mosaic-backend` docs with frontend |

---

## Release workflow (summary)

1. Branch from `develop` → work on a feature branch → PR into **`develop`**
2. Vercel builds **previews** for feature branches and `develop` (may require team SSO)
3. QA runs the [smoke checklist](docs/FRONTEND_SMOKE_CHECKLIST.md) on the **`develop` preview**
4. When integration is signed off → PR **`develop` into `main`** → production auto-deploys

Full details: [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md). Current phase: [docs/ROADMAP.md](docs/ROADMAP.md).
