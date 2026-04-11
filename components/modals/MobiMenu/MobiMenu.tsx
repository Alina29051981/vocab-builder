"use client";

import Link from "next/link";
import LogoutButton from "../../Header/LogoutButton/LogoutButton";
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
            <use href="/sprite.svg#icon-x" />
          </svg>
        </button>

        <div className={css.mobileUser}>
          <span className={css.userName}>{user.name}</span>

          {/* Інлайн SVG аватар */}
          <svg className={css.avatarIcon} viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="currentColor" />
            <g transform="translate(6,6)">
              <path
                d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93914 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17158 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93914 8.42143 5.92172 9.17158 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 20C12 20 20 20 20 18C20 15.6 16.1 13 12 13C7.9 13 4 15.6 4 18C4 20 12 20 12 20Z"
                fill="var(--green)"
                fillOpacity="0.7"
              />
            </g>
          </svg>
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
  <Image
    src="/images/illustration.webp"
    alt="Decorative"
    fill
    sizes="100vw" 
    className={css.bottomImage}
    priority
  />
</div>

      </div>
    </div>
  );
}