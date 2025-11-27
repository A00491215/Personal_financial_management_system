import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useProfileContext } from "../../contexts/ProfileContext";
import { financeService } from "../../services/finance.service";
import "./Auth.scss";

const LoginPage: React.FC = () => {
  const { login, loading, user } = useAuthContext();
  const { fetchProfile } = useProfileContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // LOGIN FIRST
      await login(form);

      // GET USER ID
      const userId = user?.user_id ?? Number(localStorage.getItem("user_id"));
      if (!userId) throw new Error("Invalid user ID");

      // FETCH PROFILE
      await fetchProfile(userId);

      // CHECK IF USER ALREADY HAS FINANCE RESPONSE
      let hasUserResponse = false;
      try {
        const res = await financeService.getResponseForUser(userId);
        if (res === null) hasUserResponse = false;
        else hasUserResponse = true;
      } catch (err) {
        hasUserResponse = false;
      }

      // SAVE FLAG IN LOCAL STORAGE
      // firstLogin = true → navigate to baby steps
      // firstLogin = false → navigate to dashboard
      if (hasUserResponse) {
        localStorage.setItem("completed_baby_steps", "true");
        navigate("/dashboard", { replace: true });
      } else {
        localStorage.setItem("completed_baby_steps", "false");
        navigate("/finance", { replace: true });
      }

    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h4 mb-3 text-center">Welcome back</h1>
          <p className="text-muted text-center mb-4">
            Sign in to manage your personal finances.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email
                <span className="required-star">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password
                <span className="required-star">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
