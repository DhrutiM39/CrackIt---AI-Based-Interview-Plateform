// ─── Token & User helpers (in-memory only) ────────────────────────────────────
// Do not persist auth tokens or user data in localStorage or sessionStorage.
// Browser storage is readable by XSS payloads and browser extensions.

let memoryToken: string | null = null;
let memoryUser: StoredUser | null = null;

export function getToken(): string | null {
  return memoryToken;
}

export function setToken(token: string): void {
  memoryToken = token;
}

export function clearToken(): void {
  memoryToken = null;
}

export interface StoredUser {
  id: string;
  full_name: string;
  email: string;
}

export function getUser(): StoredUser | null {
  return memoryUser;
}

export function setUser(user: StoredUser): void {
  memoryUser = user;
}

export function clearUser(): void {
  memoryUser = null;
}

export function clearAuth(): void {
  clearToken();
  clearUser();
}
