import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software Engineer who is passionate about making the world better through software.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
