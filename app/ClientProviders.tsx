"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "../components/redux/store"; 
import { AuthProvider } from "../lib/auth/AuthContext";
import Header from "../components/Header/Header";
import TanStackProvider from "./TanStackProvider";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const authPages = ["/login", "/register"];
  const hideHeader = authPages.some((p) => pathname.startsWith(p));

  return (
    <Provider store={store}>
      <TanStackProvider>
        <AuthProvider>
          {!hideHeader && <Header />}
          <main>{children}</main>
        </AuthProvider>
      </TanStackProvider>
    </Provider>
  );
}