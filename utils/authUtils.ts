import { checkAuthSession, isSessionActive } from "@/lib/api/authSession";

export const isUserLoggedIn = isSessionActive;

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
  gender?: string;
}

export const isBusinessOwner = (user: AuthenticatedUser | null | undefined): boolean =>
  user?.role === "business_owner";

export const isCustomer = (user: AuthenticatedUser | null | undefined): boolean =>
  user?.role === "customer";

export const isAdmin = (user: AuthenticatedUser | null | undefined): boolean =>
  user?.role === "admin";

export function getPostLoginRedirectPath(
  user: AuthenticatedUser,
  safeRedirect?: string | null
): string {
  if (isAdmin(user)) return safeRedirect || "/admin";
  if (isBusinessOwner(user)) return "/partners";
  return safeRedirect || "/";
}

export type CheckoutAccessDenied =
  | { kind: "redirect_login" }
  | { kind: "toast"; message: string }
  | { kind: "redirect"; path: string; message?: string };

export type CheckoutAccessResult =
  | { allowed: true; user: AuthenticatedUser }
  | { allowed: false; denial: CheckoutAccessDenied };

export async function resolveCheckoutAccess(): Promise<CheckoutAccessResult> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { allowed: false, denial: { kind: "redirect_login" } };
  }

  if (isCustomer(user)) {
    return { allowed: true, user };
  }

  if (isBusinessOwner(user)) {
    return {
      allowed: false,
      denial: {
        kind: "toast",
        message:
          "Checkout requires a customer account. Please switch to a customer account to place an order.",
      },
    };
  }

  if (isAdmin(user)) {
    return {
      allowed: false,
      denial: {
        kind: "redirect",
        path: "/admin",
        message: "Checkout is for customer accounts only.",
      },
    };
  }

  return {
    allowed: false,
    denial: {
      kind: "toast",
      message: "Checkout is unavailable for this account type.",
    },
  };
}

export const clearStaleClientSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user_session");
  localStorage.removeItem("user_gender");
  localStorage.removeItem("user_role");
  window.dispatchEvent(new Event("auth:logout"));
};

export const persistClientSession = (user: AuthenticatedUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_session", "true");
  localStorage.setItem("user_gender", user.gender || "");
  localStorage.setItem("user_role", user.role || "");
  window.dispatchEvent(new Event("auth:login"));
};

export const getAuthenticatedUser = async (): Promise<AuthenticatedUser | null> => {
  const user = await checkAuthSession();
  return user ?? null;
};

export const getLoggedInCustomer = async (): Promise<AuthenticatedUser | null> => {
  const user = await getAuthenticatedUser();
  if (user?.role === "customer") {
    return user;
  }
  return null;
};
