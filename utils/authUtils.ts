export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/check`, {
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
};

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
  gender?: string;
}

export const isBusinessOwner = (user: AuthenticatedUser | null | undefined): boolean =>
  user?.role === 'business_owner';

export const isCustomer = (user: AuthenticatedUser | null | undefined): boolean =>
  user?.role === 'customer';

export type CheckoutAccessDenied =
  | { kind: 'redirect_login' }
  | { kind: 'toast'; message: string }
  | { kind: 'redirect'; path: string; message?: string };

export type CheckoutAccessResult =
  | { allowed: true; user: AuthenticatedUser }
  | { allowed: false; denial: CheckoutAccessDenied };

export async function resolveCheckoutAccess(): Promise<CheckoutAccessResult> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { allowed: false, denial: { kind: 'redirect_login' } };
  }

  if (isCustomer(user)) {
    return { allowed: true, user };
  }

  if (user.role === 'business_owner') {
    return {
      allowed: false,
      denial: {
        kind: 'toast',
        message:
          'Checkout requires a customer account. Please switch to a customer account to place an order.',
      },
    };
  }

  if (user.role === 'admin') {
    return {
      allowed: false,
      denial: {
        kind: 'redirect',
        path: '/admin',
        message: 'Checkout is for customer accounts only.',
      },
    };
  }

  return {
    allowed: false,
    denial: {
      kind: 'toast',
      message: 'Checkout is unavailable for this account type.',
    },
  };
}

export const clearStaleClientSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user_session');
  localStorage.removeItem('user_gender');
  localStorage.removeItem('user_role');
  window.dispatchEvent(new Event('auth:logout'));
};

export const persistClientSession = (user: AuthenticatedUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user_session', 'true');
  localStorage.setItem('user_gender', user.gender || '');
  localStorage.setItem('user_role', user.role || '');
  window.dispatchEvent(new Event('auth:login'));
};

export const getAuthenticatedUser = async (): Promise<AuthenticatedUser | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/check`, {
      credentials: 'include',
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data?.user?.id && data?.user?.role) {
      return data.user as AuthenticatedUser;
    }

    return null;
  } catch {
    return null;
  }
};

export const getLoggedInCustomer = async (): Promise<AuthenticatedUser | null> => {
  const user = await getAuthenticatedUser();
  if (user?.role === 'customer') {
    return user;
  }
  return null;
};
