// frontend/src/services/expensesService.ts
import axios from "axios";

/**
 * Configure axios instance.
 * - Uses the same base URL as backend API.
 * - Attaches JWT access token from localStorage ("access").
 *
 * NOTE:
 * If you later want to change base URL, update BASE_URL only.
 */
const BASE_URL = "http://localhost:8000/api"; // works when running frontend locally

const api = axios.create({
  baseURL: BASE_URL,
});

// Add Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Matches your Expense model / serializer */
export interface Expense {
  expense_date: string; // primary key (date string YYYY-MM-DD)
  user_id: number;
  category_id: number;
  amount: string;
  created_at: string;
  user_username?: string;
  category_name?: string;
}

/** Monthly summary for FR-7 budget alerts */
export interface MonthlySummary {
  total_spent: string;  // decimal as string
  budget: string;       // salary / budget as string
  percentage: number;   // 0–100+
  alert_level: number;  // 0, 75, 90, 100
}

/**
 * Get all expenses for a specific user.
 * Backend: GET /api/expenses/?user_id={userId}
 */
export async function fetchExpensesForUser(
  userId: number
): Promise<Expense[]> {
  const response = await api.get<Expense[]>("/expenses/", {
    params: { user_id: userId },
  });
  return response.data;
}

/**
 * Create a new daily expense.
 * Backend: POST /api/expenses/
 */
export async function createExpense(data: {
  user_id: number;
  category_id: number;
  amount: string;
  expense_date: string; // "YYYY-MM-DD"
}): Promise<Expense> {
  const response = await api.post<Expense>("/expenses/", data);
  return response.data;
}

/**
 * Get this month's spending vs budget (FR-7).
 * Backend: GET /api/expenses/monthly-summary/
 */
export async function fetchMonthlySummary(): Promise<MonthlySummary> {
  const response = await api.get<MonthlySummary>("/expenses/monthly-summary/");
  return response.data;
}