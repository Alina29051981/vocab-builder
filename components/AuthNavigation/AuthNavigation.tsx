// components/AuthNavigation/AuthNavigation.tsx
"use client";

import { useAuth } from "../../lib/auth/AuthContext";
import Link from "next/link";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const { user, logout, loading } = useAuth();
  
  if (loading) return null;

  if (user) {
    return (
      <>
        <li className={css.navigationItem}>
          <button className={css.navigationLink} onClick={logout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/login" className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/register" className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}