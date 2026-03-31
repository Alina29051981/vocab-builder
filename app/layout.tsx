// app/layout.tsx 
import type { Metadata } from "next";
import { myFonts } from "./fonts";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import sprite from "../assets/sprite.svg?raw";

export const metadata: Metadata = {
  title: "VocabBuilder",
  description:
    "Build your personal vocabulary, get smart recommendations, and train new words effectively.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "VocabBuilder",
    description:
      "Build your personal vocabulary, get smart recommendations, and train new words effectively.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={myFonts.variable}>
      <body>
        <div
          dangerouslySetInnerHTML={{ __html: sprite }}
          style={{ display: "none" }}
        />
                <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}