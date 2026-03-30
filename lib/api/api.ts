// lib/api/api.ts 
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
      document.cookie = "accessToken=; path=/; max-age=0";

      if (typeof window !== "undefined") {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

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