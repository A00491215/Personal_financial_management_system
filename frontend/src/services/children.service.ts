// services/children.service.ts
import { apiClient } from "./apiClient";
import type { ChildrenContribution, PatchedChildrenContribution } from "../generated/api-client";

export const childrenService = {
  /** Get all children for a user */
  async getChildren(userId: number): Promise<ChildrenContribution[]> {
    const res = await apiClient.api.childrenContributionsList({
      user_id: userId,
    });
    return res.data;
  },

  /** Create a new child contribution */
  async createChild(data: Partial<ChildrenContribution>): Promise<ChildrenContribution> {
    const res = await apiClient.api.childrenContributionsCreate(
      {},
      data as any
    );
    return res.data;
  },

  /** Update an existing child */
  async updateChild(
    childId: number,
    data: Partial<PatchedChildrenContribution>
  ) {
    const res = await apiClient.api.childrenContributionsPartialUpdate(
      { id: String(childId) },
      data as any
    );
    return res.data;
  },
};
