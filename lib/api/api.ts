import axios, { AxiosError, AxiosResponse } from "axios";

export interface ApiError {
  message: string;
}

interface ErrorResponse {
  message?: string;
}

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
  if (token) setAuthHeader(token);
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    let apiError: ApiError;

    if (error.response?.status === 409) {
      apiError = { message: "This word is already in your dictionary!" };
    } else {
      apiError = { message: error.response?.data?.message || "Unexpected error occurred" };
    }

    return Promise.reject(apiError);
  }
);