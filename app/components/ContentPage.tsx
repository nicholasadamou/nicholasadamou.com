"use client";

import React from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import readingTime from "reading-time";
import type { Note, Project } from "@/lib/contentlayer-data";

import { ContentHeader } from "@/app/components/ContentHeader";
import { RelatedContentList } from "@/app/components/RelatedContentList";
import Mdx from "@/app/components/mdx/MdxWrapper";
import { useMounted } from "@/app/hooks/usemounted";
import Me from "@/public/avatar.jpeg";
import HeaderImage from "./mdx/HeaderImage";
import GitHubLinkSection from "@/app/components/GitHubLinkSection";
import Views from "@/app/notes/components/Views";
import { Badge } from "@/app/components/ui/badge";

type UnifiedContent = (Project | Note) & {
	long_summary?: string;
	technologies?: string[];
  pinned?: boolean;
  readingTime?: string;
	demoUrl?: string;
};

interface ContentPageProps {
  content: UnifiedContent | undefined;
  type: "project" | "note";
  allContent: UnifiedContent[];
}

export default function ContentPage({
  content,
  type,
  allContent,
}: ContentPageProps): React.ReactElement | null {
  const mounted = useMounted();

  if (!content) {
    notFound();
  }

  const readingStats = readingTime(content.body.raw);

  const fadeIn = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  if (!mounted) return null;

  const relatedItems = allContent
    .filter((item) => item.slug !== content.slug)
    .slice(0, 2);
  const relatedItemsWithStats = relatedItems.map((item) => ({
    ...item,
    readingTime: readingTime(item.body.raw).text,
  }));

  return (
    <motion.div
      {...({
        className: "mx-auto flex max-w-[700px] flex-col gap-12 px-4"
      } as any)}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
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
										<GitHubLinkSection url={content.url} demoUrl={content.demoUrl} />
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
        {content.image && (
          <>
            <div className="h-8" />
            <HeaderImage
              imageSrc={content.image}
              imageAlt={`${content.title} project image`}
              imageAuthor={content.image_author}
              imageAuthorUrl={content.image_author_url}
              imageUrl={content.image_url}
            />
            <div className="h-8" />
          </>
        )}
        <div className="prose prose-neutral text-pretty">
          <Mdx code={content.body.code} />
        </div>
      </article>
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-primary">
        If you liked this {type}.
        <p className="mt-1 text-secondary">You will love these as well.</p>
      </h2>
      <RelatedContentList items={relatedItemsWithStats} basePath={`${type}s`} />
    </motion.div>
  );
}
