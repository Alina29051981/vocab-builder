"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth/AuthContext";
import LogoutButton from "../LogoutButton/LogoutButton";
import UserMenu from "./UserMenu";
import MobileMenu from "../modals/MobiMenu/MobiMenu";
import css from "./Header.module.css";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  

useEffect(() => {
  const checkScreen = () => {
    const width = window.innerWidth;

    setIsMobile(width < 768);
    
  };

  checkScreen();

  window.addEventListener("resize", checkScreen);
  return () => window.removeEventListener("resize", checkScreen);
}, []);
  
useEffect(() => {
  setMenuOpen(false);
}, [pathname]);

  if (loading) return null;
  
  return (
    <header className={css.header}>
      <div className={css.left}>
        <Link href="/dictionary" className={css.logo}>
          <svg className={css.logoIcon}>
            <use href="#icon" />
          </svg>
          <span className={css.title}>VocabBuilder</span>
        </Link>
      </div>

           <nav className={css.navigation}>
        <Link href="/dictionary" className={`${css.navLink} ${pathname === "/dictionary" ? css.active : ""}`}>Dictionary</Link>
        <Link href="/recommend" className={`${css.navLink} ${pathname === "/recommend" ? css.active : ""}`}>Recommend</Link>
        <Link href="/training" className={`${css.navLink} ${pathname === "/training" ? css.active : ""}`}>Training</Link>
        {user && <UserMenu user={user} />}
        <LogoutButton />
      </nav>
      
  {user && isMobile && (
  <div className={css.mobileRight}>
    <div className={css.mobileUser}>
      <span className={css.userName}>{user.name}</span>
      <svg className={css.avatar}>
        <use href="#avatarIcon" />
      </svg>
    </div>

    <button
      className={css.burger}
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
    >
      <svg width="36" height="24">
        <use href={`#${menuOpen ? "icon-x" : "burger"}`} />
      </svg>
    </button>
  </div>
)}

    {menuOpen && user && isMobile && (
  <MobileMenu
    user={user}
    pathname={pathname}
    onClose={() => setMenuOpen(false)}
  />
)}
    </header>
  );
}