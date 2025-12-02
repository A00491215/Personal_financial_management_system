import React from "react";
import "./SplashScreen.scss";

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-container">
      <div className="splash-card">
        <div className="spinner" />
        <h2 className="splash-title">Loading your dashboard…</h2>
      </div>
    </div>
  );
};

export default SplashScreen;
