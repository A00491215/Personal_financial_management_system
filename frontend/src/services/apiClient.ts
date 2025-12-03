// src/services/apiClient.ts
import { Api } from "../generated/api-client";

const BASE_URL =
  (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export const apiClient = new Api({
  // All endpoints will be BASE_URL + /api
  baseURL: `${BASE_URL}/api`,
  secure: false,
  securityWorker: () => {
    const token = localStorage.getItem("access");
    if (!token) return {};
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
});
