import React, { useEffect, useState } from "react";
import { useProfileContext } from "../../contexts/ProfileContext";
import type { User, PatchedUser } from "../../generated/api-client";
import "./ProfilePage.scss";

const ProfilePage: React.FC = () => {
  const { profile, loading, fetchProfile, updateProfile } = useProfileContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<User | null>(null);

  const userId = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm(prev =>
      prev
        ? {
            ...prev,
            [name]: type === "checkbox" ? checked : value,
          }
        : prev
    );
  };

  const handleSave = async () => {
    if (!form || !userId) return;
    const payload: Partial<PatchedUser> = {
      username: form.username,
      salary: form.salary ?? null,
      total_balance: form.total_balance ?? null,
      budget_preference: form.budget_preference,
      email_notification: form.email_notification,
    };
    await updateProfile(userId, payload);
    setEditing(false);
  };

  if (!userId) {
    return <div className="alert alert-warning">No user id found.</div>;
  }

  return (
    <div className="profile-page">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="avatar-lg rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                {form?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="h5 mb-0">{form?.username || "Profile"}</h1>
                <div className="text-muted small">{form?.email}</div>
              </div>
            </div>
            {!editing ? (
              <button
                className="btn btn-outline-primary"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setForm(profile);
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            )}
          </div>

          {loading && <div className="spinner-border mb-3" />}

          {form && (
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Salary</label>
                <input
                  className="form-control"
                  type="number"
                  name="salary"
                  value={form.salary ?? ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Total Balance</label>
                <input
                  className="form-control"
                  type="number"
                  name="total_balance"
                  value={form.total_balance ?? ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label d-block">Budget Preference</label>
                {["daily", "weekly", "monthly", "yearly"].map(option => (
                  <div className="form-check form-check-inline" key={option}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="budget_preference"
                      value={option}
                      checked={form.budget_preference === option}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                    <label className="form-check-label text-capitalize">
                      {option}
                    </label>
                  </div>
                ))}
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailNotification"
                    name="email_notification"
                    checked={!!form.email_notification}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                  <label className="form-check-label" htmlFor="emailNotification">
                    Email notifications
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
