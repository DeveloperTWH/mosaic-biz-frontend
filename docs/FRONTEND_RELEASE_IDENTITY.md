# Frontend Release Identity

Mosaic frontend deployments expose a safe, non-secret build identity for QA and incident review at:

```text
GET /api/build-info
```

The response includes:

- `service`: `mosaic-biz-frontend`
- `release.commit`: short commit SHA or `unknown`
- `release.environment`: Vercel/Sentry/Node environment or `development`
- `release.branch`: branch/ref or `unknown`
- `release.deploymentId`: deployment identifier or `unknown`
- `timestamp`: response timestamp

## Environment Variable Names

Values are configured in Vercel or CI only. Do not commit values.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_RELEASE_COMMIT_SHA` | Optional explicit commit for client-visible builds |
| `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` | Optional public Vercel commit SHA |
| `VERCEL_GIT_COMMIT_SHA` | Server-side Vercel commit SHA |
| `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` / `VERCEL_GIT_COMMIT_REF` | Safe branch/ref label |
| `NEXT_PUBLIC_VERCEL_ENV` / `VERCEL_ENV` | `production`, `preview`, or `development` |
| `NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID` / `VERCEL_DEPLOYMENT_ID` | Safe deployment identifier |
| `SENTRY_RELEASE` | Optional explicit Sentry release label |
| `SENTRY_ENVIRONMENT` | Optional Sentry environment label |

## QA Usage

Record `/api/build-info` output with preview smoke notes and screenshots. If metadata is `unknown`, QA can still proceed locally, but preview/production release evidence should include the Vercel deployment URL and commit from GitHub.

Sentry initialization uses the same helper for release and environment. Dashboard verification still requires `NEXT_PUBLIC_SENTRY_DSN` and an approved preview-only test event.
