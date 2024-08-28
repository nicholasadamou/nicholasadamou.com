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
import { ScrollToTop } from "@/app/components/ScrollToTop";

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
          <main className="mx-auto w-full px-6 pb-24 pt-32 md:px-6 md:pt-40">
						{/* SVG Background */}
						<svg
							className="absolute -top-5 inset-0 -z-10 h-full w-full stroke-zinc-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] dark:stroke-zinc-700"
							aria-hidden="true"
						>
							<defs>
								<pattern
									id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
									width="200"
									height="200"
									x="50%"
									y="-64"
									patternUnits="userSpaceOnUse"
								>
									<path d="M100 200V.5M.5 .5H200" fill="none"></path>
								</pattern>
							</defs>
							<svg
								x="50%"
								y="-64"
								className="overflow-visible fill-zinc-50 dark:fill-zinc-900/75"
							>
								<path
									d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
									stroke-width="0"
								></path>
							</svg>
							<rect
								width="100%"
								height="100%"
								stroke-width="0"
								fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
							></rect>
						</svg>
            {children}
          </main>
          {/*<Footer />*/}
          <ScrollToTop />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
