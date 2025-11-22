import { apiClient } from "./apiClient";
import type { User, PatchedUser } from "../generated/api-client";

export const profileService = {
  async getProfile(userId: number): Promise<User> {
    const res = await apiClient.api.usersRetrieve({ userId });
    return res.data;
  },

  async updateProfile(userId: number, payload: Partial<PatchedUser>): Promise<User> {
    const res = await apiClient.api.usersPartialUpdate({ userId }, payload as PatchedUser);
    return res.data;
  },
};
