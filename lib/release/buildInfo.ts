export type FrontendReleaseInfo = {
  commit: string;
  environment: string;
  branch: string;
  deploymentId: string;
};

export type FrontendBuildInfo = {
  service: "mosaic-biz-frontend";
  release: FrontendReleaseInfo;
};

type EnvMap = Record<string, string | undefined>;

const SAFE_SHA_PATTERN = /^[a-f0-9]{7,40}$/i;
const SAFE_LABEL_PATTERN = /^[A-Za-z0-9._/-]{1,128}$/;
const FORBIDDEN_PUBLIC_FRAGMENTS = [
  "sk_live_",
  "sk_test_",
  "whsec_",
  "sentry_dsn",
  "mongodb",
  "password",
  "secret",
  "token",
];

function normalizeOptionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function firstDefined(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => normalizeOptionalString(value));
}

function sanitizeSha(value: string | undefined): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (!normalized || !SAFE_SHA_PATTERN.test(normalized)) return undefined;
  return normalized.toLowerCase();
}

function extractShaFromRelease(value: string | undefined): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return undefined;

  const mosaicMatch = normalized.match(/^mosaic-([a-f0-9]{7,40})$/i);
  return sanitizeSha(mosaicMatch?.[1] ?? normalized);
}

function sanitizeLabel(value: string | undefined, fallback: string): string {
  const normalized = normalizeOptionalString(value);
  if (!normalized || !SAFE_LABEL_PATTERN.test(normalized)) return fallback;
  return normalized;
}

export function getFrontendCommitSha(env: EnvMap = process.env): string {
  return (
    sanitizeSha(
      firstDefined(
        env.NEXT_PUBLIC_RELEASE_COMMIT_SHA,
        env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
        env.VERCEL_GIT_COMMIT_SHA
      )
    ) ??
    extractShaFromRelease(env.SENTRY_RELEASE) ??
    "unknown"
  );
}

export function getSentryRelease(env: EnvMap = process.env): string | undefined {
  const explicitRelease = sanitizeLabel(env.SENTRY_RELEASE, "");
  if (explicitRelease) return explicitRelease;

  const commit = getFrontendCommitSha(env);
  return commit === "unknown" ? undefined : commit;
}

export function getFrontendBuildInfo(env: EnvMap = process.env): FrontendBuildInfo {
  const commit = getFrontendCommitSha(env);

  return {
    service: "mosaic-biz-frontend",
    release: {
      commit: commit === "unknown" ? commit : commit.slice(0, 7),
      environment: sanitizeLabel(
        firstDefined(env.NEXT_PUBLIC_VERCEL_ENV, env.VERCEL_ENV, env.SENTRY_ENVIRONMENT, env.NODE_ENV),
        "development"
      ),
      branch: sanitizeLabel(
        firstDefined(env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF, env.VERCEL_GIT_COMMIT_REF),
        "unknown"
      ),
      deploymentId: sanitizeLabel(
        firstDefined(env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID, env.VERCEL_DEPLOYMENT_ID),
        "unknown"
      ),
    },
  };
}

export function isLikelySafePublicBuildInfo(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;

  const serialized = JSON.stringify(payload).toLowerCase();
  return !FORBIDDEN_PUBLIC_FRAGMENTS.some((fragment) => serialized.includes(fragment));
}
