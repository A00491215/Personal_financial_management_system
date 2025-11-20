// src/pages/finance/FinanceFormPage.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar/Navbar";

import { useAuthContext } from "../../contexts/AuthContext";
import { useProfileContext } from "../../contexts/ProfileContext";
import { useFinanceContext } from "../../contexts/FinanceContext";

import { childrenService } from "../../services/children.service";
import type { ChildrenContribution } from "../../generated/api-client";

import "./FinanceFormPage.scss";

/* ----------------------------------------------
 * UI INTERFACES
 * ---------------------------------------------- */
interface FinanceFormUI {
  emergency_savings: boolean;
  emergency_savings_amount: string;

  full_emergency_fund: boolean;
  full_emergency_fund_amount: string;

  has_debt: boolean;
  debt_amount: string;

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
  monthly_contribution: string;
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

  /* ----------------------------------------------
   * LOCAL STATE: FINANCE FORM
   * ---------------------------------------------- */
  const [form, setForm] = useState<FinanceFormUI>({
    emergency_savings: false,
    emergency_savings_amount: "",

    full_emergency_fund: false,
    full_emergency_fund_amount: "",

    has_debt: false,
    debt_amount: "",

    retirement_investing: false,
    retirement_savings_amount: "",

    has_children: false,
    children_count: 0,

    bought_home: false,
    pay_off_home: false,
    mortgage_remaining: "",
  });

  /* ----------------------------------------------
   * CHILDREN STATE
   * ---------------------------------------------- */
  const [children, setChildren] = useState<ChildContributionUI[]>([]);

  /* ----------------------------------------------
   * EXPANDED ACCORDIONS
   * ---------------------------------------------- */
  const [openStep, setOpenStep] = useState<number | null>(null);
  const toggleStep = (n: number) => {
    setOpenStep((prev) => (prev === n ? null : n));
  };

  /* ----------------------------------------------
   * LOAD DATA ON MOUNT
   * ---------------------------------------------- */
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

      full_emergency_fund: response.salary_confirmed ?? false,
      full_emergency_fund_amount:
        response.retirement_savings_amount?.toString() || "",

      has_debt: response.has_debt ?? false,
      debt_amount: response.debt_amount?.toString() || "",

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

