"use client";

import Link from "next/link";
import LogoutButton from "../../../components/LogoutButton/LogoutButton";
import css from "./MobiMenu.module.css";
import type { User } from "../../../lib/auth/AuthContext";
import Image from "next/image";
import { useEffect } from "react";

interface MobileMenuProps {
  user: User;
  pathname: string;
  onClose: () => void;
}

export default function MobileMenu({ user, pathname, onClose }: MobileMenuProps) {
 
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [onClose]);

   return (
    <div className={css.mobileMenuOverlay} onClick={onClose}>
      <div className={css.mobileMenu} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose} aria-label="Close menu">
          <svg viewBox="0 0 24 24">
           <use href="/sprite.svg#icon-x" /></svg>
        </button>

         <div className={css.mobileUser}>
           <span>{user.name}</span>
          <svg className={css.avatarIcon}><use href="#avatarIcons" /></svg>
         
        </div>
<div className={css.menuGroup}>
       <Link
  href="/dictionary"
  onClick={onClose}
  className={`${css.menuBtn} ${pathname === "/dictionary" ? css.active : ""}`}
>
  Dictionary
         </Link>
        <Link
  href="/recommend"
  onClick={onClose}
  className={`${css.menuBtn} ${pathname === "/recommend" ? css.active : ""}`}
>
  Recommend
</Link>

<Link
  href="/training"
  onClick={onClose}
  className={`${css.menuBtn} ${pathname === "/training" ? css.active : ""}`}
>
  Training
</Link>
           <LogoutButton className={css.menuBtn} onLogout={onClose} />
           </div>

     <div className={css.bottomImageWrapper}>
  <div className={css.bottomImageWrapper}>
  <Image
    src="/images/illustration.webp"
    alt="Decorative"
    fill
    className={css.bottomImage}
    priority
  />
</div>
  </div>
       </div>
    </div>
  );
}