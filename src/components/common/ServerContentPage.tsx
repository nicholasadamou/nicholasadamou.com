import React from "react";
import { notFound } from "next/navigation";
import readingTime from "reading-time";
import type { Note, Project } from "@/lib/contentlayer-data";
import ContentPage from "./ContentPage";
import ServerMDXRenderer from "@/components/mdx/ServerMDXRenderer";

type UnifiedContent = (Project | Note) & {
  long_summary?: string;
  technologies?: string[];
  pinned?: boolean;
  readingTime?: string;
  demoUrl?: string;
  image_url?: string;
};

interface ServerContentPageProps {
  content: UnifiedContent | undefined;
  type: "project" | "note";
  allContent: UnifiedContent[];
}

export default async function ServerContentPage({
  content,
  type,
  allContent,
}: ServerContentPageProps): Promise<React.ReactElement | null> {
  if (!content) {
    notFound();
  }

  const readingStats = readingTime(content.body.raw);

  const relatedItems = allContent
    .filter((item) => item.slug !== content.slug)
    .slice(0, 2);
  const relatedItemsWithStats = relatedItems.map((item) => ({
    title: item.title,
    image: item.image || undefined, // Convert null to undefined for compatibility
    image_url: item.image_url,
    summary: item.summary,
    slug: item.slug,
    date: item.date,
    readingTime: readingTime(item.body.raw).text,
  }));

  const mdxContent = await ServerMDXRenderer({ source: content.body.code });

  return (
    <ContentPage
      content={content}
      type={type}
      readingStats={readingStats}
      relatedItemsWithStats={relatedItemsWithStats}
      renderedMDXContent={mdxContent}
    />
  );
}
