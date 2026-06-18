const SENSITIVE_KEYS = new Set([
  "password",
  "confirmPassword",
  "token",
  "auth_token",
  "otp",
  "authorization",
  "cookie",
  "secret",
  "accessToken",
  "refreshToken",
]);

function isAuthDebugEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_AUTH_DEBUG === "true"
  );
}

function sanitizeValue(key: string, value: unknown): unknown {
  if (SENSITIVE_KEYS.has(key.toLowerCase())) {
    return "[REDACTED]";
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "object" && item !== null
        ? sanitizeObject(item as Record<string, unknown>)
        : item
    );
  }

  if (typeof value === "object" && value !== null) {
    return sanitizeObject(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeObject(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeValue(key, value);
  }

  return sanitized;
}

export type AuthDebugMeta = {
  endpoint: string;
  method: string;
  status: number;
  credentialsIncluded: boolean;
  body?: unknown;
};

export function logAuthRequest(meta: AuthDebugMeta): void {
  if (!isAuthDebugEnabled()) return;

  const payload = {
    endpoint: meta.endpoint,
    method: meta.method,
    status: meta.status,
    credentialsIncluded: meta.credentialsIncluded,
    ...(meta.body !== undefined
      ? { body: sanitizeObject(meta.body as Record<string, unknown>) }
      : {}),
  };

  console.info("[auth-debug]", payload);
}
