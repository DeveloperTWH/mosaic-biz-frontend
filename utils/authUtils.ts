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

export const isAdmin = (user: AuthenticatedUser | null | undefined): boolean =>
  user?.role === 'admin';

export function getPostLoginRedirectPath(
  user: AuthenticatedUser,
  safeRedirect?: string | null
): string {
  if (isAdmin(user)) return safeRedirect || '/admin';
  if (isBusinessOwner(user)) return '/partners';
  return safeRedirect || '/';
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
