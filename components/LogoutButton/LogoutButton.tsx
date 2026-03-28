// components/LogoutButton/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

    return (
    <button onClick={handleLogout}>
      Log out
      <svg width="16" height="16" >
        <use href="/sprite.svg#arrow" />
      </svg>
    </button>
  );
}