import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

const title = "Gallery";
const description =
  "A curated collection of my photography work, showcasing moments and perspectives through the lens.";

// Dynamic OG image URL using the new gallery page type
const ogImageUrl = `${getBaseUrl()}/api/og?${new URLSearchParams({
  title,
  description,
  type: "gallery",
  image: "/gallery/arizona.jpg",
}).toString()}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: `${getBaseUrl()}/gallery`,
    images: [
      {
        url: ogImageUrl,
        width: 1920,
        height: 1080,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl],
  },
};
