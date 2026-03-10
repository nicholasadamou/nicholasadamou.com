import { getAllArticles } from "@/lib/content/mdx";
import { resolveImageUrl } from "@/lib/image/unsplash";
import NoteList from "@/components/notes/NoteList";

import { getBaseUrl, generateOGUrl } from "@/lib/og";
import type { Metadata } from "next";

const baseUrl = getBaseUrl();
const ogImageUrl = generateOGUrl({
  title: "Notes",
  description:
    "Writing about software engineering, architecture, and developer tools.",
  type: "notes",
});

export const metadata: Metadata = {
  title: "Notes — Nicholas Adamou",
  description:
    "Writing about software engineering, architecture, and developer tools.",
  openGraph: {
    title: "Notes — Nicholas Adamou",
    description:
      "Writing about software engineering, architecture, and developer tools.",
    images: [
      {
        url: `${baseUrl}${ogImageUrl}`,
        width: 1200,
        height: 630,
        alt: "Notes — Nicholas Adamou",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notes — Nicholas Adamou",
    description:
      "Writing about software engineering, architecture, and developer tools.",
    images: [`${baseUrl}${ogImageUrl}`],
  },
};

export default function NotePage() {
  const articles = getAllArticles().map(
    ({ slug, title, summary, date, readTime, image, pinned }) => ({
      slug,
      title,
      summary,
      date,
      readTime,
      pinned: pinned || false,
      image: image ? resolveImageUrl(image) : null,
    })
  );

  return <NoteList articles={articles} />;
}
