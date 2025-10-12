import { Metadata } from "next";
import { getNoteBySlug } from "@/lib/contentlayer-data";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateSingleNoteOGUrl } from "@/lib/utils/themeDetection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const note = getNoteBySlug(resolvedParams.slug);

  if (!note) {
    notFound();
  }

  const {
    title,
    date: publishedTime,
    summary: description,
    image,
    slug,
  } = note;

  const baseUrl = getBaseUrl();
  const ogImageUrl = generateSingleNoteOGUrl(
    title,
    description,
    image || undefined
  );

  return {
    metadataBase: new URL(baseUrl),
    title: `${title} | Nicholas Adamou`,
    description,
    openGraph: {
      title: `${title} | Nicholas Adamou`,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/notes/${slug}`,
      images: [{ url: `${baseUrl}${ogImageUrl}`, alt: title }],
    },
  };
}
