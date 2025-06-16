import { jwtDecode } from "jwt-decode";


export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getUserFromToken(): { userId: string; role: string } | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login?type=customer'; // or vendor/admin
}
