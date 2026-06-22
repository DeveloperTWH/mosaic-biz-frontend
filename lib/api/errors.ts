export type ApiErrorKind =
  | "unauthenticated"
  | "forbidden"
  | "notFound"
  | "validation"
  | "paymentPending"
  | "rateLimited"
  | "serverError"
  | "network"
  | "timeout"
  | "malformed";

export type ApiFieldErrors = Record<string, string | string[]>;

export type ApiErrorPayload = {
  success?: boolean;
  message?: string;
  error?: string;
  code?: string;
  requestId?: string;
  fieldErrors?: ApiFieldErrors;
  errors?: ApiFieldErrors | string[] | string;
};

export class ApiClientError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly fieldErrors?: ApiFieldErrors;
  readonly payload?: ApiErrorPayload | null;
  readonly isJson: boolean;

  constructor(options: {
    kind: ApiErrorKind;
    message: string;
    status?: number;
    code?: string;
    requestId?: string;
    fieldErrors?: ApiFieldErrors;
    payload?: ApiErrorPayload | null;
    isJson?: boolean;
    cause?: unknown;
  }) {
    super(options.message, options.cause ? { cause: options.cause } : undefined);
    this.name = "ApiClientError";
    this.kind = options.kind;
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.fieldErrors = options.fieldErrors;
    this.payload = options.payload;
    this.isJson = options.isJson ?? true;
  }
}

export function mapStatusToErrorKind(status: number): ApiErrorKind {
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "notFound";
  if (status === 402) return "paymentPending";
  if (status === 429) return "rateLimited";
  if (status === 400 || status === 422) return "validation";
  if (status >= 500) return "serverError";
  return "validation";
}

export function getUserSafeMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    if (error.message.trim()) return error.message;
    switch (error.kind) {
      case "unauthenticated":
        return "Your session expired. Please sign in again.";
      case "forbidden":
        return "You do not have permission to perform this action.";
      case "notFound":
        return "The requested resource was not found.";
      case "paymentPending":
        return "Payment confirmation is still pending. Please retry shortly.";
      case "rateLimited":
        return "Too many requests. Please wait and try again.";
      case "validation":
        return fallback;
      case "serverError":
        return "A server error occurred. Please try again later.";
      case "network":
        return "Network error. Check your connection and try again.";
      case "timeout":
        return "The request timed out. Please try again.";
      case "malformed":
        return fallback;
      default:
        return fallback;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
