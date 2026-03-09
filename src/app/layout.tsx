/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "LocalSteals - Chicagoland Deal Hunter",
  description:
    "Your personal Chicagoland deal aggregator. Hunt down the best local steals before they vanish.",
  keywords: ["deals", "Chicago", "local deals", "coupons", "savings"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LocalSteals",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body
        className="antialiased"
        style={{
          backgroundColor: "#0a0a0a",
          color: "#f0f0eb",
          fontFamily: "var(--font-body), sans-serif",
          minHeight: "100dvh",
        }}
      >
        {children}
      </body>
    </html>
  );
}