import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import { profileService } from "../services/profile.service";
import type { User, PatchedUser } from "../generated/api-client";

interface ProfileContextValue {
  profile: User | null;
  loading: boolean;
  fetchProfile: (userId: number) => Promise<void>;
  updateProfile: (userId: number, data: Partial<PatchedUser>) => Promise<void>;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      const data = await profileService.getProfile(userId);
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (userId: number, data: Partial<PatchedUser>) => {
      setLoading(true);
      try {
        const updated = await profileService.updateProfile(userId, data);
        setProfile(updated);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetProfile = useCallback(() => {
    setProfile(null);
  }, []);


  /** 🔥 AUTO-LOAD PROFILE AFTER REFRESH */
  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId && !profile && !loading) {
      fetchProfile(Number(storedId));
    }
  }, []);

  const value = useMemo(
    () => ({ profile, loading, fetchProfile, updateProfile, resetProfile }),
    [profile, loading, fetchProfile, updateProfile, resetProfile]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfileContext must be used within ProfileProvider");
  return ctx;
};
