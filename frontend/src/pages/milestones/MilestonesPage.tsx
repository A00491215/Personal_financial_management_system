// src/pages/finance/MilestonesPage.tsx
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useProfileContext } from "../../contexts/ProfileContext";
import { financeService } from "../../services/finance.service";
import { childrenService } from "../../services/children.service";
import { useNavigate, useLocation } from "react-router-dom";
import "./MilestonesPage.scss";

const MilestonesPage: React.FC = () => {
  const { user } = useAuthContext();
  const { profile } = useProfileContext();
  const navigate = useNavigate();
  const userId = user?.user_id ?? Number(localStorage.getItem("user_id"));

  const [response, setResponse] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [status, setStatus] = useState<boolean[]>([]);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const completed = status.filter(Boolean).length;
  const percentage = Math.round((completed / 6) * 100);
  const location = useLocation();
  const fromFinance = location.state?.fromFinance === true;


  // Fetch finance + children
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const finance = await financeService.getResponseForUser(userId);
      const kids = await childrenService.getChildren(userId);

      setResponse(finance);
      setChildren(kids);
    };

    fetchData();
  }, [userId]);

  // Evaluate milestones
  useEffect(() => {
    if (!response) return;

    const evaluate = () => {
      const s1 = step1();
      const s2 = step2();
      const s3 = step3();
      const s4 = step4();
      const s5 = step5();
      const s6 = step6();

      setStatus([s1, s2, s3, s4, s5, s6]);
    };

    evaluate();
  }, [response, children, profile]);

  // Send email once when all milestones are completed & user came from Finance
useEffect(() => {
  if (!userId) return;
  if (!fromFinance) return; // only trigger automatically when coming from Finance page
  if (emailSent) return; // avoid duplicate emails

  const completedSteps = status.filter(Boolean).length;

  if (completedSteps === 6) {
    const sendEmail = async () => {
      try {
        await financeService.sendMilestoneCompletionEmail(userId);
        setEmailSent(true);
      } catch (error) {
        console.error("Failed to send milestone completion email:", error);
      }
    };

    sendEmail();
  }
}, [status, userId, fromFinance, emailSent]); // ✅ NEW effect


  // ---------------- STEP LOGIC ----------------
  const step1 = () => {
    if (!response.emergency_savings) return false;
    return Number(response.emergency_savings_amount) === 1000;
  };

  const step2 = () => {
    if (!response.has_debt) return true;
    return Number(response.debt_amount) === 0;
  };

  const step3 = () => {
    if (!response.full_emergency_fund) return false;
    const required = Number(profile?.salary) / 2;
    return Number(response.full_emergency_fund_amount) === required;
  };

  const step4 = () => {
    if (!response.retirement_investing) return false;
    const required = (Number(profile?.salary) * 0.15) / 12;
    return Number(response.retirement_savings_amount) === required;
  };

  const step5 = () => {
    if (!response.has_children) return true;
    if (response.children_count <= 0) return false;

    return children
      .slice(0, response.children_count)
      .every((c: any) => Number(c.total_contribution_planned) > 0);
  };

  const step6 = () => {
    if (!response.bought_home) return false;

    if (response.bought_home && response.pay_off_home) return true;

    if (response.bought_home && !response.pay_off_home) {
      return Number(response.mortgage_remaining) === 0;
    }

    return false;
  };

  const milestones = [
    { title: "Step-1 Starter Emergency Fund: Save $1,000" },
    { title: "Step-2 Debt Snowball: Pay off all non-mortgage debt" },
    { title: "Step-3 Full Emergency Fund: Save 3–6 months of expenses" },
    { title: "Step-4 Invest for Retirement: Invest 15% of your income" },
    { title: "Step-5 College Fund: Save for your children’s education" },
    { title: "Step-6 Pay Off Home: Eliminate your mortgage early" }
  ];

  const allDone = completed === 6;

  return (
    <div className="milestones-page">
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 mb-0">Dave Ramsey’s Seven Baby Steps</h2>

          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/finance")}
          >
            Edit Responses
          </button>
        </div>

        {/* ---------------- PROGRESS BAR ---------------- */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <strong>{percentage}% Completed</strong>
            <span>{completed} of 6 steps completed</span>
          </div>

          <div className="progress" style={{ height: "12px" }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{
                width: `${percentage}%`,
                transition: "width 0.8s ease"
              }}
            ></div>
          </div>
        </div>

        {/* ---------------- STEP LIST ---------------- */}
        {milestones.map((m, i) => (
          <div className="milestone-card" key={i}>
            <span className="status-icon">
              {status[i] ? (
                <i className="bi bi-check-circle-fill text-success"></i>
              ) : (
                <i className="bi bi-x-circle-fill text-danger"></i>
              )}
            </span>
            <p className="fw-semibold mb-1">{m.title}</p>
          </div>
        ))}

        {/* -------- WHEN ALL STEPS COMPLETED -------- */}
        {allDone && (
  <div className="mt-4 p-3 rounded bg-light border text-success fw-semibold">
    🎉 Congratulations, you have completed all milestones!
    <br />
    <br />

    {emailSent && ( // ✅ changed from fromFinance to emailSent
      <>
        📩 An email has been sent to{" "}
        <strong>{profile?.email}</strong> congratulating you on
        completing all milestones.
        <hr />
      </>
    )}

    <strong>Next Step (Step-7): Build Wealth & Give</strong>
    <br />
    <span className="text-dark">
      Achieve financial freedom, grow your wealth, and give generously
      to others.
    </span>
  </div>
)}


        {/* -------- WHEN NOT COMPLETED -------- */}
        {!allDone && (
          <div className="mt-4 p-3 rounded bg-light border text-primary fw-semibold">
            💡 You’re doing great! Keep going and complete all milestones to reach financial freedom.
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestonesPage;
