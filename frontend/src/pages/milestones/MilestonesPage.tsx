// src/pages/finance/MilestonesPage.tsx
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useProfileContext } from "../../contexts/ProfileContext";
import { financeService } from "../../services/finance.service";
import { childrenService } from "../../services/children.service";
import "./MilestonesPage.scss";

const MilestonesPage: React.FC = () => {
  const { user } = useAuthContext();
  const { profile } = useProfileContext();
  const userId = user?.user_id ?? Number(localStorage.getItem("user_id"));

  const [response, setResponse] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [status, setStatus] = useState<boolean[]>([]);

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
  }, [response, children]);

  // ---------------------------
  //      STEP 1 LOGIC
  // ---------------------------
  const step1 = () => {
    if (!response.emergency_savings) return false;

    const amt = Number(response.emergency_savings_amount);
    if (amt === 1000) return true;
    return false;
  };

  // ---------------------------
  //      STEP 2 LOGIC
  // ---------------------------
  const step2 = () => {
    if (!response.has_debt) return true;

    const debt = Number(response.debt_amount);
    return debt === 0;
  };

  // ---------------------------
  //      STEP 3 LOGIC
  // ---------------------------
  const step3 = () => {
    if (!response.full_emergency_fund) return false;

    const required = Number(profile?.salary) / 2;
    return Number(response.full_emergency_fund_amount) === required;
  };

  // ---------------------------
  //      STEP 4 LOGIC
  // ---------------------------
  const step4 = () => {
    if (!response.retirement_investing) return false;

    const required = (Number(profile?.salary) * 0.15) / 12;
    return Number(response.retirement_savings_amount) === required;
  };

  // ---------------------------
  //      STEP 5 LOGIC
  // ---------------------------
  const step5 = () => {
    if (!response.has_children) return true;

    if (response.children_count <= 0) return false;

    return children
      .slice(0, response.children_count)
      .every((c: any) => Number(c.total_contribution_planned) > 0);
  };

  // ---------------------------
  //      STEP 6 LOGIC
  // ---------------------------
  const step6 = () => {
    if (!response.bought_home) return false;

    if (!response.pay_off_home) return false;

    return Number(response.mortgage_remaining) === 0;
  };

  const milestones = [
    { title: "Step-1 Starter Emergency Fund: Save $1,000" },
    { title: "Step-2 Debt Snowball: Pay off all non-mortgage debt" },
    { title: "Step-3 Full Emergency Fund: Save 3–6 months of expenses" },
    { title: "Step-4 Invest for Retirement: Invest 15% of your income" },
    { title: "Step-5 College Fund: Save for your children’s education" },
    { title: "Step-6 Pay Off Home: Eliminate your mortgage early" }
  ];

  const allDone = status.length === 6 && status.every(Boolean);

  return (
    <div className="milestones-page">
      <div className="card shadow-sm p-4">
        <h2 className="h4 mb-4">Dave Ramsey’s Seven Baby Steps</h2>

        {milestones.map((m, i) => (
          <div className="milestone-card" key={i}>
            <span className="status-icon">{status[i] ? "✔️" : "❌"}</span>
            <p className="fw-semibold mb-1">{m.title}</p>
          </div>
        ))}

        {allDone && (
          <div className="mt-4 text-success fw-bold">
            🎉 Congratulations, you have completed all milestones!
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestonesPage;
