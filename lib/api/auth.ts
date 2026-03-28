// components/lib/api/auth.ts 

import { api } from "./api";
import type { SignInRequest, SignUpRequest, AuthResponse } from "@/types/auth";

export async function loginRequest(data: SignInRequest) {
  const res = await api.post<AuthResponse>("/users/signin", data);
  return res.data;
}

export async function registerRequest(data: SignUpRequest) {
  const res = await api.post<AuthResponse>("/users/signup", data);
  return res.data;
}

export async function logoutRequest() {
  await api.post("/users/signout");
}

export async function getCurrentUser() {
  const res = await api.get("/users/current");
  return res.data;
}