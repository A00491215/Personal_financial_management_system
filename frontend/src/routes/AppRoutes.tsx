import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import FinanceFormPage from "../pages/finance/FinanceFormPage";
import MilestonesPage from "../pages/milestones/MilestonesPage";
import ExpensesPage from "../pages/expenses/ExpensesPage";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/finance" element={<FinanceFormPage />} />
        <Route path="/milestones" element={<MilestonesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
