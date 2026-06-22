import { logoutSession } from "@/lib/api/authSession";

const clearBrowserCookies = () => {
  if (typeof document === "undefined") return;

  const hostname = window.location.hostname;
  const hostParts = hostname.split(".").filter(Boolean);
  const candidateDomains = new Set<string>([""]);

  for (let i = 0; i < hostParts.length; i++) {
    candidateDomains.add(`.${hostParts.slice(i).join(".")}`);
  }

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const name = cookie.split("=")[0]?.trim();
    if (!name) continue;

    for (const domain of candidateDomains) {
      const domainAttr = domain ? `;domain=${domain}` : "";
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}`;
    }
  }
};

export const logoutUser = async (): Promise<boolean> => {
  const result = await logoutSession();

  if (result.ok) {
    clearBrowserCookies();
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_gender");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("token");
    sessionStorage.removeItem("cart_sync_checked");
    window.dispatchEvent(new Event("auth:logout"));

    window.location.href = "/";
    return true;
  }

  console.error("Logout failed", result.error);
  return false;
};
