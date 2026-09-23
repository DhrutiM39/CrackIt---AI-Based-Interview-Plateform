import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Brain, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../AuthContext";

// ─── Design tokens (mirror App.tsx) ──────────────────────────────────────────
const C = {
  bg:         "#0D1724",
  card:       "#132131",
  surface:    "#172A3C",
  border:     "#2A3D52",
  muted:      "#9EACBA",
  text:       "#EDF2F4",
  purple:     "#6D9995",
  cyan:       "#7E9BB5",
  green:      "#9BAF9C",
  red:        "#C96B68",
  grad:       "linear-gradient(135deg, #31536D 0%, #477773 100%)",
};

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a letter",     test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: "Contains a number",     test: (p: string) => /\d/.test(p) },
];

interface SignupPageProps {
  onGoLogin: () => void;
}

export default function SignupPage({ onGoLogin }: SignupPageProps) {
  const { signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const pwdFocused = password.length > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(fullName.trim(), email, password);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: C.bg, fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(95,139,137,.08), transparent 48%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: C.grad, boxShadow: "0 8px 24px rgba(3,12,22,.28)" }}
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
            Create your account
          </h1>
          <p className="text-sm mb-7" style={{ color: C.muted }}>
            Start your AI-powered interview prep journey today
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
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-name"
                className="text-sm font-medium"
                style={{ color: C.text }}
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dhruti Movaliya"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => (e.target.style.border = `1px solid ${C.purple}`)}
                onBlur={(e)  => (e.target.style.border = `1px solid ${C.border}`)}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-email"
                className="text-sm font-medium"
                style={{ color: C.text }}
              >
                Email
              </label>
              <input
                id="signup-email"
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
                onFocus={(e) => (e.target.style.border = `1px solid ${C.purple}`)}
                onBlur={(e)  => (e.target.style.border = `1px solid ${C.border}`)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-password"
                className="text-sm font-medium"
                style={{ color: C.text }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
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
                  onFocus={(e) => (e.target.style.border = `1px solid ${C.purple}`)}
                  onBlur={(e)  => (e.target.style.border = `1px solid ${C.border}`)}
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

              {/* Password strength indicators */}
              {pwdFocused && (
                <div className="flex flex-col gap-1 mt-1">
                  {passwordRules.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: ok ? C.green : C.muted }}
                      >
                        <CheckCircle2 size={12} />
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-1"
              style={{
                background: loading ? C.surface : C.grad,
                boxShadow: loading ? "none" : "0 8px 20px rgba(3,12,22,.24)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            className="flex items-center gap-3 my-6"
            style={{ color: C.muted }}
          >
            <div className="flex-1 h-px" style={{ background: C.border }} />
            <span className="text-xs">Already have an account?</span>
            <div className="flex-1 h-px" style={{ background: C.border }} />
          </div>

          <button
            id="goto-login"
            onClick={onGoLogin}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.purple,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.purple)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            Sign in instead
          </button>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: C.muted }}>
          AI-Based Interview Preparation · CHARUSAT Semester 5
        </p>
      </div>
    </div>
  );
}
