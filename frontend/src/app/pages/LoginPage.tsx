import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Brain, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../AuthContext";

// ─── Design tokens (mirror App.tsx) ──────────────────────────────────────────
const C = {
  bg:          "#0B1120",
  card:        "#111827",
  surface:     "#1F2937",
  border:      "#374151",
  muted:       "#9CA3AF",
  text:        "#F9FAFB",
  purple:      "#A855F7",
  cyan:        "#22D3EE",
  green:       "#34D399",
  red:         "#EF4444",
  grad:        "linear-gradient(135deg, #A855F7 0%, #22D3EE 100%)",
  gradSubtle:  "linear-gradient(135deg,rgba(168,85,247,.15) 0%,rgba(34,211,238,.1) 100%)",
};

interface LoginPageProps {
  onGoSignup: () => void;
}

export default function LoginPage({ onGoSignup }: LoginPageProps) {
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(168,85,247,.18) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: C.grad, boxShadow: "0 4px 20px rgba(168,85,247,.5)" }}
          >
            <Brain size={20} color="white" />
          </div>
          <span
            className="text-2xl font-black"
            style={{
              backgroundImage: C.grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CrackIt
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            boxShadow: "0 24px 80px rgba(0,0,0,.5)",
          }}
        >
          <h1
            className="text-2xl font-bold text-white mb-1"
            style={{ lineHeight: 1.3 }}
          >
            Welcome back 👋
          </h1>
          <p className="text-sm mb-7" style={{ color: C.muted }}>
            Sign in to continue your interview prep journey
          </p>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-3 rounded-xl p-3.5 mb-5 text-sm"
              style={{
                background: "rgba(239,68,68,.1)",
                border: "1px solid rgba(239,68,68,.3)",
                color: C.red,
              }}
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-sm font-medium"
                style={{ color: C.text }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) =>
                  (e.target.style.border = `1px solid ${C.purple}`)
                }
                onBlur={(e) =>
                  (e.target.style.border = `1px solid ${C.border}`)
                }
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-medium"
                style={{ color: C.text }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) =>
                    (e.target.style.border = `1px solid ${C.purple}`)
                  }
                  onBlur={(e) =>
                    (e.target.style.border = `1px solid ${C.border}`)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: C.muted }}
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: loading ? C.surface : C.grad,
                boxShadow: loading ? "none" : "0 4px 20px rgba(168,85,247,.4)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            className="flex items-center gap-3 my-6"
            style={{ color: C.muted }}
          >
            <div
              className="flex-1 h-px"
              style={{ background: C.border }}
            />
            <span className="text-xs">Don't have an account?</span>
            <div
              className="flex-1 h-px"
              style={{ background: C.border }}
            />
          </div>

          <button
            id="goto-signup"
            onClick={onGoSignup}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.purple,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = C.purple)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = C.border)
            }
          >
            Create an account
          </button>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: C.muted }}>
          AI-Based Interview Preparation · CHARUSAT Semester 5
        </p>
      </div>
    </div>
  );
}
