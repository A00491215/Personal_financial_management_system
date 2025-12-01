// frontend/src/pages/expenses/ExpensesPage.tsx
import React, { useEffect, useState } from "react";
import {
  fetchExpensesForUser,
  fetchMonthlySummary,
  fetchCategories,
  createExpense,
  Expense,
  MonthlySummary,
  Category,
  ExpenseFilters,
} from "../../services/expensesService";

// Helper: get user_id from localStorage
const getCurrentUserId = (): number | null => {
  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser);
      if (parsed?.user_id) {
        return Number(parsed.user_id);
      }
    } catch {
      // ignore
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const todayStr = new Date().toISOString().slice(0, 10);
  const [formDate, setFormDate] = useState<string>(todayStr);
  const [formCategoryId, setFormCategoryId] = useState<string>("");
  const [formAmount, setFormAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // 🔍 Filter state
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterCategoryId, setFilterCategoryId] = useState<string>("");

  // Build filters object from current filter state
  const buildFilters = (): ExpenseFilters => {
    const filters: ExpenseFilters = {};
    if (filterStartDate) {
      filters.date_from = filterStartDate;
    }
    if (filterEndDate) {
      filters.date_to = filterEndDate;
    }
    if (filterCategoryId) {
      filters.category_id = Number(filterCategoryId);
    }
    return filters;
  };

  // Helper: reload expenses + summary (used on first load and after create / filter)
  const reloadData = async (uId: number, filters: ExpenseFilters = {}) => {
    const [expensesData, summaryData] = await Promise.all([
      fetchExpensesForUser(uId, filters),
      fetchMonthlySummary(),
    ]);
    setExpenses(expensesData);
    setSummary(summaryData);
  };

  // Initial load
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingInitial(true);
        setError(null);

        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
          setError(
            "Could not determine current user. Please log out and log in again."
          );
          setLoadingInitial(false);
          return;
        }
        setUserId(currentUserId);

        // Load categories, expenses, and summary in parallel
        const [cats, expensesData, summaryData] = await Promise.all([
          fetchCategories(),
          fetchExpensesForUser(currentUserId),
          fetchMonthlySummary(),
        ]);

        setCategories(cats);
        setExpenses(expensesData);
        setSummary(summaryData);

        // Pre-select first category in form if none chosen yet
        if (cats.length > 0 && !formCategoryId) {
          setFormCategoryId(String(cats[0].category_id));
        }
      } catch (err) {
        console.error("Failed to load expenses or summary", err);
        setError("Could not load daily expenses data.");
      } finally {
        setLoadingInitial(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (loadingInitial) {
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

  // Safe to render summary + table
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

  // Handle form submit (add expense)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!userId) {
      setFormError("User not found. Please log out and log in again.");
      return;
    }

    if (!formDate) {
      setFormError("Please select a date.");
      return;
    }

    if (!formCategoryId) {
      setFormError("Please select a category.");
      return;
    }

    const trimmedAmount = formAmount.trim();
    const numericAmount = Number(trimmedAmount);

    if (!trimmedAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      setSubmitting(true);

      await createExpense({
        user_id: userId,
        category_id: Number(formCategoryId),
        amount: numericAmount.toFixed(2),
        expense_date: formDate,
      });

      setFormSuccess("Expense added successfully.");
      setFormAmount("");
      setFormDate(todayStr); // reset to today, or keep previous, your choice

      // Refresh list + summary so FR-7 bar & alerts update
      const filters = buildFilters();
      await reloadData(userId, filters);
    } catch (err) {
      console.error("Failed to create expense", err);
      setFormError("Failed to add expense. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle filter apply
  const handleApplyFilters = async () => {
    if (!userId) return;
    const filters = buildFilters();
    await reloadData(userId, filters);
  };

  // Handle filter clear
  const handleClearFilters = async () => {
    if (!userId) return;
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterCategoryId("");
    await reloadData(userId, {}); // no filters
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Daily Expenses</h2>

      {/* Top row: Monthly summary + tips */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">This Month&apos;s Budget Overview</h5>
              <p className="mb-1">
                <strong>Spent:</strong>{" "}
                {totalSpent.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                {budget > 0 && (
                  <>
                    of{" "}
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

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Tips</h5>
              <p className="text-muted mb-0">
                Record your daily expenses using the form below. The bar on the
                left shows how much of your monthly budget you&apos;ve used.
                Alerts will appear when you reach 75%, 90%, and 100%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filters</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">From date</label>
              <input
                type="date"
                className="form-control"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">To date</label>
              <input
                type="date"
                className="form-control"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary flex-fill"
                onClick={handleApplyFilters}
              >
                Apply filters
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Add Expense</h5>

          {formError && (
            <div className="alert alert-danger" role="alert">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="alert alert-success" role="alert">
              {formSuccess}
            </div>
          )}

          <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
            <div className="col-md-3">
              <label htmlFor="expense-date" className="form-label">
                Date
              </label>
              <input
                id="expense-date"
                type="date"
                className="form-control"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="expense-category" className="form-label">
                Category
              </label>
              <select
                id="expense-category"
                className="form-select"
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
              >
                {categories.length === 0 && (
                  <option value="">No categories found</option>
                )}
                {categories.length > 0 && formCategoryId === "" && (
                  <option value="">Select a category</option>
                )}
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="expense-amount" className="form-label">
                Amount
              </label>
              <input
                id="expense-amount"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="col-md-2 d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Add Expense"}
              </button>
            </div>
          </form>
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
