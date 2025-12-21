import React from "react";
import { motion } from "framer-motion";
import UniversalImage from "@/components/common/media/UniversalImage";
import type { Note } from "@/lib/contentlayer-data";

import Link from "@/components/common/ui/Link";
import Section from "@/components/common/layout/Section";
import ImagePreview from "@/components/common/ui/ImagePreview";
import { formatShortDate } from "@/lib/utils/formatShortDate";
import { Badge } from "@/components/ui/badge";
import readingTime from "reading-time";
import { Clock } from "lucide-react";
import { cardVariants, DURATION, EASING } from "@/lib/animations";

type PostProps = {
  post: Note;
  shouldShowPin?: boolean;
};

export default function Post({ post, shouldShowPin }: PostProps) {
  const { date, slug, title, image, image_url, pinned } = post;

  const readingStats = readingTime(post.body.raw);

  return (
    <ImagePreview src={image_url || image} alt={`${title} header image`}>
      <motion.li
        className="group py-3 transition-opacity first:pt-0 last:pb-0"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        layout
      >
        <Link href={`/notes/${slug}`}>
          <motion.div className="transition-opacity" layout>
            <motion.div
              className="mt-4 flex items-center justify-between gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: DURATION.normal,
                ease: EASING.easeOut,
              }}
            >
              <Section
                heading={formatShortDate(date)}
                isPinned={pinned}
                showPin={shouldShowPin}
              >
                <motion.div
                  className="flex flex-col gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  <motion.span
                    className="text-pretty font-medium leading-tight"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3,
                      duration: DURATION.normal,
                      ease: EASING.easeOut,
                    }}
                  >
                    {title}
                  </motion.span>
                  <motion.span
                    className="text-tertiary"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.4,
                      duration: DURATION.normal,
                      ease: EASING.easeOut,
                    }}
                  >
                    {post.summary}
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: DURATION.normal,
                      ease: EASING.bouncy,
                    }}
                  >
                    <Badge variant="secondary">
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} /> {readingStats.text}
                      </div>
                    </Badge>
                  </motion.div>
                </motion.div>
              </Section>
            </motion.div>
          </motion.div>
        </Link>
      </motion.li>
    </ImagePreview>
  );
}
