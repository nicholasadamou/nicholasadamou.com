import { pageMetadata } from "@/lib/og";
import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

const page: Metadata = {
  title: "About",
  description:
    "Senior outcome engineer at Onebrief. Building thoughtful software and purposeful websites.",
  alternates: {
    canonical: "/about",
  },
};

export const metadata: Metadata = {
  ...page,
  ...pageMetadata(String(page.title), page.description!, "/about"),
};

export default function AboutPage() {
  return <AboutPageClient />;
}
