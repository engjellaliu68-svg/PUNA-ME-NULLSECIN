import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pj_token");
    if (stored) {
      setToken(stored);
    }
  }, []);

  const updateToken = (value: string | null) => {
    setToken(value);
    if (value) {
      localStorage.setItem("pj_token", value);
    } else {
      localStorage.removeItem("pj_token");
    }
  };

  return {
    token,
    setToken: updateToken,
    isAuthenticated: Boolean(token)
  };
}
