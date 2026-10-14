import { pageMetadata } from "@/lib/og";
import type { Metadata } from "next";
import PrivacyPageClient from "./PrivacyPageClient";

const page: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about how I collect, use, and protect your personal information on nicholasadamou.com.",
  alternates: {
    canonical: "/privacy",
  },
};

export const metadata: Metadata = {
  ...page,
  ...pageMetadata(String(page.title), page.description!, "/privacy"),
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
