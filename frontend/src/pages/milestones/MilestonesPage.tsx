import React from "react";
import "./MilestonesPage.scss";

const MilestonesPage: React.FC = () => {
  const milestones = [
    { id: 1, title: "Baby Step 1", desc: "Save $1,000 for starter emergency fund" },
    { id: 2, title: "Baby Step 2", desc: "Pay off all debt (except house)" },
    { id: 3, title: "Baby Step 3", desc: "3–6 months of expenses in savings" },
    { id: 4, title: "Baby Step 4", desc: "Invest 15% of household income for retirement" },
    { id: 5, title: "Baby Step 5", desc: "Save for children’s college fund" },
    { id: 6, title: "Baby Step 6", desc: "Pay off your home early" },
    { id: 7, title: "Baby Step 7", desc: "Build wealth and give generously" },
  ];

  return (
    <div className="milestones-page">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h4 mb-3">Milestones</h1>
          {milestones.map(m => (
            <div key={m.id} className="milestone-card">
              <h2 className="h6 mb-1">{m.title}</h2>
              <p className="text-muted mb-0">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestonesPage;
