import * as Sentry from "@sentry/nextjs";
import { ApiError } from "@/lib/api/client";

/** Report API failures to Sentry with marketplace context */
export function reportApiError(err: unknown, context: Record<string, string> = {}) {
  if (typeof window === "undefined" && !process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.withScope((scope) => {
    Object.entries(context).forEach(([k, v]) => scope.setTag(k, v));
    if (err instanceof ApiError) {
      scope.setLevel("warning");
      if (err.status) scope.setTag("http.status", String(err.status));
    }
    Sentry.captureException(err);
  });
}
