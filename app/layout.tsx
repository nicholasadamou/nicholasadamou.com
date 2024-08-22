import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/app/components/ThemeProvider";
import Navigation from "@/app/components/Navigation";
import { ClerkProvider } from "@clerk/nextjs";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";
import React from "react";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Nicholas Adamou",
  description:
    "Software Engineer passionate about making the world better through software.",
  openGraph: {
    title: "Nicholas Adamou",
    url: baseUrl,
    images: [{ url: `${baseUrl}/api/og?title=nicholasadamou.com`, alt: "nicholasadamou.com" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="width-full bg-contrast dark:bg-primary text-primary antialiased">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navigation />
            <div className="mx-auto max-w-[700px] px-6 pb-24 pt-16 md:px-6 md:pb-44 md:pt-20">
              {children}
            </div>
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
