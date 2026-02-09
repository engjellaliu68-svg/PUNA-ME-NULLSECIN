const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined)
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pj_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers,
      ...options
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error: unable to reach API at ${API_URL}`);
    }
    throw error;
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: `Request failed (${response.status})` }));
    throw new Error(error.message || `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}
