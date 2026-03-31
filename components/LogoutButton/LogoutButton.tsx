// components/LogoutButton/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";
import css from "./LogoutButton.module.css";

interface LogoutButtonProps {
  onLogout?: () => void;
  className?: string;
}

export default function LogoutButton({ onLogout, className }: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onLogout?.();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={`${css.logoutButton} ${className || ""}`}
    >
      Log out
      <svg width="16" height="16">
        <use href="#arrow" />
      </svg>
    </button>
  );
}