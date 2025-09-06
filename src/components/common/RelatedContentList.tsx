"use client";

import React from "react";
import { motion } from "framer-motion";
import UniversalImage from "@/components/common/UniversalImage";
import {
  containerVariants,
  cardVariants,
  imageHoverVariants,
  buttonVariants,
  getStaggerDelay,
  DURATION,
  EASING,
} from "@/lib/animations";

interface RelatedContentItem {
  title: string;
  image?: string;
  image_url?: string;
  summary: string;
  slug: string;
  date: string;
  readingTime?: string;
}

interface RelatedContentListProps {
  items: RelatedContentItem[];
  basePath: string;
}

export const RelatedContentList: React.FC<RelatedContentListProps> = ({
  items,
  basePath,
}) => (
  <motion.div
    className="flex max-w-fit flex-wrap gap-8 md:gap-5"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {items.map(
      ({ title, image, image_url, summary, slug, readingTime }, index) => (
        <motion.a
          key={slug}
          href={`/${basePath}/${slug}`}
          className="flex w-full flex-col gap-2 md:w-1/3 md:flex-1"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          transition={{
            delay: getStaggerDelay(index, 0.1),
            duration: DURATION.slow,
            ease: EASING.easeOut,
          }}
        >
          {(image_url || image) && (
            <motion.div
              className="relative h-[300px] overflow-hidden rounded-lg md:h-[200px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: getStaggerDelay(index, 0.15),
                duration: DURATION.normal,
                ease: EASING.easeOut,
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: DURATION.normal, ease: EASING.easeOut },
              }}
            >
              <motion.div
                variants={imageHoverVariants}
                initial="initial"
                whileHover="hover"
              >
                <UniversalImage
                  src={image_url || image || ""}
                  alt={`${title} image`}
                  fill
                  className="rounded-lg object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                />
              </motion.div>
            </motion.div>
          )}

          <motion.p
            className="text-md text-primary font-bold leading-tight tracking-tight md:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: getStaggerDelay(index, 0.2),
              duration: DURATION.normal,
              ease: EASING.easeOut,
            }}
          >
            {title} — {readingTime}
          </motion.p>

          <motion.p
            className="text-secondary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: getStaggerDelay(index, 0.25),
              duration: DURATION.normal,
              ease: EASING.easeOut,
            }}
          >
            {summary}
          </motion.p>
        </motion.a>
      )
    )}
  </motion.div>
);
