import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/api/get-base-url";
import { generateSingleOGUrl } from "@/lib/utils/theme/detection";

const baseUrl = getBaseUrl();

const description =
  "I find great value in sharing my insights and learnings whenever the opportunity arises. Each note reflects my thoughts and experiences, and I hope they resonate with others.";

const ogImageUrl = generateSingleOGUrl({ title: description, type: "notes" });

export const metadata: Metadata = {
  title: "Notes | Nicholas Adamou",
  description,
  openGraph: {
    title: "Notes | Nicholas Adamou",
    description,
    type: "website",
    url: `${baseUrl}/notes`,
    images: [
      {
        url: `${baseUrl}${ogImageUrl}`,
        alt: "Notes",
      },
    ],
  },
};
