import React from "react";
import { motion } from "framer-motion";
import UniversalImage from "@/components/common/UniversalImage";
import Link from "@/components/common/Link";
import Section from "@/components/common/Section";
import ImagePreview from "@/components/common/ImagePreview";
import { formatShortDate } from "@/lib/utils/formatShortDate";
import type { Project } from "@/lib/contentlayer-data";
import { Badge } from "@/components/ui/badge";
import {
  cardVariants,
  buttonVariants,
  DURATION,
  EASING,
  getStaggerDelay,
} from "@/lib/animations";

type ProjectProps = {
  project: Project;
  shouldShowPin?: boolean;
};

export default function Project({
  project,
  shouldShowPin = true,
}: ProjectProps) {
  const { date, slug, title, image, image_url, pinned } = project;

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
        <Link href={`/projects/${slug}`}>
          <motion.div className="transition-opacity" layout>
            <motion.div
              className="mt-4 flex items-center justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  <motion.span
                    className="flex gap-2 text-pretty font-medium leading-tight"
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
                    {project.summary}
                  </motion.span>
                  <motion.div
                    className="flex flex-wrap items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: DURATION.normal,
                      ease: EASING.easeOut,
                    }}
                  >
                    {project.technologies?.map((tech, index) => (
                      <motion.div
                        key={tech}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        style={{
                          animationDelay: getStaggerDelay(index, 0.05) + "s",
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.6 + getStaggerDelay(index, 0.05),
                            duration: DURATION.normal,
                            ease: EASING.bouncy,
                          }}
                        >
                          <Badge variant="secondary">{tech}</Badge>
                        </motion.div>
                      </motion.div>
                    ))}
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
