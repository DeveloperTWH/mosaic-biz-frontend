import { ApiClientError } from "./errors";
import { parseApiResponse } from "./parseResponse";
import { buildApiUrl, createApiClientError } from "./httpClient";

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
  gender?: string;
};

export type AuthCheckResponse = {
  success?: boolean;
  user?: AuthSessionUser;
  data?: {
    user?: AuthSessionUser;
  };
};

export type AuthenticatedSessionUser = AuthSessionUser;

export type AuthSessionCheckResult =
  | {
      kind: "authenticated";
      status: number;
      user: AuthenticatedSessionUser;
    }
  | {
      kind: "unauthenticated";
      status: 401;
    }
  | {
      kind: "error";
      status?: number;
      error: ApiClientError;
    };

export type PostLoginSessionResult =
  | { kind: "authenticated"; user: AuthenticatedSessionUser }
  | { kind: "unauthenticated" }
  | { kind: "error"; error: ApiClientError };

type RawAuthUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  mobile?: string;
  gender?: string;
};

const POST_LOGIN_RETRY_DELAYS_MS = [0, 100, 300] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeAuthUser(
  raw: RawAuthUser | null | undefined
): AuthSessionUser | null {
  if (!raw?.role) {
    return null;
  }

  const id = raw.id ?? raw._id;
  if (!id) {
    return null;
  }

  return {
    id: String(id),
    name: raw.name ?? "",
    email: raw.email ?? "",
    role: raw.role,
    mobile: raw.mobile ?? "",
    gender: raw.gender,
  };
}

export function extractAuthUserFromPayload(payload: unknown): AuthSessionUser | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload as Record<string, unknown>;
  const directUser = normalizeAuthUser(root.user as RawAuthUser | undefined);
  if (directUser) {
    return directUser;
  }

  const data = root.data;
  if (data && typeof data === "object") {
    const nestedUser = normalizeAuthUser(
      (data as Record<string, unknown>).user as RawAuthUser | undefined
    );
    if (nestedUser) {
      return nestedUser;
    }
  }

  return normalizeAuthUser(root as RawAuthUser);
}

function isImmediatePostLoginError(error: ApiClientError): boolean {
  return (
    error.kind === "network" ||
    error.kind === "timeout" ||
    error.kind === "malformed" ||
    error.kind === "serverError" ||
    error.kind === "forbidden" ||
    error.kind === "validation"
  );
}

/**
 * Cookie-session auth check with explicit failure classification.
 */
export async function checkAuthSessionResult(): Promise<AuthSessionCheckResult> {
  try {
    const res = await fetch(buildApiUrl("/api/users/auth/check"), {
      credentials: "include",
    });

    if (res.status === 401) {
      return { kind: "unauthenticated", status: 401 };
    }

    const parsed = await parseApiResponse<AuthCheckResponse>(res);
    if (!parsed.ok) {
      return {
        kind: "error",
        status: res.status,
        error: createApiClientError(
          res.status,
          parsed,
          "Unable to verify the authenticated session"
        ),
      };
    }

    const user = extractAuthUserFromPayload(parsed.data ?? parsed.payload);
    if (user) {
      return {
        kind: "authenticated",
        status: res.status,
        user,
      };
    }

    return {
      kind: "error",
      status: res.status,
      error: new ApiClientError({
        kind: "malformed",
        message: "The session verification response was invalid.",
        status: res.status,
        payload: parsed.payload,
        isJson: parsed.isJson,
      }),
    };
  } catch (error) {
    const isMissingApiConfiguration =
      error instanceof Error &&
      error.message.includes("NEXT_PUBLIC_API_BASE_URL is not configured");

    return {
      kind: "error",
      error:
        error instanceof ApiClientError
          ? error
          : new ApiClientError({
              kind: isMissingApiConfiguration ? "malformed" : "network",
              message: isMissingApiConfiguration
                ? "The authentication API is not configured."
                : "Unable to reach the session verification service.",
              cause: error,
              isJson: false,
            }),
    };
  }
}

export async function confirmPostLoginSession(
  options: { retryDelaysMs?: readonly number[] } = {}
): Promise<PostLoginSessionResult> {
  const delays = options.retryDelaysMs ?? POST_LOGIN_RETRY_DELAYS_MS;

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) {
      await sleep(delays[attempt]);
    }

    const result = await checkAuthSessionResult();

    if (result.kind === "authenticated") {
      return { kind: "authenticated", user: result.user };
    }

    if (result.kind === "error") {
      if (isImmediatePostLoginError(result.error)) {
        return { kind: "error", error: result.error };
      }
    }
  }

  return { kind: "unauthenticated" };
}

/**
 * Backward-compatible cookie-session auth check.
 * Returns null for unauthenticated and non-success outcomes.
 */
export async function checkAuthSession(): Promise<AuthSessionUser | null> {
  const result = await checkAuthSessionResult();
  return result.kind === "authenticated" ? result.user : null;
}

export async function isSessionActive(): Promise<boolean> {
  const user = await checkAuthSession();
  return Boolean(user);
}

export type LogoutResult = { ok: true } | { ok: false; error?: ApiClientError | Error };

export async function logoutSession(): Promise<LogoutResult> {
  try {
    const res = await fetch(buildApiUrl("/api/users/logout"), {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const parsed = await parseApiResponse(res);
      return {
        ok: false,
        error: new ApiClientError({
          kind: res.status === 401 ? "unauthenticated" : "validation",
          message: parsed.payload?.message || "Logout failed",
          status: res.status,
          payload: parsed.payload,
          isJson: parsed.isJson,
        }),
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Logout failed"),
    };
  }
}
