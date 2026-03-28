// components/lib/auth/LogoutButton.tsx

"use client";

import { useAuth } from "../../lib/auth/AuthContext";
import css from "./LogoutButton.module.css";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); 
  };

  return (
    <button className={css.btn} onClick={handleLogout}>
      Logout
    </button>
  );
}