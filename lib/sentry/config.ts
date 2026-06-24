import { getFrontendBuildInfo, getSentryRelease } from "../release/buildInfo";

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const sentryEnvironment = getFrontendBuildInfo().release.environment;

export const tracesSampleRate =
  process.env.NODE_ENV === "development" ? 1.0 : 0.1;

export const sentryRelease = getSentryRelease();
