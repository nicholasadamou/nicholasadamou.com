import type { Metadata } from "next";
import PrivacyPageClient from "./PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Nicholas Adamou",
  description:
    "Learn about how I collect, use, and protect your personal information on nicholasadamou.com.",
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
