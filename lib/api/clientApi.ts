// components/lib/api/clientApi.ts 

import { api, setAuthHeader, clearAuthHeader } from "./api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export async function login(data: LoginRequest) {
  const res = await api.post("/users/signin", data);
  const token = res.data.token;

  setAuthHeader(token);         
  localStorage.setItem("token", token); 

  return res.data;
}

export async function register(data: RegisterRequest) {
  const res = await api.post("/users/signup", data);
  const token = res.data.token;

  setAuthHeader(token);
  localStorage.setItem("token", token);

  return res.data;
}

export async function logout() {
  await api.post("/users/signout");

  clearAuthHeader();
  localStorage.removeItem("token");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  setAuthHeader(token); 
  const res = await api.get("/users/current");
  return res.data;
}