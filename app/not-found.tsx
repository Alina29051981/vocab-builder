// app/not-found.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Page not found - VocabBuilder",
  description: "The page you are looking for does not exist.",
  openGraph: {
    title: "Page not found - VocabBuilder",
    description: "The page you are looking for does not exist.",
    url: "https://vocab-builder-delta.vercel.app/not-found",
    images: ["https://vocab-builder-delta.vercel.app/blood-report.webp"],
  },
};

export default function NotFoundPage() {
  return (
    <AuthProvider>
      <div className="not-found-container">
        <h1>404 - Page not found</h1>
        <p>Oops! The page you’re looking for does not exist.</p>
        <Link href="/" className="btn-primary">
          Go back home
        </Link>
      </div>
    </AuthProvider>
  );
}