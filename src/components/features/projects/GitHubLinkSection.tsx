"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, BookDashed } from "lucide-react";
import { LinkButton } from "@/components/mdx/interactive/LinkButton";
import {
  containerVariants,
  buttonVariants,
  itemVariants,
  getStaggerDelay,
  DURATION,
  EASING,
} from "@/lib/animations";

interface GitHubLinkSectionProps {
  url: string;
  demoUrl?: string;
}

const GitHubLinkSection: React.FC<GitHubLinkSectionProps> = ({
  url,
  demoUrl = "",
}) => {
  return (
    <motion.section
      className="animated-list animate-in flex max-w-full snap-x snap-mandatory flex-nowrap gap-3 overflow-x-scroll px-1 py-2 md:overflow-visible"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="min-w-fit snap-start p-1"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: getStaggerDelay(0),
          duration: DURATION.normal,
          ease: EASING.easeOut,
        }}
      >
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          style={{ transformOrigin: "center" }}
        >
          <LinkButton
            href={url || ""}
            icon={Github}
            className="btn-filled border transition-colors"
          >
            GitHub
          </LinkButton>
        </motion.div>
      </motion.div>

      {demoUrl && (
        <motion.div
          className="min-w-fit snap-start p-1"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: getStaggerDelay(1),
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            style={{ transformOrigin: "center" }}
          >
            <LinkButton
              href={demoUrl}
              icon={BookDashed}
              className="btn-outline border transition-colors"
            >
              Demo
            </LinkButton>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default GitHubLinkSection;
