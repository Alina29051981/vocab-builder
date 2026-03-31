// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth/AuthContext";
import css from "../app/Home.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
               router.replace("/dictionary");
      } else {
       
        router.replace("/login"); 
      }
    }
  }, [user, loading, router]);

  return !loading && !user ? (
  <div className={css.wrapper}>
    <div className={css.logo}>
      <svg width="36" height="36">
        <use href="#icon" />
      </svg>
      <h1 className={css.title}>VocabBuilder</h1>
    </div>
  </div>
) : null;
}