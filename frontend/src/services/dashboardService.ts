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
  milestone_status: any; // you can define a proper type later
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  // Get JWT token from localStorage (use the same key that your login page uses)
  const token =
    localStorage.getItem("access") || localStorage.getItem("accessToken");

  const response = await axios.get<DashboardSummary>(
    "http://localhost:8000/api/users/dashboard/",
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    }
  );

  return response.data;
}
