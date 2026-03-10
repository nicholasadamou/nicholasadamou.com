import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemedToaster from "@/components/layout/ThemedToaster";
import BackNav from "@/components/layout/BackNav";
import BottomNav from "@/components/layout/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getBaseUrl, generateOGUrl } from "@/lib/og";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

const baseUrl = getBaseUrl();
const description =
  "Senior software engineer at Onebrief. Passionate about making the world better through software.";
const ogImageUrl = generateOGUrl({
  title: "Nicholas Adamou",
  description,
  type: "homepage",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Nicholas Adamou",
    template: "%s | Nicholas Adamou",
  },
  description,
  authors: [{ name: "Nicholas Adamou", url: baseUrl }],
  creator: "Nicholas Adamou",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Nicholas Adamou",
    description,
    url: baseUrl,
    siteName: "Nicholas Adamou",
    images: [
      {
        url: `${baseUrl}${ogImageUrl}`,
        width: 1200,
        height: 630,
        alt: "Nicholas Adamou",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicholas Adamou",
    description,
    images: [`${baseUrl}${ogImageUrl}`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSerif.variable} antialiased`}>
        <ThemeProvider>
          <BackNav />
          {children}
          <BottomNav />
          <ThemedToaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
