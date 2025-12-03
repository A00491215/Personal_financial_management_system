// src/services/apiClient.ts
import { Api } from "../generated/api-client";

// Determine backend base URL
// CRA reads env vars that start with REACT_APP_
const BASE_URL =
  (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/+$/, "");

// Create the API client instance
export const apiClient = new Api({
  // all generated endpoints usually start with /api
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