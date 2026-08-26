import type { Metadata } from "next";
import DevelopersPageClient from "./DevelopersPageClient";

export const metadata: Metadata = {
  title: "Nicholas Adamou developer resources",
  description:
    "nicholasadamou developer resources — machine-readable guides for agents: llms.txt, Markdown content negotiation, OpenAPI, sitemap, and API catalog.",
  keywords: [
    "nicholasadamou",
    "nicholasadamou developer resources",
    "Nicholas Adamou developer resources",
    "openapi",
    "llms.txt",
  ],
  alternates: {
    canonical: "/developers",
  },
};

export default function DevelopersPage() {
  return <DevelopersPageClient />;
}
