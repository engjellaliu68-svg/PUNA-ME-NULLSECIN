const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_API_URL");
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken() {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) {
    setAccessToken(null);
    return null;
  }

  const data = (await response.json()) as { accessToken?: string };
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
    return data.accessToken;
  }

  setAccessToken(null);
  return null;
}

type ApiFetchOptions = RequestInit & {
  skipAuth?: boolean;
  retryOnUnauthorized?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { skipAuth, retryOnUnauthorized = true, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined)
  };

  if (!skipAuth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers,
      credentials: "include",
      ...fetchOptions
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error: unable to reach API at ${API_URL}`);
    }
    throw error;
  }

  if (response.status === 401 && !skipAuth && retryOnUnauthorized) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, retryOnUnauthorized: false });
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: `Request failed (${response.status})` }));
    throw new Error(error.message || `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function refreshSession() {
  return refreshAccessToken();
}
