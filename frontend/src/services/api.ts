// src/services/api.ts
import { Api } from '../generated/api-client';
import type {
  User,
  PatchedUser,
  Expense,
  PatchedExpense,
  UserResponses,
  PatchedUserResponses,
  ChildrenContributions,
  PatchedChildrenContributions,
  Milestone,
  UserMilestones,
  PatchedUserMilestones,
  BudgetPreferenceEnum,
} from '../generated/api-client';

// Create API client with authentication
const apiClient = new Api({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000',
  securityWorker: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {};
  },
});

// User API
export const userAPI = {
  list: () => apiClient.api.usersList(),
  get: (userId: number) => apiClient.api.usersRetrieve({ userId }),
  create: (data: User) => apiClient.api.usersCreate(data),
  update: (userId: number, data: User) => apiClient.api.usersUpdate({ userId }, data),
  partialUpdate: (userId: number, data: PatchedUser) => 
    apiClient.api.usersPartialUpdate({ userId }, data),
  delete: (userId: number) => apiClient.api.usersDestroy({ userId }),
  
  // Custom actions
  getProfile: () => apiClient.api.usersProfileRetrieve(),
  updateProfile: (data: PatchedUser) => apiClient.api.usersProfilePartialUpdate(data),
  register: (data: User) => apiClient.api.usersRegisterCreate(data),
};

// Expenses API
export const expensesAPI = {
  list: () => apiClient.api.expensesList(),
  get: (id: string) => apiClient.api.expensesRetrieve({ id }),
  create: (data: Expense) => apiClient.api.expensesCreate(data),
  update: (id: string, data: Expense) => apiClient.api.expensesUpdate({ id }, data),
  partialUpdate: (id: string, data: PatchedExpense) => 
    apiClient.api.expensesPartialUpdate({ id }, data),
  delete: (id: string) => apiClient.api.expensesDestroy({ id }),
};

// User Responses API
export const userResponsesAPI = {
  list: () => apiClient.api.userResponsesList(),
  get: (id: string) => apiClient.api.userResponsesRetrieve({ id }),
  create: (data: UserResponses) => apiClient.api.userResponsesCreate(data),
  update: (id: string, data: UserResponses) => 
    apiClient.api.userResponsesUpdate({ id }, data),
  partialUpdate: (id: string, data: PatchedUserResponses) => 
    apiClient.api.userResponsesPartialUpdate({ id }, data),
  delete: (id: string) => apiClient.api.userResponsesDestroy({ id }),
};

// Children Contributions API
export const childrenContributionsAPI = {
  list: () => apiClient.api.childrenContributionsList(),
  get: (id: string) => apiClient.api.childrenContributionsRetrieve({ id }),
  create: (data: ChildrenContributions) => 
    apiClient.api.childrenContributionsCreate(data),
  update: (id: string, data: ChildrenContributions) => 
    apiClient.api.childrenContributionsUpdate({ id }, data),
  partialUpdate: (id: string, data: PatchedChildrenContributions) => 
    apiClient.api.childrenContributionsPartialUpdate({ id }, data),
  delete: (id: string) => apiClient.api.childrenContributionsDestroy({ id }),
};

// Milestones API
export const milestonesAPI = {
  list: () => apiClient.api.milestonesList(),
  get: (milestoneId: number) => apiClient.api.milestonesRetrieve({ milestoneId }),
};

// User Milestones API
export const userMilestonesAPI = {
  list: () => apiClient.api.userMilestonesList(),
  get: (id: string) => apiClient.api.userMilestonesRetrieve({ id }),
  create: (data: UserMilestones) => apiClient.api.userMilestonesCreate(data),
  update: (id: string, data: UserMilestones) => 
    apiClient.api.userMilestonesUpdate({ id }, data),
  partialUpdate: (id: string, data: PatchedUserMilestones) => 
    apiClient.api.userMilestonesPartialUpdate({ id }, data),
  delete: (id: string) => apiClient.api.userMilestonesDestroy({ id }),
};

// Export types for use in components
export type {
  User,
  PatchedUser,
  Expense,
  PatchedExpense,
  UserResponses,
  PatchedUserResponses,
  ChildrenContributions,
  PatchedChildrenContributions,
  Milestone,
  UserMilestones,
  PatchedUserMilestones,
  BudgetPreferenceEnum,
};

export { apiClient };