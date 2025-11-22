import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useProfileContext } from "../../../contexts/ProfileContext";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { profile, loading: profileLoading } = useProfileContext();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Hide navbar fully when logged out
  if (!user) return null;

  // Wait for profile load
  if (profileLoading || !profile) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = (path: string, current: string) =>
  "nav-item" + (current === path ? " active" : "");

  return (
    <nav className="pfm-navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="brand">
          PFM
        </Link>

        <Link to="/dashboard" className={navClass("/dashboard", currentPath)}>
          Dashboard
        </Link>

        <Link to="/expenses" className={navClass("/expenses", currentPath)}>
          Daily Expenses
        </Link>

        <Link to="/finance" className={navClass("/finance", currentPath)}>
          Seven Baby Steps
        </Link>

        <Link to="/milestones" className={navClass("/milestones", currentPath)}>
          Milestones
        </Link>

        <Link to="/profile" className={navClass("/profile", currentPath)}>
          Profile
        </Link>
      </div>

      <div className="navbar-right">
        <span className="username">{profile.username}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
