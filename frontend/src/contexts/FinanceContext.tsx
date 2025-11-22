import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useCallback,
  useMemo,
} from "react";
import { financeService } from "../services/finance.service";
import type { UserResponse } from "../generated/api-client";

interface FinanceContextValue {
  response: UserResponse | null;
  loading: boolean;
  loadFinance: (userId: number) => Promise<void>;
  saveFinance: (userId: number, updates: Partial<UserResponse>) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export const FinanceProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [response, setResponse] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Stable API loader
  const loadFinance = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      const data = await financeService.getResponseForUser(userId);
      setResponse(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 Stable finance updater
  const saveFinance = useCallback(
    async (userId: number, updates: Partial<UserResponse>) => {
      setLoading(true);
      try {
        const base = response ?? ({} as UserResponse);
        const merged = {
          ...base,
          ...updates,
          user_id: userId,
        };
        const saved = await financeService.saveResponseForUser(userId, merged);
        setResponse(saved);
      } finally {
        setLoading(false);
      }
    },
    [response]
  );

  const value = useMemo(
    () => ({ response, loading, loadFinance, saveFinance }),
    [response, loading, loadFinance, saveFinance]
  );

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinanceContext = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinanceContext must be used within FinanceProvider");
  return ctx;
};
