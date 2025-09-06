import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateOGVariants } from "@/lib/utils/themeDetection";

const baseUrl = getBaseUrl();

const description =
  "Some of the projects I've worked on over the years. I'm passionate about leveraging technology to create positive change in the world. My mission is to harness the power of code to develop innovative solutions that address real-world challenges and improve people's lives.";
const shortDescription = "Some of the projects I've worked on over the years.";

const ogVariants = generateOGVariants({
  title: shortDescription,
  type: "projects",
});

export const metadata: Metadata = {
  title: "Projects | Nicholas Adamou",
  description,
  openGraph: {
    title: "Projects | Nicholas Adamou",
    description,
    type: "website",
    url: `${baseUrl}/projects`,
    images: [
      {
        url: `${baseUrl}${ogVariants.dark}`,
        alt: "Projects - Dark Theme",
      },
      {
        url: `${baseUrl}${ogVariants.light}`,
        alt: "Projects - Light Theme",
      },
    ],
  },
};
