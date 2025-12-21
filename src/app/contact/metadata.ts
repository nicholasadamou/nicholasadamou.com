import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/api/get-base-url";
import { generateSingleOGUrl } from "@/lib/utils/theme/detection";

const baseUrl = getBaseUrl();

const description =
  "I'm always open to new opportunities and challenges. Whether you have a project in mind, want to collaborate, or just want to say hi, I'd love to hear from you.";

const ogImageUrl = generateSingleOGUrl({ title: description, type: "contact" });

export const metadata: Metadata = {
  title: "Contact | Nicholas Adamou",
  description,
  openGraph: {
    title: "Contact | Nicholas Adamou",
    description,
    type: "website",
    url: `${baseUrl}/contact`,
    images: [
      {
        url: `${baseUrl}${ogImageUrl}`,
        alt: "Contact",
      },
    ],
  },
};
