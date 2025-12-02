// frontend/src/pages/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import {
  fetchDashboardSummary,
  DashboardSummary,
} from "../../services/dashboardService";

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchDashboardSummary();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard summary", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">Dashboard</h2>
        <p>Loading your financial overview...</p>
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">Dashboard</h2>
        <div className="alert alert-danger mt-3">
          {error ?? "No dashboard data available"}
        </div>
      </div>
    );
  }

  // --------- Top numbers ----------
  const totalBalance = Number(data.total_balance ?? 0);
  const monthlyIncome = Number(data.monthly_income ?? 0);
  const monthlyExpenses = Number(data.monthly_expenses ?? 0);
  const savingsRate = data.savings_rate ?? 0;

  // --------- Recent expenses ----------
  const recentExpenses = data.recent_expenses ?? [];

  // --------- Baby steps / milestones ----------
  const milestoneStatus: any = data.milestone_status || {};

  const babyMessage: string =
    typeof milestoneStatus.message === "string" &&
    milestoneStatus.message.trim() !== ""
      ? milestoneStatus.message
      : "This shows your progress on each Baby Step based on your latest responses.";

  const rawMilestones = milestoneStatus.milestones;
  let babyMilestones: string[] = [];

  if (Array.isArray(rawMilestones)) {
    babyMilestones = rawMilestones.map((item: any) => {
      // If backend already returned a simple string, use it directly
      if (typeof item === "string") {
        return item;
      }

      // If it's an object, format it nicely
      if (item && typeof item === "object") {
        // Try to build something like:
        // "Baby Step 1: Emergency Fund – 40% complete (4000 / 10000)"
        const stepLabel =
          item.step ||
          item.title ||
          "Baby Step";

        const progress =
          item.progress_percentage ??
          item.progress ??
          null;

        const amountsPart =
          item.current_amount != null && item.required_amount != null
            ? ` (${item.current_amount} / ${item.required_amount})`
            : item.debt_amount != null
            ? ` (Debt: ${item.debt_amount})`
            : "";

        const progressPart =
          progress != null ? ` – ${Number(progress).toFixed(0)}% complete` : "";

        if (item.message) {
          // If backend already gives a human message, prefer that
          return String(item.message);
        }

        return `${stepLabel}${progressPart}${amountsPart}`;
      }

      // Fallback: stringify anything weird
      return String(item);
    });
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* Top summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Total Balance</h6>
              <h3 className="mb-0">
                $
                {totalBalance.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Monthly Income</h6>
              <h4 className="mb-0">
                $
                {monthlyIncome.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Monthly Expenses</h6>
              <h4 className="mb-0 text-danger">
                $
                {monthlyExpenses.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Savings Rate</h6>
              <h4 className="mb-0">{savingsRate}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="row g-3">
        {/* Recent Activity */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <p className="text-muted">
                Your latest expenses will appear here.
              </p>

              {recentExpenses.length === 0 ? (
                <p className="text-muted mb-0">No recent expenses yet.</p>
              ) : (
                <ul className="mb-0">
                  {recentExpenses.map((exp) => (
                    <li
                      key={`${exp.expense_date}-${exp.category_id}-${exp.amount}`}
                    >
                      {exp.expense_date} – {exp.category_name} – $
                      {Number(exp.amount).toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Baby Steps Progress */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Baby Steps Progress</h5>

              <p className="mb-2">{babyMessage}</p>

              {babyMilestones.length === 0 ? (
                <p className="text-muted mb-0">
                  Once you complete the Milestones questionnaire, your
                  step-by-step progress will appear here.
                </p>
              ) : (
                <ul className="mb-0">
                  {babyMilestones.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
