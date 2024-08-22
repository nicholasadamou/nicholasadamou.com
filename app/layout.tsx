import "./globals.css";

import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/app/components/ThemeProvider";
import Navigation from "@/app/components/Navigation";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";

import React from "react";
import Head from "next/head";

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
        url: `${baseUrl}/api/og?title=nicholasadamou.com`,
        alt: "nicholasadamou.com",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for nicholasadamou.com"
          href="/rss.xml"
        />
      </Head>
      <body className="width-full bg-contrast text-primary antialiased dark:bg-primary">
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
  );
}
