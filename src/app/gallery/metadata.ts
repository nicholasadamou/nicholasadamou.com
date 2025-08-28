import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

const title = "Gallery";
const description =
  "A curated collection of my photography work, showcasing moments and perspectives through the lens.";

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
        url: `${getBaseUrl()}/og/gallery.png`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${getBaseUrl()}/og/gallery.png`],
  },
};
