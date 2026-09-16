import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { type MeResponse, authApi } from "../lib/api";
import {
  clearAuth,
  getToken,
  getUser,
  setToken,
  setUser,
  type StoredUser,
} from "../lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthUser extends StoredUser {
  target_job_role?: string;
  experience_level?: string;
  streak_count?: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Try to restore from localStorage immediately for fast UX
    const cached = getUser();
    if (cached) setUserState(cached);

    // Then validate token by calling /auth/me
    authApi
      .me()
      .then((me: MeResponse) => {
        const fullUser: AuthUser = {
          id: me.id,
          full_name: me.full_name,
          email: me.email,
          target_job_role: me.target_job_role,
          experience_level: me.experience_level,
          streak_count: me.streak_count,
        };
        setUserState(fullUser);
        setUser({ id: me.id, full_name: me.full_name, email: me.email });
      })
      .catch(() => {
        // Token invalid or expired
        clearAuth();
        setUserState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.access_token);
    const u: AuthUser = res.user;
    setUser(res.user);
    setUserState(u);
  }, []);

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (fullName: string, email: string, password: string) => {
      const res = await authApi.signup(fullName, email, password);
      setToken(res.access_token);
      const u: AuthUser = res.user;
      setUser(res.user);
      setUserState(u);
    },
    []
  );

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
