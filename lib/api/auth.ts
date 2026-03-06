import { api } from "./clientApi";
import type { SignInRequest, SignUpRequest, AuthResponse } from "@/types/auth";

export async function login(data: SignInRequest) {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
}

export async function register(data: SignUpRequest) {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
}

export async function logout() {
  await api.post("/auth/logout");
}