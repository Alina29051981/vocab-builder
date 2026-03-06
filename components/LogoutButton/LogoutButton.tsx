"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}