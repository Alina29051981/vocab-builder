// components/lib/auth/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { setAuthHeader } from "../../lib/api/api";
import { loginRequest as apiLogin, registerRequest as apiRegister, logoutRequest as apiLogout } from "../../lib/api/auth";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api } from "../../lib/api/api";

export type User = {
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
       
        let token = localStorage.getItem("token");

               if (!token) {
          const match = document.cookie.match(/accessToken=([^;]+)/);
          token = match ? match[1] : null;
        }

        if (!token) {
          setLoading(false);
          return;
        }

        setAuthHeader(token);

        const { data } = await api.get<User>("/users/current");
        setUser(data);
      } catch (err: unknown) {
        console.error("Failed to fetch current user", err);
        localStorage.removeItem("token");
        document.cookie = "accessToken=; path=/; max-age=0";
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      const res = await apiLogin(data);

      document.cookie = `accessToken=${res.token}; path=/`;
      localStorage.setItem("token", res.token);
      setAuthHeader(res.token);

      setUser({ name: res.name, email: res.email, avatar: res.avatar });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Login failed");
      } else {
        toast.error("Unexpected error");
      }
      throw err;
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      const res = await apiRegister(data);

      document.cookie = `accessToken=${res.token}; path=/`;
      localStorage.setItem("token", res.token);
      setAuthHeader(res.token);

      setUser({ name: res.name, email: res.email, avatar: res.avatar });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message;
        if (message?.includes("exists")) toast.error("User already exists. Try login.");
        else toast.error(message || "Register failed");
      } else toast.error("Unexpected error");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {}
    finally {
      localStorage.removeItem("token");
      document.cookie = "accessToken=; path=/; max-age=0";
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};