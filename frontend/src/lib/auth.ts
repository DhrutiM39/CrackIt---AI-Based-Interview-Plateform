import { supabase } from "./supabaseClient";

const ACCESS_TOKEN_KEY = "crackit.access_token";
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function storeAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function getAccessToken() {
  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (storedToken) return storedToken;

  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function loginWithPassword(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success || !payload.access_token) {
    throw new Error(payload?.message ?? payload?.detail ?? "Login failed. Please try again.");
  }

  storeAccessToken(payload.access_token);
  return payload;
}
