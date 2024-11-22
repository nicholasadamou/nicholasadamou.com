import "./globals.css";

import React from "react";
import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/app/components/ThemeProvider";
import Navigation from "@/app/components/Navigation";
import { Footer } from "@/app/components/Footer";


import { getBaseUrl } from "@/app/utils/getBaseUrl";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Nicholas Adamou",
  description:
    "Software Engineer passionate about making the world better through software.",
  openGraph: {
    title: "Nicholas Adamou",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Working hard to make the world better through software.")}&type=homepage`,
        alt: "nicholasadamou.com",
      },
    ],
  },
  alternates: {
    canonical: baseUrl,
    types: {
      "application/rss+xml": `${baseUrl}/rss.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="relative width-full text-primary antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main className="mx-auto w-full px-4 pb-24 pt-28">
            {children}
						<Footer />
          </main>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
