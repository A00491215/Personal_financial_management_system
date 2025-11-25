// src/pages/finance/FinanceFormPage.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar/Navbar";

import { useAuthContext } from "../../contexts/AuthContext";
import { useProfileContext } from "../../contexts/ProfileContext";
import { useFinanceContext } from "../../contexts/FinanceContext";

import { childrenService } from "../../services/children.service";
import type { ChildrenContribution } from "../../generated/api-client";

import "./FinanceFormPage.scss";

interface FinanceFormUI {
  emergency_savings: boolean;
  emergency_savings_amount: string;

  has_debt: boolean;
  debt_amount: string;

  full_emergency_fund: boolean;
  full_emergency_fund_amount: string;

  retirement_investing: boolean;
  retirement_savings_amount: string;

  has_children: boolean;
  children_count: number;

  bought_home: boolean;
  pay_off_home: boolean;
  mortgage_remaining: string;
}

interface ChildContributionUI {
  child_id?: number | null;
  child_name: string;
  parent_name: string;
  total_contribution_planned: string;
  has_total_contribution: boolean;
  monthly_contribution: string;
}

interface FinanceErrors {
  emergency_savings_amount?: string;
  debt_amount?: string;
  full_emergency_fund_amount?: string;
  retirement_savings_amount?: string;
  children_count?: string;
  [key: `child_name_${number}`]: string | undefined;
  [key: `child_total_${number}`]: string | undefined;
  [key: `child_monthly_${number}`]: string | undefined; 
  mortgage_remaining?: string;
}

/* ----------------------------------------------
 * MAIN COMPONENT
 * ---------------------------------------------- */
