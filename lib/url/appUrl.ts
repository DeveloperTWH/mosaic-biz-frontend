export const DEFAULT_APP_ORIGIN = "https://app.mosaicbizhub.com";

const HTTP_URL_PATTERN = /^https?:\/\//i;
const CONFIGURED_ORIGIN_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLIENT_BASE_URL",
] as const;

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

export function normalizeAppOrigin(value?: string | null): string {
  const parsed = parseUrl(value) ?? new URL(DEFAULT_APP_ORIGIN);
  return toOrigin(parsed);
}

export function getConfiguredAppOrigin(): string {
  for (const key of CONFIGURED_ORIGIN_KEYS) {
    const parsed = parseUrl(process.env[key]);
    if (parsed) {
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
    return parsed.toString();
  }

  return new URL(rawPath, `${normalizedOrigin}/`).toString();
}
