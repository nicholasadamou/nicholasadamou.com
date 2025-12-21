"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Note, Project } from "@/lib/contentlayer-data";
import { Calendar, Clock, Eye } from "lucide-react";

import { ContentHeader } from "@/components/common/layout/ContentHeader";
import { RelatedContentList } from "@/components/common/sections/RelatedContentList";
import { AnimatedMDXWrapper } from "@/components/mdx/renderers/AnimatedMDXWrapper";
import Me from "../../../../public/avatar.jpeg";
import HeaderImage from "@/components/mdx/content/HeaderImage";
import GitHubLinkSection from "@/components/features/projects/GitHubLinkSection";
import Views from "@/app/notes/components/Views";
import { Badge } from "@/components/ui/badge";
import {
  pageVariants,
  containerVariants,
  itemVariants,
  buttonVariants,
  fadeVariants,
  slideUpVariants,
  getStaggerDelay,
  DURATION,
  EASING,
} from "@/lib/animations";

type UnifiedContent = (Project | Note) & {
  long_summary?: string;
  technologies?: string[];
  pinned?: boolean;
  readingTime?: string;
  demoUrl?: string;
  image_url?: string;
};

interface RelatedContentItem {
  title: string;
  image?: string;
  image_url?: string;
  summary: string;
  slug: string;
  date: string;
  readingTime: string;
}

interface ContentPageProps {
  content: UnifiedContent;
  type: "project" | "note";
  readingStats: { text: string };
  relatedItemsWithStats: RelatedContentItem[];
  renderedMDXContent: React.ReactElement;
}

export default function ContentPage({
  content,
  type,
  readingStats,
  relatedItemsWithStats,
  renderedMDXContent,
}: ContentPageProps): React.ReactElement | null {
  return (
    <motion.div
      className="mx-auto mb-12 flex max-w-4xl flex-col gap-12"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.article
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          transition={{
            delay: getStaggerDelay(0),
            duration: DURATION.slow,
            ease: EASING.easeOut,
          }}
        >
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: getStaggerDelay(1, 0.1),
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  {content.url && (
                    <>
                      <motion.div
                        className="flex flex-wrap items-center gap-1"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {content.technologies?.map((tech, index) => (
                          <motion.div
                            key={tech}
                            variants={buttonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: getStaggerDelay(index, 0.05),
                                duration: DURATION.normal,
                                ease: EASING.bouncy,
                              }}
                            >
                              <Badge variant="secondary">{tech}</Badge>
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: getStaggerDelay(2, 0.1),
                          duration: DURATION.normal,
                          ease: EASING.easeOut,
                        }}
                      >
                        <GitHubLinkSection
                          url={content.url}
                          demoUrl={content.demoUrl}
                        />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              ),
              extraInfo: (
                <motion.div
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: getStaggerDelay(3, 0.1),
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{readingStats.text}</span>
                  </div>
                  {type === "note" && (
                    <div className="flex items-center gap-1.5">
                      <Views slug={content.slug} />
                    </div>
                  )}
                </motion.div>
              ),
            }}
          />
        </motion.div>

        {content.image_url && (
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: getStaggerDelay(1),
              duration: DURATION.slow,
              ease: EASING.spring,
            }}
          >
            <div className="h-8" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: getStaggerDelay(1, 0.15),
                duration: DURATION.slow,
                ease: EASING.easeOut,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <HeaderImage
                imageSrc={content.image_url}
                imageAlt={`${content.title} project image`}
              />
            </motion.div>
            <div className="h-8" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: getStaggerDelay(content.image_url ? 2 : 1),
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <AnimatedMDXWrapper>{renderedMDXContent}</AnimatedMDXWrapper>
        </motion.div>
      </motion.article>

      <motion.div
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: getStaggerDelay(3),
          duration: DURATION.slow,
          ease: EASING.spring,
        }}
      >
        <motion.h2
          className="text-primary text-2xl font-bold leading-tight tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: getStaggerDelay(3, 0.1),
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          If you liked this {type}.
          <motion.p
            className="text-secondary mt-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: getStaggerDelay(3, 0.15),
              duration: DURATION.normal,
              ease: EASING.easeOut,
            }}
          >
            You will love these as well.
          </motion.p>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: getStaggerDelay(4),
          duration: DURATION.slow,
          ease: EASING.spring,
        }}
      >
        <RelatedContentList
          items={relatedItemsWithStats}
          basePath={`${type}s`}
        />
      </motion.div>
    </motion.div>
  );
}
