// src/App.tsx
import React from "react";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { FinanceProvider } from "./contexts/FinanceContext";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar/Navbar";

const AppShell: React.FC = () => {
  const { loading, isAuthenticated } = useAuthContext();

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <main className="app-content container py-5 my-5">
        <AppRoutes />
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ProfileProvider>
      <FinanceProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </FinanceProvider>
    </ProfileProvider>
  );
};

export default App;
