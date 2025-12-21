"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Avatar from "@/components/common/ui/Avatar";
import Link from "@/components/common/ui/Link";
import {
  containerVariants,
  itemVariants,
  buttonVariants,
  slideUpVariants,
  getStaggerDelay,
  DURATION,
  EASING,
} from "@/lib/animations";

interface ContentHeaderProps {
  title: string;
  longSummary?: string;
  summary: string;
  date: string | Date;
  author: { name: string; avatar: string };
  additionalInfo: {
    backLink: string;
    backText: string;
    linkSection?: React.ReactNode;
    extraInfo?: React.ReactNode;
  };
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  title,
  longSummary,
  summary,
  date,
  author,
  additionalInfo,
}) => {
  // Ensure date is a string for rendering
  const dateString =
    date instanceof Date ? date.toISOString().split("T")[0] : date;

  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        transition={{
          delay: getStaggerDelay(0),
          duration: DURATION.normal,
          ease: EASING.easeOut,
        }}
      >
        <motion.div
          initial={{ opacity: 0.7 }}
          whileHover={{
            opacity: 1,
            x: -2,
            transition: {
              duration: DURATION.fast,
              ease: EASING.easeOut,
            },
          }}
          whileTap={{
            opacity: 0.8,
            transition: {
              duration: DURATION.fast,
              ease: EASING.easeOut,
            },
          }}
        >
          <Link href={additionalInfo.backLink}>
            ← {additionalInfo.backText}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex max-w-3xl flex-col gap-4 text-pretty"
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: getStaggerDelay(1),
          duration: DURATION.slow,
          ease: EASING.spring,
        }}
      >
        <motion.h1
          className="text-primary text-3xl font-bold leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: getStaggerDelay(1, 0.1),
            duration: DURATION.slow,
            ease: EASING.easeOut,
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: getStaggerDelay(2, 0.1),
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          {longSummary || summary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: getStaggerDelay(3, 0.1),
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          {additionalInfo.linkSection}
        </motion.div>
      </motion.div>

      <motion.div
        className="flex max-w-none items-center gap-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: getStaggerDelay(4),
          duration: DURATION.normal,
          ease: EASING.easeOut,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: getStaggerDelay(4, 0.05),
            duration: DURATION.normal,
            ease: EASING.bouncy,
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Avatar src={author.avatar} initials="na" size="sm" />
        </motion.div>

        <motion.div
          className="leading-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: getStaggerDelay(4, 0.1),
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: getStaggerDelay(4, 0.15),
              duration: DURATION.normal,
              ease: EASING.easeOut,
            }}
          >
            {author.name}
          </motion.div>

          <motion.div
            className="md:text-md text-secondary mt-1 flex flex-row flex-wrap items-center gap-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: getStaggerDelay(4, 0.2),
              duration: DURATION.normal,
              ease: EASING.easeOut,
            }}
          >
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: getStaggerDelay(4, 0.25),
                duration: DURATION.normal,
                ease: EASING.easeOut,
              }}
            >
              <Calendar size={14} />
              <time dateTime={dateString}>{dateString}</time>
            </motion.div>
            {additionalInfo.extraInfo}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
