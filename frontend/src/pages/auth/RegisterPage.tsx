import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import type { User } from "../../generated/api-client";
import "./Auth.scss"; 

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    salary: "",
    total_balance: "",
    budget_preference: "monthly",
    email_notification: false,
  });

  const [loading, setLoading] = useState(false);
  const [successHeader, setSuccessHeader] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    const newValue = type === "checkbox" ? target.checked : value;

    setForm(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body: Partial<User> = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,

      salary: String(Number(form.salary)),
      total_balance: String(Number(form.total_balance)),

      budget_preference: form.budget_preference as any,  // ✅ FIXED
      email_notification: form.email_notification,
    };

    try {
      await apiClient.api.usersRegisterCreate(body as User);

      setSuccessHeader("Account created successfully! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setSuccessHeader("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card shadow-sm auth-card">
        <div className="card-body">

          {successHeader ? (
            <h2 className="text-success text-center mb-4">{successHeader}</h2>
          ) : (
            <h1 className="h4 mb-3 text-center">Create Your Account</h1>
          )}

          <form onSubmit={handleSubmit} noValidate className="row g-3">

            <div className="col-12">
              <label className="form-label fw-bold">Username</label>
              <input
                name="username"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Salary</label>
              <input
                name="salary"
                type="number"
                className="form-control"
                value={form.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Total Balance</label>
              <input
                name="total_balance"
                type="number"
                className="form-control"
                value={form.total_balance}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Budget Preference</label>
              <select
                name="budget_preference"
                className="form-select"
                value={form.budget_preference}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="col-12 d-flex align-items-center">
              <input
                type="checkbox"
                id="email_notification"
                name="email_notification"
                checked={form.email_notification}
                onChange={handleChange}
                className="form-check-input me-2"
              />
              <label htmlFor="email_notification" className="form-check-label fw-bold">
                Email Notifications
              </label>
            </div>

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="text-center mt-3 mb-0 small">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
