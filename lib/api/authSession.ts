import { ApiClientError } from "./errors";
import { parseApiResponse } from "./parseResponse";
import { buildApiUrl, createApiClientError } from "./httpClient";

export type AuthCheckResponse = {
  success?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    mobile: string;
    gender?: string;
  };
};

export type AuthenticatedSessionUser = NonNullable<AuthCheckResponse["user"]>;

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

/**
 * Cookie-session auth check with explicit failure classification.
 *
 * Use this result when the caller must distinguish an absent session from
 * network, CORS, server, or malformed-response failures.
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

    const user =
      parsed.data?.user ??
      (parsed.payload as AuthCheckResponse | null)?.user;

    if (user?.id && user?.role) {
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

/**
 * Backward-compatible cookie-session auth check.
 * Returns null for unauthenticated and non-success outcomes.
 */
export async function checkAuthSession(): Promise<AuthCheckResponse["user"] | null> {
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
