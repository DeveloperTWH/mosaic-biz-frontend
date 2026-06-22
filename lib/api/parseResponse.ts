import type { ApiErrorPayload, ApiFieldErrors } from "./errors";

export type ParsedApiResponse<T> = {
  status: number;
  ok: boolean;
  isJson: boolean;
  data: T | null;
  payload: ApiErrorPayload | null;
  rawText?: string;
};

function firstValidationMessage(
  errors: ApiErrorPayload["errors"]
): string | undefined {
  if (!errors) return undefined;
  if (typeof errors === "string") return errors.trim() || undefined;
  if (Array.isArray(errors)) {
    const first = errors.find((entry) => typeof entry === "string" && entry.trim());
    return first?.trim();
  }
  for (const value of Object.values(errors)) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      const first = value.find((entry) => typeof entry === "string" && entry.trim());
      if (first) return first.trim();
    }
  }
  return undefined;
}

export function normalizeFieldErrors(payload: ApiErrorPayload | null): ApiFieldErrors | undefined {
  if (!payload) return undefined;
  if (payload.fieldErrors && typeof payload.fieldErrors === "object") {
    return payload.fieldErrors;
  }
  if (payload.errors && typeof payload.errors === "object" && !Array.isArray(payload.errors)) {
    return payload.errors as ApiFieldErrors;
  }
  return undefined;
}

export function getBackendMessage(payload: ApiErrorPayload | null): string | undefined {
  if (!payload) return undefined;
  if (payload.message?.trim()) return payload.message.trim();
  if (payload.error?.trim()) return payload.error.trim();
  return firstValidationMessage(payload.errors);
}

export async function parseApiResponse<T>(res: Response): Promise<ParsedApiResponse<T>> {
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {
      status: res.status,
      ok: res.ok,
      isJson: false,
      data: null,
      payload: null,
    };
  }

  if (!isJson) {
    const rawText = await res.text().catch(() => "");
    return {
      status: res.status,
      ok: res.ok,
      isJson: false,
      data: null,
      payload: rawText ? { message: rawText.slice(0, 500) } : null,
      rawText,
    };
  }

  try {
    const payload = (await res.json()) as T & ApiErrorPayload;
    return {
      status: res.status,
      ok: res.ok,
      isJson: true,
      data: payload as T,
      payload: payload as ApiErrorPayload,
    };
  } catch {
    return {
      status: res.status,
      ok: res.ok,
      isJson: false,
      data: null,
      payload: null,
    };
  }
}
