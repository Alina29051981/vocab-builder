import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/users/current`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ user: null });
    }

    const data = await response.json();

    return NextResponse.json({
      user: {
        email: data.email,
        name: data.name,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}