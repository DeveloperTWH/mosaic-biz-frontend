export const logoutUser = async (): Promise<boolean> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/logout`,
      {
        method: "POST",
        credentials: "include", // ✅ Important for cookies/session
      }
    );

    if (res.ok) {
      // ✅ Clear local storage
      localStorage.removeItem("user_session");
      localStorage.removeItem("user_gender");

      // ✅ Redirect to home
      window.location.href = "/";
      return true;
    } else {
      console.error("Logout failed");
      return false;
    }
  } catch (err) {
    console.error("Logout error", err);
    return false;
  }
};
