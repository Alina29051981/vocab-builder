// lib/api/api.ts 
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const setAuthHeader = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete api.defaults.headers.common.Authorization;
};

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthHeader(token);
  }
}