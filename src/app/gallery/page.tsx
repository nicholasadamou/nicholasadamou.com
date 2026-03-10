import type { Metadata } from "next";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A curated collection of photography work, showcasing moments and perspectives through the lens.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
