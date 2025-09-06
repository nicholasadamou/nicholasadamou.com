import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateOGVariants } from "@/lib/utils/themeDetection";

const baseUrl = getBaseUrl();

const description =
  "I'm always open to new opportunities and challenges. Whether you have a project in mind, want to collaborate, or just want to say hi, I'd love to hear from you.";

const ogVariants = generateOGVariants({ title: description, type: "contact" });

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
        url: `${baseUrl}${ogVariants.dark}`,
        alt: "Contact - Dark Theme",
      },
      {
        url: `${baseUrl}${ogVariants.light}`,
        alt: "Contact - Light Theme",
      },
    ],
  },
};
