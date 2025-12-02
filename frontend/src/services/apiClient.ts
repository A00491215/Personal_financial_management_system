// src/services/apiClient.ts
import { Api } from "../generated/api-client";

export const apiClient = new Api({
  baseURL: "http://localhost:8000",
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
