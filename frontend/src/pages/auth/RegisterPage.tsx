import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import { CountryEnum, User } from "../../generated/api-client";
import validator from "validator";
import "./Auth.scss";

const provincesCA = [
  "Ontario", "Quebec", "Nova Scotia", "New Brunswick", "Manitoba", "British Columbia",
  "Prince Edward Island", "Saskatchewan", "Alberta", "Newfoundland and Labrador"
];

const statesUS = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida",
  "Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
  "Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska",
  "Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota",
  "Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
  "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

type FormState = {
  username: string;
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  province_state: string;
  postal_code: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
  salary: string;
  total_balance: string;
  budget_preference: string;
  email_notification: boolean;
};

type ErrorState = { [key: string]: string | null };

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    username: "",
    first_name: "",
    last_name: "",
    city: "",
    country: "",
    province_state: "",
    postal_code: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    salary: "",
    total_balance: "",
    budget_preference: "monthly",
    email_notification: false,
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [successHeader, setSuccessHeader] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const newValue = type === "checkbox" ? checked : value;

    setForm(prev => ({ ...prev, [name]: newValue }));

    setErrors(prev => ({ ...prev, [name]: null }));
  };

  // ---------------------------
  // VALIDATION
  // ---------------------------
  const validate = () => {
    const newErrors: ErrorState = {};
    const noSpecial = /^[A-Za-z\s-]+$/;

    // FirstName / LastName / Username / City
    if (!form.first_name || !noSpecial.test(form.first_name))
      newErrors.first_name = "Invalid first name.";

    if (!form.last_name || !noSpecial.test(form.last_name))
      newErrors.last_name = "Invalid last name.";

    if (!form.username || !noSpecial.test(form.username))
      newErrors.username = "Invalid username.";

    if (!form.city || !noSpecial.test(form.city))
      newErrors.city = "Invalid city.";

    // Email
    if (!validator.isEmail(form.email))
      newErrors.email = "Invalid email address.";

    // Password
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    // Confirm Password
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match.";

    // Country
    if (!form.country)
      newErrors.country = "Please select a country.";

    // Province / State
    if (!form.province_state)
      newErrors.province_state = "Please select a province/state.";

    // Postal Code
    if (form.country === CountryEnum.Canada) {
      if (!validator.isPostalCode(form.postal_code, "CA"))
        newErrors.postal_code = "Invalid Canadian postal code.";
    } else if (form.country === CountryEnum.US) {
      if (!validator.isPostalCode(form.postal_code, "US"))
        newErrors.postal_code = "Invalid US ZIP code.";
    } else {
      newErrors.postal_code = "Select country first.";
    }

    // Phone Number
    if (form.country === CountryEnum.Canada) {
      if (!validator.isMobilePhone(form.phone_number, "en-CA"))
        newErrors.phone_number = "Invalid Canadian phone number.";
    } else if (form.country === CountryEnum.US) {
      if (!validator.isMobilePhone(form.phone_number, "en-US"))
        newErrors.phone_number = "Invalid US phone number.";
    } else {
      newErrors.phone_number = "Select country first.";
    }

    // Salary > 0
    if (Number(form.salary) <= 0)
      newErrors.salary = "Salary must be greater than 0.";

    // Total Balance >= 0
    if (Number(form.total_balance) < 0)
      newErrors.total_balance = "Total balance cannot be negative.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const body: Partial<User> = {
      username: form.username.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      city: form.city.trim(),
      country: form.country as CountryEnum,
      province_state: form.province_state,
      postal_code: form.postal_code.trim(),
      phone_number: form.phone_number.trim(),
      email: form.email.trim(),
      password: form.password,
      salary: String(Number(form.salary)),
      total_balance: String(Number(form.total_balance)),
      budget_preference: form.budget_preference as any,
      email_notification: form.email_notification,
    };

    try {
      await apiClient.api.usersRegisterCreate(body as User);
      localStorage.setItem("completed_baby_steps", "false");

      setSuccessHeader("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setSuccessHeader("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const provinceList =
    form.country === CountryEnum.Canada ? provincesCA : statesUS;

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

            {/* FIRST & LAST NAME */}
            <div className="col-md-6">
              <label className="form-label fw-bold">First Name
                <span className="required-star">*</span>
              </label>
              <input name="first_name" className="form-control"
                value={form.first_name} onChange={handleChange} />
              {errors.first_name && <div className="text-danger small">{errors.first_name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Last Name
                <span className="required-star">*</span>
              </label>
              <input name="last_name" className="form-control"
                value={form.last_name} onChange={handleChange} />
              {errors.last_name && <div className="text-danger small">{errors.last_name}</div>}
            </div>

            {/* USERNAME */}
            <div className="col-12">
              <label className="form-label fw-bold">Username
                <span className="required-star">*</span>
              </label>
              <input name="username" className="form-control"
                value={form.username} onChange={handleChange} />
              {errors.username && <div className="text-danger small">{errors.username}</div>}
            </div>

            {/* EMAIL */}
            <div className="col-12">
              <label className="form-label fw-bold">Email
                <span className="required-star">*</span>
              </label>
              <input name="email" type="email" className="form-control"
                value={form.email} onChange={handleChange} />
              {errors.email && <div className="text-danger small">{errors.email}</div>}
            </div>

            {/* PASSWORD */}
            <div className="col-12">
              <label className="form-label fw-bold">Password
                <span className="required-star">*</span>
              </label>
              <input name="password" type="password" className="form-control"
                value={form.password} onChange={handleChange} />
              {errors.password && <div className="text-danger small">{errors.password}</div>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="col-12">
              <label className="form-label fw-bold">Confirm Password
                <span className="required-star">*</span>
              </label>
              <input name="confirm_password" type="password" className="form-control"
                value={form.confirm_password} onChange={handleChange} />
              {errors.confirm_password && <div className="text-danger small">{errors.confirm_password}</div>}
            </div>

            {/* COUNTRY */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Country
                <span className="required-star">*</span>
              </label>
              <select name="country" className="form-select"
                value={form.country} onChange={handleChange}>
                <option value="">Select Country</option>
                <option value={CountryEnum.Canada}>Canada</option>
                <option value={CountryEnum.US}>United States</option>
              </select>
              {errors.country && <div className="text-danger small">{errors.country}</div>}
            </div>

            {/* PROVINCE / STATE */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Province / State
                <span className="required-star">*</span>
              </label>
              <select name="province_state" className="form-select"
                value={form.province_state} onChange={handleChange}>
                <option value="">Select</option>
                {provinceList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.province_state && <div className="text-danger small">{errors.province_state}</div>}
            </div>

            {/* PHONE */}
            <div className="col-12">
              <label className="form-label fw-bold">Phone Number
                <span className="required-star">*</span>
              </label>
              <input name="phone_number" className="form-control"
                value={form.phone_number} onChange={handleChange} />
              {errors.phone_number && <div className="text-danger small">{errors.phone_number}</div>}
            </div>

            {/* CITY */}
            <div className="col-12">
              <label className="form-label fw-bold">City
                <span className="required-star">*</span>
              </label>
              <input name="city" className="form-control"
                value={form.city} onChange={handleChange} />
              {errors.city && <div className="text-danger small">{errors.city}</div>}
            </div>

            {/* POSTAL CODE */}
            <div className="col-12">
              <label className="form-label fw-bold">Postal Code
                <span className="required-star">*</span>
              </label>
              <input name="postal_code" className="form-control"
                value={form.postal_code} onChange={handleChange} />
              {errors.postal_code && <div className="text-danger small">{errors.postal_code}</div>}
            </div>

            {/* SALARY */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Salary
                <span className="required-star">*</span>
              </label>
              <input name="salary" type="number" className="form-control"
                value={form.salary} onChange={handleChange} />
              {errors.salary && <div className="text-danger small">{errors.salary}</div>}
            </div>

            {/* TOTAL BALANCE */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Total Balance
                <span className="required-star">*</span>
              </label>
              <input name="total_balance" type="number" className="form-control"
                value={form.total_balance} onChange={handleChange} />
              {errors.total_balance && <div className="text-danger small">{errors.total_balance}</div>}
            </div>

            {/* BUDGET PREFERENCE */}
            <div className="col-12">
              <label className="form-label fw-bold">Budget Preference
                <span className="required-star">*</span>
              </label>
              <select name="budget_preference" className="form-select"
                value={form.budget_preference} onChange={handleChange}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* EMAIL NOTIFICATION */}
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

            {/* SUBMIT */}
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
