import { pageMetadata } from "@/lib/og";
import type { Metadata } from "next";
import DevelopersPageClient from "./DevelopersPageClient";

const page: Metadata = {
  title: "Nicholas Adamou developer resources: API, CLI, and MCP",
  description:
    "nicholasadamou developer resources — versioned content API, OpenAPI, RFC 9457 errors, official CLI, MCP server, and Markdown negotiation.",
  keywords: [
    "nicholasadamou",
    "nicholasadamou developer resources",
    "Nicholas Adamou developer resources",
    "nicholasadamou api",
    "nicholasadamou mcp",
    "nicholasadamou cli",
    "openapi",
    "llms.txt",
  ],
  alternates: {
    canonical: "/developers",
  },
};

export const metadata: Metadata = {
  ...page,
  ...pageMetadata(String(page.title), page.description!, "/developers"),
};

export default function DevelopersPage() {
  return <DevelopersPageClient />;
}