const FinanceFormPage: React.FC = () => {
  const { user } = useAuthContext();
  const { profile } = useProfileContext();
  const { response, loadFinance, saveFinance } = useFinanceContext();

  const userId = user?.user_id ?? Number(localStorage.getItem("user_id"));
  const username = profile?.username || "Parent";

  const [form, setForm] = useState<FinanceFormUI>({
    emergency_savings: false,
    emergency_savings_amount: "",

    has_debt: false,
    debt_amount: "",

    full_emergency_fund: false,
    full_emergency_fund_amount: "",

    retirement_investing: false,
    retirement_savings_amount: "",

    has_children: false,
    children_count: 0,

    bought_home: false,
    pay_off_home: false,
    mortgage_remaining: "",
  });

  /* ----------------------------------------------
   * VALIDATION ERRORS
   * ---------------------------------------------- */
  const [errors, setErrors] = useState<FinanceErrors>({});

  /* ----------------------------------------------
   * CHILDREN STATE
   * ---------------------------------------------- */
  const [children, setChildren] = useState<ChildContributionUI[]>([]);

  /* ----------------------------------------------
   * EXPANDED ACCORDIONS
   * ---------------------------------------------- */
  const [openStep, setOpenStep] = useState<Number[]>([1]);
  const toggleStep = (n: number) => {
    setOpenStep((prev) => (prev.includes(n) ? prev.filter((step) => step !== n) : [...prev, n]));
  };

  useEffect(() => {
    if (!userId) return;
    
    loadFinance(userId);
    childrenService.getChildren(userId).then((existing) => {
      setChildren(
        existing.map((c: ChildrenContribution) => ({
          child_id: c.child_id ?? null,
          child_name: c.child_name ?? "",
          parent_name: c.parent_name ?? username,
          total_contribution_planned:
            c.total_contribution_planned?.toString() || "",
          has_total_contribution: c.has_total_contribution ?? false,
          monthly_contribution: c.monthly_contribution?.toString() || "",
        }))
      );
    });
  }, [userId, username, loadFinance]);

  /* ----------------------------------------------
   * SYNC FORM WITH BACKEND USER-RESPONSE
   * ---------------------------------------------- */
  useEffect(() => {
    if (!response) return;

    setForm({
      emergency_savings: response.emergency_savings ?? false,
      emergency_savings_amount:
        response.emergency_savings_amount?.toString() || "",

      has_debt: response.has_debt ?? false,
      debt_amount: response.debt_amount?.toString() || "",

      full_emergency_fund: response.full_emergency_fund ?? false,
      full_emergency_fund_amount:
        response.full_emergency_fund_amount?.toString() || "",

      retirement_investing: response.retirement_investing ?? false,
      retirement_savings_amount:
        response.retirement_savings_amount?.toString() || "",

      has_children: response.has_children ?? false,
      children_count: response.children_count || 0,

      bought_home: response.bought_home ?? false,
      pay_off_home: response.pay_off_home ?? false,
      mortgage_remaining: response.mortgage_remaining?.toString() || "",
    });
  }, [response]);

  useEffect(() => {
    // Expand children array if needed
    if (form.children_count > children.length) {
      const diff = form.children_count - children.length;
      const newEntries: ChildContributionUI[] = Array.from({ length: diff }).map(() => ({
        child_name: "",
        parent_name: username,
        total_contribution_planned: "",
        has_total_contribution: false,
        monthly_contribution: "",
      }));
      setChildren((prev) => [...prev, ...newEntries]);
    }

    // Shrink children array if user reduces count
    if (form.children_count < children.length) {
      setChildren((prev) => prev.slice(0, form.children_count));
    }
  }, [form.children_count, username]);


  /* ----------------------------------------------
   * HANDLERS
   * ---------------------------------------------- */
  const handleRadio = <K extends keyof FinanceFormUI>(
    field: K,
    value: boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear related errors when user interacts
    if (field === "emergency_savings") {
      setErrors((prev) => ({ ...prev, emergency_savings_amount: undefined }));
    }
    if (field === "full_emergency_fund") {
      setErrors((prev) => ({ ...prev, full_emergency_fund_amount: undefined }));
    }
  };

  const handleInput = <K extends keyof FinanceFormUI>(
    field: K,
    value: FinanceFormUI[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateChild = <K extends keyof ChildContributionUI>(
    index: number,
    field: K,
    value: ChildContributionUI[K]
  ) => {
    setChildren((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FinanceErrors = {};

    if (form.emergency_savings) {
      if (!form.emergency_savings_amount.trim()) {
        newErrors.emergency_savings_amount = "Please enter an amount.";
      } else {
        const val = Number(form.emergency_savings_amount);
        if (isNaN(val) || val < 0) {
          newErrors.emergency_savings_amount = "Amount cannot be below 0.";
        } else if (val > 1000) {
          newErrors.emergency_savings_amount =
            "Amount cannot be more than 1000.";
        }
      }
    }

    if (form.has_debt) {
      if (!form.debt_amount.trim()) {
        newErrors.debt_amount = "Please enter your total debt amount.";
      } else {
        const val = Number(form.debt_amount);
        if (isNaN(val) || val < 0) {
          newErrors.debt_amount = "Debt amount cannot be negative.";
        }
      }
    }

    if (form.full_emergency_fund) {
      if (!form.full_emergency_fund_amount.trim()) {
        newErrors.full_emergency_fund_amount = "Please enter an amount.";
      } else {
        const val = Number(form.full_emergency_fund_amount);
        if (isNaN(val) || val < 0) {
          newErrors.full_emergency_fund_amount = "Amount cannot be below 0.";
        } else if (val > Number (profile?.salary)/2) {
          newErrors.full_emergency_fund_amount =
            "Amount cannot exceed 6 months of Salary.";
        }
      }
    }
    

    if (form.retirement_investing) {
      if (!form.retirement_savings_amount.trim()) {
        newErrors.retirement_savings_amount = "Please enter monthly investment amount.";
      } else {
        const val = Number(form.retirement_savings_amount);
        if (isNaN(val) || val < 0) {
          newErrors.retirement_savings_amount = "Amount cannot be negative.";
        }
        else if (val > (Number(profile?.salary)*0.15)/12)
        {
          newErrors.retirement_savings_amount = "Amount cannot exceed 15% of monthly salary.";
        }
      }
    }

  if (form.has_children) {
    if (form.children_count <= 0) {
      newErrors.children_count = "Please enter number of children greater than 0.";
    }

    children.slice(0, form.children_count).forEach((child, index) => {
      if (!child.child_name.trim()) {
        newErrors[`child_name_${index}` as any] =
          `Child ${index + 1} name is required.`;
      }
      if (!child.total_contribution_planned.trim()) {
        newErrors[`child_total_${index}` as any] =
          `Child ${index + 1} total planned amount is required.`;
      }
      if (!child.monthly_contribution.trim()) {
        newErrors[`child_monthly_${index}` as any] =
          `Child ${index + 1} monthly contribution is required.`;
      }
    });
  }

  if (form.bought_home && form.pay_off_home) {
    if (!form.mortgage_remaining.trim()) {
      newErrors.mortgage_remaining = "Please enter remaining mortgage amount.";
    } else {
      const val = Number(form.mortgage_remaining);
      if (isNaN(val) || val < 0) {
        newErrors.mortgage_remaining = "Mortgage amount cannot be negative.";
      }
    }
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!userId) return;

    if (!validateForm()) {
      return;
    }

    // Save main form
    await saveFinance(userId, {
      user_id: userId,
      emergency_savings: form.emergency_savings,
      emergency_savings_amount: form.emergency_savings_amount || null,

      has_debt: form.has_debt,
      debt_amount: form.debt_amount || null,

      full_emergency_fund: form.full_emergency_fund,
      full_emergency_fund_amount: form.full_emergency_fund_amount || null,

      retirement_investing: form.retirement_investing,
      retirement_savings_amount: form.retirement_savings_amount || null,

      has_children: form.has_children,
      children_count: form.children_count,

      bought_home: form.bought_home,
      pay_off_home: form.pay_off_home,
      mortgage_remaining: form.mortgage_remaining || null,
    });

    // Save children UPSERT
    for (const c of children) {
      const payload = {
        user_id: userId,
        child_name: c.child_name || "",
        parent_name: username,
        total_contribution_planned: c.total_contribution_planned || "0",
        has_total_contribution: c.has_total_contribution || false,
        monthly_contribution: c.monthly_contribution || "0",
      };

      if (c.child_id) {
        // UPDATE existing child
        await childrenService.updateChild(c.child_id, payload);
      } else {
        // CREATE new child
        const created = await childrenService.createChild(payload);

        // API returns child_id, NOT id
        c.child_id = created.child_id;
      }
    }

    alert("Progress saved successfully!");
    window.location.href = "/milestones";
  };

  return (
    <>
      <Navbar />
      <div className="finance-wrapper container py-4">
        <h2 className="mb-3">Dave Ramsey&apos;s Seven Baby Steps</h2>
        <p className="text-muted mb-4">Answer the questions below.</p>

        {/* Readonly User Info */}
        <div className="readonly-info mb-4 p-3 border rounded bg-light">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-semibold">User Name</label>
              <input
                type="text"
                className="form-control"
                value={profile?.username || ""}
                readOnly
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-semibold">Salary</label>
              <input
                type="text"
                className="form-control"
                value={
                  profile?.salary
                    ? `$${Number(profile.salary).toLocaleString()}`
                    : ""
                }
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        {/* STEP 1 */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(1)}>
            <span>Step 1 – Starter Emergency Fund</span>
            <span>{openStep.includes(1) ? "−" : "+"}</span>
          </div>
          {openStep.includes(1) && (
            <div className="step-body">
              <label>
                Do you have an emergency fund?
                <span className="required-star">*</span>
              </label>
              <br />
              <button
                onClick={() => handleRadio("emergency_savings", true)}
                className={
                  form.emergency_savings
                    ? "btn btn-primary me-2"
                    : "btn btn-light me-2"
                }
              >
                Yes
              </button>
              <button
                onClick={() => handleRadio("emergency_savings", false)}
                className={
                  !form.emergency_savings
                    ? "btn btn-primary"
                    : "btn btn-light"
                }
              >
                No
              </button>

              {form.emergency_savings && (
                <div className="mt-3">
                  <label>
                    How much? <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Enter amount between 0 and 1000"
                    min={0}
                    max={1000}
                    value={form.emergency_savings_amount}
                    onChange={(e) =>
                      handleInput("emergency_savings_amount", e.target.value)
                    }
                  />
                  {errors.emergency_savings_amount && (
                    <div className="error-text mt-1">
                      {errors.emergency_savings_amount}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(2)}>
            <span>Step 2 – Pay Off All Debt (Except Mortgage)</span>
            <span>{openStep.includes(2) ? "−" : "+"}</span>
          </div>

          {openStep.includes(2) && (
            <div className="step-body">
              <label>Do you have debt?
                <span className="required-star">*</span>
              </label>
              <br />
              <button
                onClick={() => handleRadio("has_debt", true)}
                className={
                  form.has_debt ? "btn btn-primary" : "btn btn-light"
                }
              >
                Yes
              </button>
              <button
                onClick={() => handleRadio("has_debt", false)}
                className={
                  !form.has_debt ? "btn btn-primary" : "btn btn-light"
                }
              >
                No
              </button>

              {form.has_debt && (
                <div className="mt-3">
                  <label>Total Debt Amount
                    <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={form.debt_amount}
                    type="number"
                    min={0}
                    placeholder="Enter the debt amount"
                    onChange={(e) =>
                      handleInput("debt_amount", e.target.value)
                    }
                  />
                  {errors.debt_amount && (
                    <div className="error-text mt-1">
                      {errors.debt_amount}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 3 */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(3)}>
            <span>Step 3 – 3–6 Months Emergency Fund</span>
            <span>{openStep.includes(3) ? "−" : "+"}</span>
          </div>
          {openStep.includes(3) && (
            <div className="step-body">
              <label>
                Do you have a full emergency fund?
                <span className="required-star">*</span>
              </label>
              <br />
              <button
                onClick={() => handleRadio("full_emergency_fund", true)}
                className={
                  form.full_emergency_fund
                    ? "btn btn-primary me-2"
                    : "btn btn-light me-2"
                }
              >
                Yes
              </button>
              <button
                onClick={() => handleRadio("full_emergency_fund", false)}
                className={
                  !form.full_emergency_fund
                    ? "btn btn-primary"
                    : "btn btn-light"
                }
              >
                No
              </button>

              {form.full_emergency_fund && (
                <div className="mt-3">
                  <label>
                    How much?
                    <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    min={0}
                    max={Number(profile?.salary) / 2}
                    placeholder="Enter amount up to 6 months of Salary"
                    value={form.full_emergency_fund_amount}
                    onChange={(e) =>
                      handleInput("full_emergency_fund_amount", e.target.value)
                    }
                  />
                  {errors.full_emergency_fund_amount && (
                    <div className="error-text mt-1">
                      {errors.full_emergency_fund_amount}
                    </div>
                  )}
                </div>)}
            </div>)}
        </div>

        {/* STEP 4 */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(4)}>
            <span>Step 4 – Invest 15% for Retirement</span>
            <span>{openStep.includes(4) ? "−" : "+"}</span>
          </div>

          {openStep.includes(4) && (
            <div className="step-body">
              <label>Are you investing?
                <span className="required-star">*</span>
              </label>
              <br />
              <button
                onClick={() => handleRadio("retirement_investing", true)}
                className={
                  form.retirement_investing
                    ? "btn btn-primary"
                    : "btn btn-light"
                }
              >
                Yes
              </button>
              <button
                onClick={() => handleRadio("retirement_investing", false)}
                className={
                  !form.retirement_investing
                    ? "btn btn-primary"
                    : "btn btn-light"
                }
              >
                No
              </button>

              {form.retirement_investing && (
                <div className="mt-3">
                  <label>How much monthly?
                    <span className="required-star">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={form.retirement_savings_amount}
                    type="number"
                    min={1}
                    placeholder="Enter monthly investment amount"
                    onChange={(e) =>
                      handleInput(
                        "retirement_savings_amount",
                        e.target.value
                      )
                    }
                  />
                  {errors.retirement_savings_amount && (
                    <div className="error-text mt-1">
                      {errors.retirement_savings_amount}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 5 (Children) */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(5)}>
            <span>Step 5 – College Funding for Children</span>
            <span>{openStep.includes(5) ? "−" : "+"}</span>
          </div>

          {openStep.includes(5) && (
            <div className="step-body">
              <label>Do you have children?
                <span className="required-star">*</span>
              </label>
              <br />
              <button
                onClick={() => handleRadio("has_children", true)}
                className={
                  form.has_children ? "btn btn-primary" : "btn btn-light"
                }
              >
                Yes
              </button>
              <button
                onClick={() => handleRadio("has_children", false)}
                className={
                  !form.has_children ? "btn btn-primary" : "btn btn-light"
                }
              >
                No
              </button>

              {form.has_children && (
                <>
                  <div className="mt-3">
                    <label>How many children?
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.children_count}
                      onChange={(e) =>
                        handleInput(
                          "children_count",
                          Number(e.target.value)
                        )
                      }
                    />
                    {errors.children_count && (
                      <div className="error-text mt-1">
                        {errors.children_count}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    {children.slice(0, form.children_count).map((child, i) => (
                      <div key={i} className="child-card mb-3 p-3 border rounded">
                        <h6>Child {i + 1}</h6>

                        <label>Name
                          <span className="required-star">*</span>
                        </label>
                        <input
                          className="form-control"
                          value={child.child_name}
                          onChange={(e) =>
                            updateChild(i, "child_name", e.target.value)
                          }
                        />
                        {errors[`child_name_${i}` as any] && (
                          <div className="error-text mt-1">
                            {errors[`child_name_${i}` as any]}
                          </div>
                        )}

                        <label className="mt-2">Total Planned
                          <span className="required-star">*</span>
                        </label>
                        <input
                          className="form-control"
                          value={child.total_contribution_planned}
                          onChange={(e) =>
                            updateChild(
                              i,
                              "total_contribution_planned",
                              e.target.value
                            )
                          }
                        />
                        {errors[`child_total_${i}` as any] && (
                          <div className="error-text mt-1">
                            {errors[`child_total_${i}` as any]}
                          </div>
                        )}

                        <label className="mt-2">Did you contribute as planned?
                          <span className="required-star">*</span>
                        </label>
                        <br />
                        <button
                          onClick={() =>
                            updateChild(i, "has_total_contribution", true)
                          }
                          className={
                            child.has_total_contribution
                              ? "btn btn-primary me-2"
                              : "btn btn-light me-2"
                          }
                        >
                          Yes
                        </button>
                        <button
                          onClick={() =>
                            updateChild(i, "has_total_contribution", false)
                          }
                          className={
                            !child.has_total_contribution
                              ? "btn btn-primary"
                              : "btn btn-light"
                          }
                        >
                          No
                        </button>
                        <br />
                        {!child.has_total_contribution && (
                          <div className="mt-3">
                            <label>Monthly Contribution
                              <span className="required-star">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={child.monthly_contribution}
                              onChange={(e) =>
                                updateChild(
                                  i,
                                  "monthly_contribution",
                                  e.target.value
                                )
                              }
                            />
                            {errors[`child_monthly_${i}` as any] && (
                              <div className="error-text mt-1">
                                {errors[`child_monthly_${i}` as any]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* STEP 6 */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(6)}>
            <span>Step 6 – Pay Off Home Early</span>
            <span>{openStep.includes(6) ? "−" : "+"}</span>
          </div>

          {openStep.includes(6) && (
            <div className="step-body">
              <label>Do you own a home?
                <span className="required-star">*</span>
              </label>
              <br />
              <button
                onClick={() => handleRadio("bought_home", true)}
                className={
                  form.bought_home ? "btn btn-primary" : "btn btn-light"
                }
              >
                Yes
              </button>
              <button
                onClick={() => handleRadio("bought_home", false)}
                className={
                  !form.bought_home ? "btn btn-primary" : "btn btn-light"
                }
              >
                No
              </button>
              <br />
              {form.bought_home && (
                <>
                  <label className="mt-3">Are you paying off your home?
                    <span className="required-star">*</span>
                  </label>
                  <br />
                  <button
                    onClick={() => handleRadio("pay_off_home", true)}
                    className={
                      form.pay_off_home
                        ? "btn btn-primary"
                        : "btn btn-light"
                    }
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleRadio("pay_off_home", false)}
                    className={
                      !form.pay_off_home
                        ? "btn btn-primary"
                        : "btn btn-light"
                    }
                  >
                    No
                  </button>

                  {!form.pay_off_home && (
                    <div className="mt-3">
                      <label>Remaining Mortgage
                        <span className="required-star">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        min={0}
                        placeholder="Enter the remaining mortgage"
                        value={form.mortgage_remaining}
                        onChange={(e) =>
                          handleInput("mortgage_remaining", e.target.value)
                        }
                      />
                      {errors.mortgage_remaining && (
                        <div className="error-text mt-1">
                          {errors.mortgage_remaining}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* SAVE BUTTON */}
        <div className="text-center mt-4">
          <button className="btn btn-primary px-4 py-2" onClick={handleSave}>
            Calculate Baby Steps Milestones
          </button>
        </div>
      </div>
    </>
  );
};

export default FinanceFormPage;
