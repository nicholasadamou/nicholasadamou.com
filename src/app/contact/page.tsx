import { pageMetadata } from "@/lib/og";
import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

const page: Metadata = {
  title: "Contact",
  description:
    "Share your goals, timeline, and budget for a website, redesign, or software project with Nicholas Adamou.",
  alternates: {
    canonical: "/contact",
  },
};

export const metadata: Metadata = {
  ...page,
  ...pageMetadata(String(page.title), page.description!, "/contact"),
};

export default function ContactPage() {
  return <ContactPageClient />;
}
