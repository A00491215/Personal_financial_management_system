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

  // Real recent expenses from backend
  const recentExpenses = data.recent_expenses ?? [];

  // ---------------- Baby Steps / Milestones ----------------
  const milestoneStatus = data.milestone_status;

  type BabyStepView = { label: string; progress: number };

  const babySteps: BabyStepView[] = [];

  if (Array.isArray(milestoneStatus)) {
    // If backend returns an array like [{ name, progress }, ...]
    milestoneStatus.forEach((step: any, index: number) => {
      const label: string =
        step.name ||
        step.title ||
        step.label ||
        `Baby Step ${index + 1}`;

      const progress = Number(
        step.progress ??
          step.percentage ??
          step.completed_percentage ??
          0
      );

      babySteps.push({ label, progress });
    });
  } else if (milestoneStatus && typeof milestoneStatus === "object") {
    // If backend returns an object with keys
    Object.entries(milestoneStatus).forEach(([key, value]: [string, any]) => {
      const label =
        value?.name || value?.title || value?.label || key.replace(/_/g, " ");

      const progress = Number(
        value?.progress ??
          value?.percentage ??
          value?.completed_percentage ??
          0
      );

      babySteps.push({ label, progress });
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

        {/* Baby Steps Progress (now using milestone_status) */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Baby Steps Progress</h5>
              {babySteps.length === 0 ? (
                <>
                  <p className="text-muted">
                    We&apos;ll connect this to real milestone data later.
                  </p>
                  <p className="text-muted mb-0">
                    Complete your Dave Ramsey / milestone questionnaire to see
                    your progress here.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted">
                    This shows your progress on each Baby Step based on your
                    latest responses.
                  </p>

                  {babySteps.map((step, index) => (
                    <div className="mb-2" key={index}>
                      <strong>{step.label}</strong>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${Math.min(step.progress, 100)}%` }}
                        >
                          {Math.round(step.progress)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;