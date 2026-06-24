export const DEFAULT_APP_ORIGIN = "https://mosaicbizhub.com";
export const API_ORIGIN = "https://api.mosaicbizhub.com";
export const LEGACY_APP_ORIGIN = "https://app.mosaicbizhub.com";
export const LAUNCH_QA_ORIGIN = "https://mosaic-biz-frontend-launch.vercel.app";
export const WWW_ORIGIN = "https://www.mosaicbizhub.com";

const HTTP_URL_PATTERN = /^https?:\/\//i;
const CONFIGURED_ORIGIN_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLIENT_BASE_URL",
] as const;
const APPROVED_FRONTEND_ORIGINS = new Set([
  DEFAULT_APP_ORIGIN,
  LEGACY_APP_ORIGIN,
  LAUNCH_QA_ORIGIN,
]);
const DISALLOWED_FRONTEND_ORIGINS = new Set([API_ORIGIN, WWW_ORIGIN]);
const DEV_FRONTEND_HOST_PATTERN = /^(localhost|127\.0\.0\.1)(:\d+)?$/i;

function parseUrl(value?: string | null): URL | null {
  if (!value) return null;

  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
}

function toOrigin(url: URL): string {
  return url.origin.replace(/\/$/, "");
}

function isAllowedFrontendOrigin(url: URL): boolean {
  const origin = toOrigin(url);
  if (DISALLOWED_FRONTEND_ORIGINS.has(origin)) return false;
  return APPROVED_FRONTEND_ORIGINS.has(origin) || DEV_FRONTEND_HOST_PATTERN.test(url.host);
}

export function normalizeAppOrigin(value?: string | null): string {
  const parsed = parseUrl(value);
  if (parsed && isAllowedFrontendOrigin(parsed)) return toOrigin(parsed);
  return DEFAULT_APP_ORIGIN;
}

export function getConfiguredAppOrigin(): string {
  for (const key of CONFIGURED_ORIGIN_KEYS) {
    const parsed = parseUrl(process.env[key]);
    if (parsed && isAllowedFrontendOrigin(parsed)) {
      return toOrigin(parsed);
    }
  }

  return DEFAULT_APP_ORIGIN;
}

export function getRuntimeAppOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return normalizeAppOrigin(window.location.origin);
  }

  return getConfiguredAppOrigin();
}

export function buildAppUrl(pathOrUrl: string, origin = getRuntimeAppOrigin()): string {
  const normalizedOrigin = normalizeAppOrigin(origin);
  const rawPath = pathOrUrl.trim() || "/";

  if (HTTP_URL_PATTERN.test(rawPath)) {
    const parsed = parseUrl(rawPath);
    if (!parsed) return new URL("/", `${normalizedOrigin}/`).toString();
    if (!isAllowedFrontendOrigin(parsed)) {
      return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, `${normalizedOrigin}/`).toString();
    }
    return parsed.toString();
  }

  return new URL(rawPath, `${normalizedOrigin}/`).toString();
}
