"use client";

import React from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import readingTime from "reading-time";
import type { Note, Project } from "contentlayer/generated";

import { ContentHeader } from "@/app/components/ContentHeader";
import { RelatedContentList } from "@/app/components/RelatedContentList";
import Mdx from "@/app/components/mdx/MdxWrapper";
import { useMounted } from "@/app/hooks/usemounted";
import Me from "@/public/avatar.png";
import { PinIcon } from "lucide-react";
import HeaderImage from "./mdx/HeaderImage";
import GitHubLinkSection from "@/app/components/GitHubLinkSection";

type UnifiedContent = (Project | Note) & {
	long_summary?: string;
  pinned?: boolean;
  readingTime?: string;
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
}: ContentPageProps): JSX.Element | null {
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
      className="mx-auto flex max-w-[700px] flex-col gap-12 px-4"
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
                  <GitHubLinkSection url={content.url} zip={content.zip} />
                )}
              </>
            ),
            extraInfo: (
              <>
                {" · "}
                {readingStats.text}
                {content.pinned && " · "}
                {content.pinned && (
                  <>
                    <PinIcon className="ml-[-3px] inline w-[16px] text-tertiary" />{" "}
                    <span className="text-tertiary">(Pinned)</span>
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
