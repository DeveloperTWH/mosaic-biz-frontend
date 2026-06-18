type AuthErrorPayload = {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]> | string[] | string;
};

function firstValidationMessage(
  errors: AuthErrorPayload["errors"]
): string | undefined {
  if (!errors) return undefined;

  if (typeof errors === "string") return errors;

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

function statusFallback(status: number): string {
  if (status === 400) return "Invalid request. Please check your details and try again.";
  if (status === 401) return "Authentication failed. Please sign in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 409) return "An account with this email may already exist.";
  if (status >= 500) return "Server error. Please try again shortly.";
  return "Request failed. Please try again.";
}

export function getAuthErrorMessage(
  res: Response,
  data: AuthErrorPayload | null,
  fallback = "Something went wrong. Please try again."
): string {
  if (data?.message?.trim()) return data.message.trim();
  if (data?.error?.trim()) return data.error.trim();

  const validationMessage = firstValidationMessage(data?.errors);
  if (validationMessage) return validationMessage;

  if (!res.ok) return statusFallback(res.status);
  if (data?.success === false) return fallback;

  return fallback;
}

export async function parseAuthErrorResponse(
  res: Response,
  fallback = "Something went wrong. Please try again."
): Promise<string> {
  let data: AuthErrorPayload | null = null;

  try {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      data = (await res.json()) as AuthErrorPayload;
    }
  } catch {
    return res.ok ? fallback : statusFallback(res.status);
  }

  return getAuthErrorMessage(res, data, fallback);
}

export async function parseAuthJsonResponse<T>(
  res: Response
): Promise<{ data: T | null; errorMessage: string | null }> {
  let data: T | null = null;

  try {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      data = (await res.json()) as T;
    }
  } catch {
    return {
      data: null,
      errorMessage: res.ok ? "Request failed" : statusFallback(res.status),
    };
  }

  const payload = data as AuthErrorPayload | null;
  const isSuccess = res.ok && payload?.success !== false;

  if (isSuccess) {
    return { data, errorMessage: null };
  }

  return {
    data,
    errorMessage: getAuthErrorMessage(res, payload, "Request failed"),
  };
}
