import { api } from "./api";

export type LoginRequest = {
  email: string;
  password: string;
};

export async function login(data: LoginRequest) {
  const res = await api.post("/auth/login", data);
  return res.data;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post("/auth/register", data);
  return res.data;
}