  /* ----------------------------------------------
   * HANDLERS
   * ---------------------------------------------- */
  const handleRadio = <K extends keyof FinanceFormUI>(
    field: K,
    value: boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInput = <K extends keyof FinanceFormUI>(
    field: K,
    value: FinanceFormUI[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  /* ----------------------------------------------
   * SAVE: MAIN + CHILDREN UPSERT
   * ---------------------------------------------- */
  const handleSave = async () => {
    if (!userId) return;

    // Save main form
    await saveFinance(userId, {
      user_id: userId,
      emergency_savings: form.emergency_savings,
      emergency_savings_amount: form.emergency_savings_amount || null,

      salary_confirmed: form.full_emergency_fund,
      retirement_savings_amount: form.full_emergency_fund_amount || null,

      has_debt: form.has_debt,
      debt_amount: form.debt_amount || null,

      retirement_investing: form.retirement_investing,

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
  };

  /* ----------------------------------------------
   * RENDER UI
   * ---------------------------------------------- */
  return (
    <>
      <Navbar />

      <div className="finance-wrapper container py-4">
        <h2 className="mb-3">Dave Ramsey's Seven Baby Steps</h2>
        <p className="text-muted mb-4">
          Answer the questions below to track your progress.
        </p>

        {/* ----------------------------------
         * STEP 1
         ---------------------------------- */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(1)}>
            <span>Step 1 – Starter Emergency Fund</span>
            <span>{openStep === 1 ? "−" : "+"}</span>
          </div>

          {openStep === 1 && (
            <div className="step-body">
              <label>Do you have an emergency fund?</label>
              <br />
              <button
                onClick={() => handleRadio("emergency_savings", true)}
                className={
                  form.emergency_savings ? "btn btn-primary" : "btn btn-light"
                }
              >
                Yes
              </button>
              <button
                onClick={() => handleRadio("emergency_savings", false)}
                className={
                  !form.emergency_savings ? "btn btn-primary" : "btn btn-light"
                }
              >
                No
              </button>

              {form.emergency_savings && (
                <div className="mt-3">
                  <label>How much?</label>
                  <input
                    className="form-control"
                    value={form.emergency_savings_amount}
                    onChange={(e) =>
                      handleInput("emergency_savings_amount", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------
         * STEP 2
         ---------------------------------- */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(2)}>
            <span>Step 2 – 3–6 Months Emergency Fund</span>
            <span>{openStep === 2 ? "−" : "+"}</span>
          </div>

          {openStep === 2 && (
            <div className="step-body">
              <label>Do you have a full emergency fund?</label>
              <br />
              <button
                onClick={() => handleRadio("full_emergency_fund", true)}
                className={
                  form.full_emergency_fund
                    ? "btn btn-primary"
                    : "btn btn-light"
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
                  <label>How much?</label>
                  <input
                    className="form-control"
                    value={form.full_emergency_fund_amount}
                    onChange={(e) =>
                      handleInput("full_emergency_fund_amount", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------
         * STEP 3
         ---------------------------------- */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(3)}>
            <span>Step 3 – Pay Off All Debt (Except Mortgage)</span>
            <span>{openStep === 3 ? "−" : "+"}</span>
          </div>

          {openStep === 3 && (
            <div className="step-body">
              <label>Do you have debt?</label>
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
                  <label>Total Debt Amount</label>
                  <input
                    className="form-control"
                    value={form.debt_amount}
                    onChange={(e) =>
                      handleInput("debt_amount", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------
         * STEP 4
         ---------------------------------- */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(4)}>
            <span>Step 4 – Invest 15% for Retirement</span>
            <span>{openStep === 4 ? "−" : "+"}</span>
          </div>

          {openStep === 4 && (
            <div className="step-body">
              <label>Are you investing?</label>
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
                  <label>How much monthly?</label>
                  <input
                    className="form-control"
                    value={form.retirement_savings_amount}
                    onChange={(e) =>
                      handleInput(
                        "retirement_savings_amount",
                        e.target.value
                      )
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------
         * STEP 5 (Children)
         ---------------------------------- */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(5)}>
            <span>Step 5 – College Funding for Children</span>
            <span>{openStep === 5 ? "−" : "+"}</span>
          </div>

          {openStep === 5 && (
            <div className="step-body">
              <label>Do you have children?</label>
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
                    <label>How many children?</label>
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
                  </div>

                  <div className="mt-4">
                    {children.slice(0, form.children_count).map((child, i) => (
                      <div key={i} className="child-card mb-3 p-3 border rounded">
                        <h6>Child {i + 1}</h6>

                        <label>Name</label>
                        <input
                          className="form-control"
                          value={child.child_name}
                          onChange={(e) =>
                            updateChild(i, "child_name", e.target.value)
                          }
                        />

                        <label className="mt-2">Total Planned</label>
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

                        <label className="mt-2">Monthly Contribution</label>
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
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------
         * STEP 6
         ---------------------------------- */}
        <div className="step-card">
          <div className="step-header" onClick={() => toggleStep(6)}>
            <span>Step 6 – Pay Off Home Early</span>
            <span>{openStep === 6 ? "−" : "+"}</span>
          </div>

          {openStep === 6 && (
            <div className="step-body">
              <label>Do you own a home?</label>
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

              {form.bought_home && (
                <>
                  <label className="mt-3">Are you paying off your home?</label>
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

                  {form.pay_off_home && (
                    <div className="mt-3">
                      <label>Remaining Mortgage</label>
                      <input
                        className="form-control"
                        value={form.mortgage_remaining}
                        onChange={(e) =>
                          handleInput("mortgage_remaining", e.target.value)
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------
         * SAVE BUTTON
         ---------------------------------- */}
        <div className="text-center mt-4">
          <button className="btn btn-primary px-4 py-2" onClick={handleSave}>
            Save Baby Steps Progress
          </button>
        </div>
      </div>
    </>
  );
};

export default FinanceFormPage;
