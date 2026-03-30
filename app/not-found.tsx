// app/not-found.tsx

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Page not found - Vocabulary Builder",
  description: "The page you are looking for does not exist in your Vocabulary Builder.",
  openGraph: {
    title: "Page not found - Vocabulary Builder",
    description: "The page you are looking for does not exist in your Vocabulary Builder.",
    url: "https://yourdomain.com/not-found",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"], 
  },
};

export default function NotFoundPage() {
  return (
    <AuthProvider>
      <div className="not-found-container">
        <h1>404 - Page not found</h1>
        <p>Oops! The page you are trying to reach doesn’t exist in your Vocabulary Builder.</p>
        <Link href="/" className="home-link">
          Go back to your dictionary
        </Link>
      </div>
    </AuthProvider>
  );
}