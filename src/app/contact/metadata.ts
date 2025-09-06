import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateThemeAwareOGUrl } from "@/lib/utils/themeDetection";

const baseUrl = getBaseUrl();

const description =
  "I'm always open to new opportunities and challenges. Whether you have a project in mind, want to collaborate, or just want to say hi, I'd love to hear from you.";

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
        url: `${baseUrl}${generateThemeAwareOGUrl({ title: description, type: "contact" })}`,
        alt: "Contact",
      },
    ],
  },
};
