// app/components/ProtectedRoute/ProtectedRoute.client.tsx 
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

    return (
    <div style={{ pointerEvents: loading || !user ? "none" : "auto", opacity: loading || !user ? 0.5 : 1 }}>
      {children}
    </div>
  );
}