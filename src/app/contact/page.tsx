import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact | Nicholas Adamou",
  description:
    "I help companies and individuals build out their digital presence. Let's talk about your project.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
