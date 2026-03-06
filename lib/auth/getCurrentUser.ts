import { cookies } from "next/headers";
import type { User } from "../../types/user";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies(); // 🔥 важливо

  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.API_URL}/users/current`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (res.status === 401) {
      // 🔥 якщо потрібно чистити cookie — робимо через cookieStore
      cookieStore.delete("accessToken");
      return null;
    }

    if (!res.ok) {
      return null;
    }

    const user: User = await res.json();
    return user;

  } catch {
    return null;
  }
}