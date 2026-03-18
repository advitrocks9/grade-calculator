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
  title: "my grades (lol)",
  description:
    "grade calculator for jmc y1 25/26",
    icons: {
      icon: "/icon.ico",
    },
  openGraph: {
    title: "my grades (lol)",
    description:
      "grade calculator for jmc y1 25/26",
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
