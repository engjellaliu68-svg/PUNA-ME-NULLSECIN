import { useEffect, useState } from "react";
import { getAccessToken, setAccessToken } from "@/services/api";
import { refreshAccessToken } from "@/services/authService";

export function useAuth() {
  const [token, setToken] = useState<string | null>(getAccessToken());

  useEffect(() => {
    let active = true;
    refreshAccessToken()
      .then((nextToken) => {
        if (!active) return;
        setAccessToken(nextToken ?? null);
        setToken(nextToken ?? null);
      })
      .catch(() => {
        if (!active) return;
        setAccessToken(null);
        setToken(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateToken = (value: string | null) => {
    setAccessToken(value);
    setToken(value);
  };

  return {
    token,
    setToken: updateToken,
    isAuthenticated: Boolean(token)
  };
}
