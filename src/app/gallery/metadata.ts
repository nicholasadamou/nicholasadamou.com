import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateOGVariants } from "@/lib/utils/themeDetection";

const title = "Gallery";
const description =
  "A curated collection of my photography work, showcasing moments and perspectives through the lens.";

// Dynamic OG image variants with theme awareness
const baseUrl = getBaseUrl();
const ogVariants = generateOGVariants({
  title,
  description,
  type: "gallery",
  image: "/gallery/arizona.jpg",
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
        url: `${baseUrl}${ogVariants.dark}`,
        width: 1920,
        height: 1080,
        alt: `${title} - Dark Theme`,
      },
      {
        url: `${baseUrl}${ogVariants.light}`,
        width: 1920,
        height: 1080,
        alt: `${title} - Light Theme`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${baseUrl}${ogVariants.dark}`, `${baseUrl}${ogVariants.light}`],
  },
};
