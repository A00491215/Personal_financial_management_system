// src/services/auth.service.ts
import { apiClient } from "./apiClient";
import type { User } from "../generated/api-client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  access: string;
  refresh: string;
  user: User;
}

export const authService = {
  /** LOGIN */
  async login(payload: LoginPayload): Promise<LoginResult> {
    const res = await apiClient.api.usersLoginCreate(
      {
        email: payload.email,
        password: payload.password,
      } as any // Swagger incorrectly expects full User → override
    );

    const data = res.data as any;

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user_id", String(data.user.user_id));

    return {
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    };
  },

  logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_id");
  },

  initFromStorage() {
    return {
      access: localStorage.getItem("access"),
      refresh: localStorage.getItem("refresh"),
      user_id: localStorage.getItem("user_id"),
    };
  },
};
