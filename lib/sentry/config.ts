export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const sentryEnvironment =
  process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development";

export const tracesSampleRate =
  process.env.NODE_ENV === "development" ? 1.0 : 0.1;

export const sentryRelease = process.env.VERCEL_GIT_COMMIT_SHA;
