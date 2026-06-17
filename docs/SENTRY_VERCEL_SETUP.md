# Sentry Vercel Setup

> **Status (2026-06-17):** Sentry PR [#1](https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/1) not merged to release-candidate. See [PROJECT_STATUS.md](PROJECT_STATUS.md).

Branch: `feat/sentry-monitoring`  
PR: https://github.com/Digital-Builders-757/mosaic-biz-frontend-launch/pull/1

## Status

- Code complete on feature branch; **not merged to `main`** per launch sprint rules
- Review PR #1 before merge; do not enable push-to-main deployment

## Vercel environment variables

### Runtime (Production + Preview optional)

| Variable | Example | Exposed to browser |
|----------|---------|-------------------|
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...@....ingest.us.sentry.io/...` | Yes |
| `SENTRY_ENVIRONMENT` | `production` | No |

### Build-time only (never `NEXT_PUBLIC_`)

| Variable | Purpose |
|----------|---------|
| `SENTRY_AUTH_TOKEN` | Source map upload |
| `SENTRY_ORG` | Sentry org slug |
| `SENTRY_PROJECT` | Sentry project slug |

## Local development

In `.env.local` (not committed):

```bash
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ENVIRONMENT=development
```

Rename legacy `SENTRY_DSN` to `NEXT_PUBLIC_SENTRY_DSN` if present.

## Post-deploy verification

1. Trigger a test error in preview
2. Confirm issue in Sentry dashboard
3. Confirm stack traces are readable (source maps uploaded when build vars set)
4. Confirm `SENTRY_AUTH_TOKEN` does not appear in client bundle
