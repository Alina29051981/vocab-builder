// lib/api/auth.ts
import { api, setAuthHeader, clearAuthHeader } from "./api";
import type { SignInRequest, SignUpRequest, AuthResponse } from "@/types/auth";

export async function loginRequest(data: SignInRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/users/signin", data);

  // зберігаємо токен і ставимо заголовок
  localStorage.setItem("token", res.data.token);
  setAuthHeader(res.data.token);

  return res.data;
}

export async function registerRequest(data: SignUpRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/users/signup", data);

  // зберігаємо токен і ставимо заголовок
  localStorage.setItem("token", res.data.token);
  setAuthHeader(res.data.token);

  return res.data;
}

export async function logoutRequest(): Promise<void> {
  await api.post("/users/signout");

  // очищаємо токен
  localStorage.removeItem("token");
  clearAuthHeader();
}

export async function getCurrentUser() {
  const res = await api.get("/users/current");
  return res.data;
}