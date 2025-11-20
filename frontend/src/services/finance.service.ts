import { apiClient } from "./apiClient";
import type { UserResponse } from "../generated/api-client";

export const financeService = {
  async getResponseForUser(userId: number): Promise<UserResponse | null> {
    const res = await apiClient.api.userResponsesList();
    const all = res.data ?? [];
    const existing = all.find((r) => r.user_id === userId) ?? null;
    return existing;
  },

  async saveResponseForUser(
    userId: number,
    payload: Partial<UserResponse>
  ): Promise<UserResponse> {
    // If we already know the response_id, update directly
    if (payload.response_id) {
      const res = await apiClient.api.userResponsesUpdate(
        { responseId: payload.response_id },
        payload as UserResponse
      );
      return res.data;
    }

    // Otherwise, check if one exists for this user
    const existing = await this.getResponseForUser(userId);
    if (existing) {
      const res = await apiClient.api.userResponsesUpdate(
        { responseId: existing.response_id },
        { ...existing, ...payload } as UserResponse
      );
      return res.data;
    }

    // Create new
    const createBody: UserResponse = {
      user_id: userId,
      response_id: 0 as any, // backend will assign
      salary_confirmed: payload.salary_confirmed ?? false,
      emergency_savings: payload.emergency_savings ?? false,
      emergency_savings_amount: payload.emergency_savings_amount ?? null,
      has_debt: payload.has_debt ?? false,
      debt_amount: payload.debt_amount ?? null,
      retirement_investing: payload.retirement_investing ?? false,
      retirement_savings_amount: payload.retirement_savings_amount ?? null,
      has_children: payload.has_children ?? false,
      children_count: payload.children_count ?? null,
      bought_home: payload.bought_home ?? false,
      pay_off_home: payload.pay_off_home ?? false,
      mortgage_remaining: payload.mortgage_remaining ?? null,
      submitted_at: payload.submitted_at ?? new Date().toISOString(),
      user_username: (payload as any).user_username ?? "",
    };

    const res = await apiClient.api.userResponsesCreate(createBody);
    return res.data;
  },

  async getMilestonesStatus() {
    const res = await apiClient.api.userResponsesMilestonesStatusRetrieve();
    return res.data;
  },
};
