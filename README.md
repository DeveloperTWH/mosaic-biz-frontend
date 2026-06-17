# Mosaic Biz Hub — Frontend

Next.js marketplace frontend for **Mosaic Biz Hub** — a platform connecting consumers to verified minority-owned businesses (products, services, and food).

| Item | Value |
|------|--------|
| Launch repo | [Digital-Builders-757/mosaic-biz-frontend-launch](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch) |
| Integration branch | `sprint/frontend-release-candidate` |
| API | `https://api.mosaicbizhub.com` (backend: `Techware-Hut/mosaic-backend`) |
| Docs hub | **[docs/README.md](docs/README.md)** |
| Current status | [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) |

**Production is not auto-deployed.** Work merges to the release-candidate branch and is validated on Vercel preview before any manual production promote.

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

All internal docs live under [`docs/`](docs/README.md):

- **[Project status](docs/PROJECT_STATUS.md)** — where we are today (living)
- **[Roadmap](docs/ROADMAP.md)** — phased next steps
- **[Architecture](docs/ARCHITECTURE.md)** — routes, env, deployment, auth
- **[API contracts](docs/API_CONTRACTS.md)** — canonical endpoints
- **[Style guide](docs/STYLE_GUIDE.md)** — design tokens
- **[Smoke checklist](docs/FRONTEND_SMOKE_CHECKLIST.md)** — preview QA

---

## Release workflow (summary)

1. Feature/sprint work → PR into `sprint/frontend-release-candidate` on the **launch repo**
2. Vercel builds a **Preview** (may require team SSO)
3. QA runs [smoke checklist](docs/FRONTEND_SMOKE_CHECKLIST.md) on preview
4. Manual promote to production when approved — not on every merge to `main`

See [docs/ROADMAP.md](docs/ROADMAP.md) for current phase and non-goals.
