import type { Metadata } from "next";
import DevelopersPageClient from "./DevelopersPageClient";

export const metadata: Metadata = {
  title: "Nicholas Adamou developer resources",
  description:
    "Machine-readable developer resources for Nicholas Adamou — llms.txt, Markdown content negotiation, OpenAPI, sitemap, and agent entry points.",
  alternates: {
    canonical: "/developers",
  },
};

export default function DevelopersPage() {
  return <DevelopersPageClient />;
}
