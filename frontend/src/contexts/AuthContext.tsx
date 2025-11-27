import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  PropsWithChildren,
} from "react";
import {
  authService,
  type LoginPayload,
  type LoginResult,
} from "../services/auth.service";
import type { User } from "../generated/api-client";
import { useFinanceContext } from "./FinanceContext";
import { useProfileContext } from "./ProfileContext";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { resetProfile } = useProfileContext();
  const { resetFinance } = useFinanceContext();

  /* -----------------------------------------
   * LOGIN
   ----------------------------------------- */
  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const result: LoginResult = await authService.login(payload);

      // Save tokens
      if (result.access) {
        localStorage.setItem("access", result.access);
        setAccessToken(result.access);
      }
      if (result.refresh) {
        localStorage.setItem("refresh", result.refresh);
      }

      // Save user
      if (result.user) {
        localStorage.setItem("user_id", String(result.user.user_id));
        setUser(result.user);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* -----------------------------------------
   * LOGOUT
   ----------------------------------------- */
  const logout = useCallback(() => {
    authService.logout();

    setUser(null);
    setAccessToken(null);
    resetProfile();
    resetFinance();

    localStorage.clear();
  }, [resetFinance, resetProfile]);

  /* -----------------------------------------
   * INITIAL APP LOAD (on refresh)
   ----------------------------------------- */
  useEffect(() => {
    const storedAccess = localStorage.getItem("access");
    const storedUserId = localStorage.getItem("user_id");

    if (storedAccess) {
      setAccessToken(storedAccess);
    }

    if (storedUserId) {
      // Let ProfileContext fetch real user, no fake data
      setUser({ user_id: Number(storedUserId) } as User);
    }

    setLoading(false);
  }, []);

  /* -----------------------------------------
   * MEMOIZED CONTEXT VALUE
   ----------------------------------------- */
  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(accessToken && user),
    }),
    [user, accessToken, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
};
