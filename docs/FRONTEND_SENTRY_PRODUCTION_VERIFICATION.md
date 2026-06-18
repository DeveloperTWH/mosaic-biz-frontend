# Frontend Sentry Production Verification

**Branch:** `audit/frontend-sentry-production-validation`  
**Date (UTC):** 2026-06-18  
**Repo:** `Digital-Builders-757/mosaic-biz-frontend-launch`  
**Project:** `digital-builders/mosaic-biz-frontend-launch` (Vercel)

**Overall status:** **BLOCKED** — runtime DSN env name mismatch; dashboard event proof not run.

---

## Code/config review

| Item | Status | Evidence |
|------|--------|----------|
| `@sentry/nextjs` in dependencies | **Pass** | `package.json` |
| Client init gated on DSN | **Pass** | `instrumentation-client.ts` — `if (sentryDsn)` |
| Server init gated on DSN | **Pass** | `sentry.server.config.ts`, `sentry.edge.config.ts` |
| `reportApiError` DSN guard | **Pass** | `lib/sentry/reportApiError.ts` (not wired to API clients yet) |
| `global-error.tsx` DSN guard | **Pass** | Added in this PR |
| Build wrapper | **Pass** | `next.config.ts` — `withSentryConfig`, `tunnelRoute: "/monitoring"` |
| Exposed debug/test route | **Pass** | No `/api/sentry-test` or debug page in codebase |
| Test event in production | **Not run** | Requires explicit approval — not triggered |

---

## Vercel environment variables (no secret values)

Checked via `npx vercel env ls` — values encrypted/masked.

### Production

| Variable | Present | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_SENTRY_DSN` | **No** | **Required for client + server runtime init** |
| `SENTRY_DSN` | **Yes** | Legacy name — **not read by app code** |
| `SENTRY_ENVIRONMENT` | **Yes** | |
| `SENTRY_AUTH_TOKEN` | **Yes** | Build-time source maps |
| `SENTRY_ORG` | **Yes** | Build-time |
| `SENTRY_PROJECT` | **Yes** | Build-time |
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | Unrelated — confirmed set |

### Preview

| Variable | Present |
|----------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | **No** |
| `SENTRY_*` (all) | **No** |
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** |

---

## Verdict

| Area | Status | Blocker |
|------|--------|---------|
| SDK integration on `main` | **Pass** | — |
| Production runtime monitoring | **BLOCKED** | Rename/copy `SENTRY_DSN` → `NEXT_PUBLIC_SENTRY_DSN` in Vercel Production |
| Preview runtime monitoring | **BLOCKED** | Add full Sentry env set to Preview |
| Source map upload (production builds) | **Likely Pass** | Build vars present when `SENTRY_AUTH_TOKEN` set at build |
| Sentry dashboard event proof | **BLOCKED** | Pending DSN fix + approved preview test error |
| Safe no-op when DSN missing | **Pass** | All inits guarded |

---

## Remediation (ops — no code deploy required)

1. In Vercel → Project → Settings → Environment Variables:
   - Add **`NEXT_PUBLIC_SENTRY_DSN`** to **Production** and **Preview** (same value as current `SENTRY_DSN`, or rotate if preferred).
   - Optionally remove legacy `SENTRY_DSN` after migration.
   - Copy `SENTRY_ENVIRONMENT`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` to **Preview** if preview builds should upload source maps.
2. Redeploy production after env change.
3. On **preview only**, trigger a one-off test error; confirm issue in Sentry dashboard; remove test trigger.
4. Wire `reportApiError` into shared API error paths (follow-up — not launch blocker).

---

## Config reference

Runtime reads `NEXT_PUBLIC_SENTRY_DSN` from [`lib/sentry/config.ts`](../lib/sentry/config.ts).

See also [`SENTRY_VERCEL_SETUP.md`](SENTRY_VERCEL_SETUP.md).

---

## Build

```text
npm run build → Pass (68 routes)
```

---

## Security

- No DSN, auth token, or org/project values printed in this document.
- `SENTRY_AUTH_TOKEN` is build-only and must not use `NEXT_PUBLIC_` prefix.
