import { useState } from "react";
import { API } from "../App";

export default function Auth({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const login = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res  = await fetch(`${API}/login/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.access) {
        localStorage.setItem("token",    data.access);
        localStorage.setItem("refresh",  data.refresh);
        localStorage.setItem("username", username);
        setIsLoggedIn(true);
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Unable to reach server. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left — branding */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-brand-mark">⚕️</div>
            <span className="auth-brand-name">RajMediPanel</span>
          </div>

          <h1 className="auth-heading">
            Healthcare,<br />
            <em>simplified.</em>
          </h1>
          <p className="auth-tagline">
            Book appointments with top specialists, manage your health records,
            and stay on top of your wellness — all in one place.
          </p>

          <div className="auth-features">
            {[
              { icon: "🔒", text: "Secure, encrypted patient records" },
              { icon: "📅", text: "Instant slot booking with any doctor" },
              { icon: "📱", text: "Access anywhere, on any device" },
              { icon: "⚡", text: "Real-time appointment updates" },
            ].map((f) => (
              <div className="auth-feature" key={f.text}>
                <div className="auth-feature-icon">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="auth-right">
        <div className="auth-card animate-fade-in">
          <div className="auth-card-header">
            <div className="auth-card-title">Welcome back 👋</div>
            <div className="auth-card-subtitle">
              Sign in to your patient account to continue.
            </div>
          </div>

          <form onSubmit={login}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,.12)",
                  border: "1px solid rgba(239,68,68,.25)",
                  borderRadius: "var(--r-md)",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "#f87171",
                  marginBottom: "12px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-switch">
            Don't have an account?{" "}
            <span onClick={() => alert("Register flow — connect your API")}>
              Create one
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}