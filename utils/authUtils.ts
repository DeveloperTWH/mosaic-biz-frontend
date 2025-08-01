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
