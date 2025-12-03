// frontend/src/services/dashboardService.ts
import axios from "axios";

export interface DashboardExpense {
  expense_date: string;
  user_id: number;
  category_id: number;
  amount: string;
  created_at: string;
  user_username: string;
  category_name: string;
}

export interface DashboardSummary {
  total_balance: string;
  monthly_income: string;
  monthly_expenses: string;
  savings_rate: number;
  recent_expenses: DashboardExpense[];
  milestone_status: any; // TODO: type this more strictly later
}

/**
 * Shared Axios instance for dashboard calls.
 * Base URL comes from REACT_APP_API_URL so it works on Netlify + Koyeb.
 */
const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:8000"; // fallback for local dev

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access") || localStorage.getItem("accessToken");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Fetch the dashboard summary for the logged-in user.
 * Backend endpoint: GET /api/users/dashboard/
 * (the user is determined from the JWT token).
 */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>("/api/users/dashboard/");
  return response.data;
}
