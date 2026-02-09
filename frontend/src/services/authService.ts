import { apiFetch } from "./api";

export function login(email: string, password: string) {
  return apiFetch<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
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
    body: JSON.stringify(payload)
  });
}
