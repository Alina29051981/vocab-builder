"use client";

import Link from "next/link";
import LogoutButton from "../../../components/LogoutButton/LogoutButton";
import css from "./MobiMenu.module.css";
import type { User } from "../../../lib/auth/AuthContext";

interface MobileMenuProps {
  user: User;
  pathname: string;
  onClose: () => void;
}

export default function MobileMenu({ user, pathname, onClose }: MobileMenuProps) {
 
   return (
    <div className={css.mobileMenuOverlay} onClick={onClose}>
      <div className={css.mobileMenu} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose} aria-label="Close menu">
          <svg viewBox="0 0 24 24">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

         <div className={css.mobileUser}>
           <span>{user.name}</span>
          <svg className={css.avatarIcon}><use href="/sprite.svg#avatarIcon" /></svg>
         
        </div>

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
    </div>
  );
}