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


// /utils/auth.ts

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
}

export const getLoggedInCustomer = async (): Promise<AuthenticatedUser | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/check`, {
      credentials: 'include',
    });

    if (!res.ok) return null;

    const data = await res.json();

    console.log(data.user.role);
    

    if (data?.user?.role === 'customer') {
      return data.user;
    }

    return null;
  } catch {
    return null;
  }
};

