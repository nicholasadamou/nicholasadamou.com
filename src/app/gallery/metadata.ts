import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateSingleOGUrl } from "@/lib/utils/themeDetection";

const title = "Gallery";
const description =
  "A curated collection of my photography work, showcasing moments and perspectives through the lens.";

// Single dark theme OG image to avoid duplicate display on social media
const baseUrl = getBaseUrl();
const ogImageUrl = generateSingleOGUrl({
  title,
  description,
  type: "gallery",
  image: "/gallery/arizona-og.jpg",
});

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: `${baseUrl}/gallery`,
    images: [
      {
        url: `${baseUrl}${ogImageUrl}`,
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
    images: [`${baseUrl}${ogImageUrl}`],
  },
};
