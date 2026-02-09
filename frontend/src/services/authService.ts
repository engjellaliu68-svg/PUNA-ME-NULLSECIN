import { apiFetch, refreshSession, setAccessToken } from "./api";

export function login(email: string, password: string) {
  return apiFetch<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true
  }).then((data) => {
    setAccessToken(data.accessToken);
    return data;
  });
}

export function register(payload: {
  email: string;
  password: string;
  profileType: "INDIVIDUAL" | "BUSINESS";
  displayName: string;
  companyName?: string;
}) {
  return apiFetch<{ accessToken: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true
  }).then((data) => {
    setAccessToken(data.accessToken);
    return data;
  });
}

export async function refreshAccessToken() {
  return refreshSession();
}

export async function logout() {
  await apiFetch("/auth/logout", {
    method: "POST",
    skipAuth: true
  });
  setAccessToken(null);
}
