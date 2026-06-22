import { ApiClientError } from "./errors";
import { parseApiResponse } from "./parseResponse";
import { buildApiUrl } from "./httpClient";

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

/**
 * Cookie-session auth check. Returns null when unauthenticated — not an error.
 */
export async function checkAuthSession(): Promise<AuthCheckResponse["user"] | null> {
  try {
    const res = await fetch(buildApiUrl("/api/users/auth/check"), {
      credentials: "include",
    });

    if (res.status === 401) {
      return null;
    }

    const parsed = await parseApiResponse<AuthCheckResponse>(res);
    if (!parsed.ok) {
      return null;
    }

    const user =
      parsed.data?.user ??
      (parsed.payload as AuthCheckResponse | null)?.user;
    if (user?.id && user?.role) {
      return user;
    }

    return null;
  } catch {
    return null;
  }
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
