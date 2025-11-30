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

  // Safely read values from API response
  const totalBalance = Number(data?.total_balance ?? 0);
  const monthlyIncome = Number(data?.monthly_income ?? 0);
  const monthlyExpenses = Number(data?.monthly_expenses ?? 0);
  const savingsRate = data?.savings_rate ?? 0;

  // New: real recent expenses from backend
  const recentExpenses = data.recent_expenses ?? [];

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

        <div className="col-md-3 ">
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

        {/* Baby Steps (still static for now) */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Baby Steps Progress</h5>
              <p className="text-muted">
                We&apos;ll connect this to real milestone data later.
              </p>

              <div className="mb-2">
                <strong>Baby Step 1: Emergency Fund</strong>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "40%" }}
                  >
                    40%
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <strong>Baby Step 2: Debt Snowball</strong>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: "10%" }}
                  >
                    10%
                  </div>
                </div>
              </div>

              <div>
                <strong>Baby Step 3: 3–6 Month Fund</strong>
                <div className="progress">
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: "0%" }}
                  >
                    0%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
