import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="row g-4">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5">Welcome to your Personal Finance Manager</h2>
            <p className="text-muted">
              Track expenses, follow Dave Ramsey&apos;s Baby Steps, and reach your
              financial milestones with a guided dashboard.
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h6">Quick links</h2>
            <ul className="list-unstyled mb-0">
              <li>• Update your profile details</li>
              <li>• Capture today&apos;s expenses</li>
              <li>• Review Baby Step progress</li>
              <li>• Check your milestones status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
