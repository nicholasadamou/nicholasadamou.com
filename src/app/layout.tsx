import "@/styles/globals.css";

import React from "react";
import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/components/common/theme/ThemeProvider";
import Navigation from "@/components/common/layout/Navigation";
import { Footer } from "@/components/common/layout/Footer/Footer";
import { ChatbotWidget } from "@/components/common/dialogs/Chatbot/ChatbotWidget";
import { KeyboardShortcutsDialog } from "@/components/common/dialogs/KeyboardShortcutsDialog";

import { getBaseUrl } from "@/lib/utils/api/get-base-url";
import { generateSingleOGUrl } from "@/lib/utils/theme/detection";
import {
  StructuredData,
  nicholasAdamouPersonData,
  websiteData,
} from "@/components/seo/StructuredData";

const baseUrl = getBaseUrl();
const description =
  "Software Engineer passionate about making the world better through software.";
const ogImageUrl = generateSingleOGUrl({
  title: "Working hard to make the world better through software.",
  type: "homepage",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Nicholas Adamou - Making the world better through software",
    template: "%s | Nicholas Adamou",
  },
  description,
  keywords: [
    "Nicholas Adamou",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Web Development",
    "Cloud Architecture",
    "DevOps",
  ],
  authors: [{ name: "Nicholas Adamou", url: baseUrl }],
  creator: "Nicholas Adamou",
  publisher: "Nicholas Adamou",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Nicholas Adamou - Making the world better through software",
    description,
    url: baseUrl,
    siteName: "Nicholas Adamou",
    images: [
      {
        url: `${baseUrl}${ogImageUrl}`,
        width: 1200,
        height: 630,
        alt: "Nicholas Adamou - Making the world better through software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicholas Adamou - Making the world better through software",
    description,
    site: "@nicholasadamou",
    creator: "@nicholasadamou",
    images: [
      {
        url: `${baseUrl}${ogImageUrl}`,
        alt: "Nicholas Adamou - Making the world better through software",
      },
    ],
  },
  alternates: {
    canonical: baseUrl,
    types: {
      "application/rss+xml": `${baseUrl}/rss.xml`,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Add your Google Search Console verification code
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
      <head>
        <StructuredData type="person" data={nicholasAdamouPersonData} />
        <StructuredData type="website" data={websiteData} />
      </head>
      <body className="width-full text-primary relative flex min-h-screen flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ChatbotWidget />
          <KeyboardShortcutsDialog />
          <Navigation />
          <main className="mx-auto w-full flex-1 px-4 pt-28">{children}</main>
          <Footer />
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
