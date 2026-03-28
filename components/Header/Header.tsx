"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth/AuthContext";
import LogoutButton from "../LogoutButton/LogoutButton";
import css from "./Header.module.css";

export default function PrivateHeader() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  return (
    <header className={css.header}>
      <div className={css.left}>
        <Link href="/dictionary" className={css.logo}>
          <svg className={css.logoIcon}>
            <use href="/sprite.svg#icon" />
          </svg>
          <span className={css.title}>VocabBuilder</span>
        </Link>
      </div>

      {user && !menuOpen && (
    <div className={css.userMobileWrapper}>
      <svg className={css.avatarIcon}><use href="/sprite.svg#avatarIcon" /></svg>
      <span className={css.userGreeting}>{user.name}</span>
    </div>
  )}
      
  <nav className={css.navigation}>
    <Link href="/dictionary" className={`${css.navLink} ${pathname === "/dictionary" ? css.active : ""}`}>Dictionary</Link>
    <Link href="/recommend" className={`${css.navLink} ${pathname === "/recommend" ? css.active : ""}`}>Recommend</Link>
    <Link href="/training" className={`${css.navLink} ${pathname === "/training" ? css.active : ""}`}>Training</Link>

    {user && !menuOpen && (
      <div className={css.user}>
        <svg className={css.avatarIcon}><use href="/sprite.svg#avatarIcon" /></svg>
        <span className={css.userGreeting}>{user.name}</span>
      </div>
    )}
        <LogoutButton />
      </nav>

    <button
    className={css.burger}
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label="Toggle menu"
  >
    <svg width="36" height="24">
      <use href={`/sprite.svg#${menuOpen ? "icon-x" : "burger"}`} />
    </svg>
  </button>

   {menuOpen && (
    <div className={css.mobileMenuOverlay}>
      <div className={css.mobileMenu}>
        {user && (
          <div className={css.mobileUser}>
            <svg className={css.avatarIcon}><use href="/sprite.svg#avatarIcon" /></svg>
            <span>{user.name}</span>
          </div>
        )}
        <Link href="/dictionary" className={pathname === "/dictionary" ? css.active : ""}>Dictionary</Link>
        <Link href="/recommend" className={pathname === "/recommend" ? css.active : ""}>Recommend</Link>
        <Link href="/training" className={pathname === "/training" ? css.active : ""}>Training</Link>
        <LogoutButton />
      </div>
    </div>
  )}
    </header>
  );
}