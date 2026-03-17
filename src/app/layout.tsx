import type { Metadata } from "next";
import { Outfit, DM_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JMC Grade Hub — Imperial JMC Y1 Grade Calculator",
  description:
    "Unofficial grade calculator for Imperial College JMC Year 1 students — 2025/26. Compute weighted module grades, ECTS-weighted year averages, and check progression requirements.",
  openGraph: {
    title: "JMC Grade Hub",
    description:
      "Grade calculator for Imperial College JMC Year 1 — 2025/26",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
