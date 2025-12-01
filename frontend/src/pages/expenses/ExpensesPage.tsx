// frontend/src/pages/expenses/ExpensesPage.tsx
import React, { useEffect, useState } from "react";
import {
  fetchExpensesForUser,
  fetchMonthlySummary,
  Expense,
  MonthlySummary,
} from "../../services/expensesService";

// Helper: try to get user_id from localStorage
const getCurrentUserId = (): number | null => {
  // adjust these keys if your login stores user differently
  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser);
      if (parsed?.user_id) {
        return Number(parsed.user_id);
      }
    } catch {
      // ignore JSON errors
    }
  }

  const rawId = localStorage.getItem("user_id");
  if (rawId) {
    const id = Number(rawId);
    return Number.isNaN(id) ? null : id;
  }

  return null;
};

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getCurrentUserId();
        if (!userId) {
          setError(
            "Could not determine current user. Please log out and log in again."
          );
          setLoading(false);
          return;
        }

        // Fetch expenses and summary in parallel
        const [expensesData, summaryData] = await Promise.all([
          fetchExpensesForUser(userId),
          fetchMonthlySummary(),
        ]);

        setExpenses(expensesData);
        setSummary(summaryData);
      } catch (err) {
        console.error("Failed to load expenses or summary", err);
        setError("Could not load daily expenses data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Daily Expenses</h2>
        <p>Loading your expenses...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-4">
        <h2>Daily Expenses</h2>
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // We are past loading & error -> safe to render summary + table
  const totalSpent = summary ? Number(summary.total_spent) : 0;
  const budget = summary ? Number(summary.budget) : 0;
  const percentage = summary ? summary.percentage : 0;
  const clampedPercent = Math.min(Math.max(percentage, 0), 100);

  // Decide alert text & style based on FR-7 logic
  let alertVariant: "info" | "warning" | "danger" | null = null;
  let alertMessage: string | null = null;

  if (summary) {
    if (summary.percentage >= 100 || summary.alert_level >= 100) {
      alertVariant = "danger";
      alertMessage =
        "You have reached or exceeded 100% of your budget. Please review your spending.";
    } else if (summary.percentage >= 90 || summary.alert_level >= 90) {
      alertVariant = "warning";
      alertMessage =
        "You have reached 90% of your budget. You are very close to overspending.";
    } else if (summary.percentage >= 75 || summary.alert_level >= 75) {
      alertVariant = "info";
      alertMessage =
        "You have reached 75% of your budget. Keep an eye on your expenses.";
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Daily Expenses</h2>

      {/* Top row: Monthly summary + alert (FR-7) */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">This Month&apos;s Budget Overview</h5>
              <p className="mb-1">
                <strong>Spent:</strong>{" "}
                ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                {budget > 0 && (
                  <>
                    of $
                    {budget.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </>
                )}
              </p>
              <p className="mb-2">
                <strong>Used:</strong> {percentage.toFixed(1)}%
              </p>

              <div className="progress" style={{ height: "1.1rem" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${clampedPercent}%` }}
                  aria-valuenow={clampedPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {clampedPercent.toFixed(1)}%
                </div>
              </div>

              {alertVariant && alertMessage && (
                <div
                  className={`alert alert-${alertVariant} mt-3 mb-0`}
                  role="alert"
                >
                  {alertMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You can use the right side later for charts or filters */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Tips</h5>
              <p className="text-muted mb-0">
                Track your daily expenses here and watch this bar to avoid
                overspending. Alerts will appear when you reach 75%, 90%, and
                100% of your budget.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Expense History</h5>

          {expenses.length === 0 ? (
            <p className="text-muted mb-0">
              You don&apos;t have any expenses recorded yet for this period.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Category</th>
                    <th scope="col" className="text-end">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={`${exp.expense_date}-${exp.category_id}`}>
                      <td>
                        {new Date(exp.expense_date).toLocaleDateString()}
                      </td>
                      <td>{exp.category_name ?? exp.category_id}</td>
                      <td className="text-end">
                        $
                        {Number(exp.amount).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
