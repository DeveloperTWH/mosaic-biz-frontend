import * as Sentry from "@sentry/nextjs";
import {
  sentryDsn,
  sentryEnvironment,
  sentryRelease,
  tracesSampleRate,
} from "./lib/sentry/config";

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnvironment,
    release: sentryRelease,
    tracesSampleRate,
    sendDefaultPii: false,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
