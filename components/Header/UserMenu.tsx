"use client";

import type { User } from "../../lib/auth/AuthContext";
import css from "./Header.module.css";

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <div className={css.user}>
      <span className={css.userGreeting}>{user.name}</span>
      <svg className={css.avatarIcon}>
        <use href="/sprite.svg#avatarIcon" />
      </svg>
         </div>
  );
}