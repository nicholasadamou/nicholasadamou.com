import "@/styles/globals.css";

import React from "react";
import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/components/common/ThemeProvider";
import Navigation from "@/components/common/Navigation";
import { Footer } from "@/components/common/Footer/Footer";
import { DynamicOGMetaTags } from "@/components/common/DynamicOGMetaTags";

import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateHomepageOGVariants } from "@/lib/utils/themeDetection";

const baseUrl = getBaseUrl();
const description =
  "Software Engineer passionate about making the world better through software.";
const ogVariants = generateHomepageOGVariants(
  "Working hard to make the world better through software."
);

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Nicholas Adamou",
  description,
  openGraph: {
    title: "Nicholas Adamou",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}${ogVariants.dark}`,
        alt: "nicholasadamou.com - Dark Theme",
      },
      {
        url: `${baseUrl}${ogVariants.light}`,
        alt: "nicholasadamou.com - Light Theme",
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
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="width-full text-primary relative flex min-h-screen flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DynamicOGMetaTags
            lightOGImage={ogVariants.light}
            darkOGImage={ogVariants.dark}
            title="Working hard to make the world better through software."
          />
          <Navigation />
          <main className="mx-auto w-full px-4 pb-24 pt-28">
            {children}
            <Footer />
          </main>
        </ThemeProvider>
        {/* Only render analytics in production or when deployment ID is available */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
