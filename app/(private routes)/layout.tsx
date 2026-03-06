// app/(private)/layout.tsx

import Header from "@/components/Header/Header";

import { ReactNode } from "react";

export default function PrivateLayout({
  children,
}: {
  children: ReactNode;
  }) {
   const token = cookies().get("accessToken")?.value;

  // 🔥 якщо немає токена — редірект
  if (!token) {
    redirect("/sign-in");
  }

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}