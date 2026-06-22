import {
  ApiClientError,
  mapStatusToErrorKind,
  type ApiErrorPayload,
} from "./errors";
import { getBackendMessage, normalizeFieldErrors, parseApiResponse } from "./parseResponse";

const DEFAULT_TIMEOUT_MS = 30_000;

export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  return baseUrl.replace(/\/$/, "");
}

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  timeoutMs?: number;
  signal?: AbortSignal;
  /** Attach Authorization bearer from localStorage when present. */
  bearer?: boolean;
  /** Return null instead of throwing on HTTP 404. */
  notFoundReturnsNull?: boolean;
};

function buildHeaders(options: ApiRequestOptions): Record<string, string> {
  const headers: Record<string, string> = {
    ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };

  if (options.bearer && typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export function createApiClientError(
  status: number,
  parsed: Awaited<ReturnType<typeof parseApiResponse>>,
  fallbackMessage: string
): ApiClientError {
  const payload = parsed.payload;
  const message =
    getBackendMessage(payload) ||
    (parsed.isJson ? fallbackMessage : `Request failed (${status})`) ||
    fallbackMessage;

  return new ApiClientError({
    kind: mapStatusToErrorKind(status),
    message,
    status,
    code: payload?.code,
    requestId: payload?.requestId,
    fieldErrors: normalizeFieldErrors(payload),
    payload,
    isJson: parsed.isJson,
  });
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T | null> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const signal = options.signal ?? controller.signal;

  try {
    const res = await fetch(buildApiUrl(path), {
      method: options.method ?? (options.body !== undefined ? "POST" : "GET"),
      credentials: options.credentials ?? "include",
      headers: buildHeaders(options),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal,
    });

    const parsed = await parseApiResponse<T>(res);

    if (options.notFoundReturnsNull && res.status === 404) {
      return null;
    }

    if (!parsed.ok || parsed.payload?.success === false) {
      throw createApiClientError(res.status, parsed, `Request failed (${res.status})`);
    }

    return (parsed.data as T | null) ?? null;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError({
        kind: "timeout",
        message: "Request timed out",
        cause: error,
        isJson: false,
      });
    }

    throw new ApiClientError({
      kind: "network",
      message: error instanceof Error ? error.message : "Network request failed",
      cause: error,
      isJson: false,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiRequestEnvelope<TData>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<({ success?: boolean; message?: string; data?: TData } & import("./errors").ApiErrorPayload) | null> {
  const result = await apiRequest<
    { success?: boolean; message?: string; data?: TData } & import("./errors").ApiErrorPayload
  >(path, options);

  return result;
}
