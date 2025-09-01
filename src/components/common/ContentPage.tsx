import React from "react";
import { notFound } from "next/navigation";
import readingTime from "reading-time";
import type { Note, Project } from "@/lib/contentlayer-data";

import { ContentHeader } from "@/components/common/ContentHeader";
import { RelatedContentList } from "@/components/common/RelatedContentList";
import MDXRenderer from "@/components/mdx/MDXRenderer";
import Me from "../../../public/avatar.jpeg";
import HeaderImage from "@/components/mdx/HeaderImage";
import GitHubLinkSection from "@/components/features/projects/GitHubLinkSection";
import Views from "@/app/notes/components/Views";
import { Badge } from "@/components/ui/badge";

type UnifiedContent = (Project | Note) & {
  long_summary?: string;
  technologies?: string[];
  pinned?: boolean;
  readingTime?: string;
  demoUrl?: string;
  image_url?: string;
};

interface ContentPageProps {
  content: UnifiedContent | undefined;
  type: "project" | "note";
  allContent: UnifiedContent[];
}

export default async function ContentPage({
  content,
  type,
  allContent,
}: ContentPageProps): Promise<React.ReactElement | null> {
  if (!content) {
    notFound();
  }

  const readingStats = readingTime(content.body.raw);

  const relatedItems = allContent
    .filter((item) => item.slug !== content.slug)
    .slice(0, 2);
  const relatedItemsWithStats = relatedItems.map((item) => ({
    ...item,
    image: item.image || undefined, // Convert null to undefined for compatibility
    readingTime: readingTime(item.body.raw).text,
  }));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4">
      <article>
        <ContentHeader
          title={content.title}
          longSummary={content.long_summary}
          summary={content.summary}
          date={content.date}
          author={{ name: "Nicholas Adamou", avatar: Me.src }}
          additionalInfo={{
            backLink: `/${type}s`,
            backText: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
            linkSection: (
              <>
                {content.url && (
                  <>
                    <div className="flex flex-wrap items-center gap-1">
                      {content.technologies?.map((tech) => (
                        <Badge variant="secondary" key={tech}>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <GitHubLinkSection
                      url={content.url}
                      demoUrl={content.demoUrl}
                    />
                  </>
                )}
              </>
            ),
            extraInfo: (
              <>
                <span className="mx-0.5">·</span>
                <span>{readingStats.text}</span>
                {type === "note" && (
                  <>
                    <span className="mx-0.5">·</span>
                    <Views slug={content.slug} />
                  </>
                )}
              </>
            ),
          }}
        />
        {content.image_url && (
          <>
            <div className="h-8" />
            <HeaderImage
              imageSrc={content.image_url}
              imageAlt={`${content.title} project image`}
            />
            <div className="h-8" />
          </>
        )}
        <div className="prose prose-neutral max-w-4xl text-pretty">
          <MDXRenderer source={content.body.code} />
        </div>
      </article>
      <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight">
        If you liked this {type}.
        <p className="text-secondary mt-1">You will love these as well.</p>
      </h2>
      <RelatedContentList items={relatedItemsWithStats} basePath={`${type}s`} />
    </div>
  );
}
