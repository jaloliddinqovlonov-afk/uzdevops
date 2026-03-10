import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UzDevOps Academy",
  description: "O‘zbek tilida DevOps darslari va bootcamp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}