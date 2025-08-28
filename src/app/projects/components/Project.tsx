import React from "react";
import { motion } from "framer-motion";
import UniversalImage from "@/components/common/UniversalImage";
import Link from "@/components/common/Link";
import Section from "@/components/common/Section";
import { formatShortDate } from "@/lib/utils/formatShortDate";
import type { Project } from "@/lib/contentlayer-data";
import { Badge } from "@/components/ui/badge";

type ProjectProps = {
  project: Project;
  mousePosition?: {
    x: number;
    y: number;
  };
};

export default function Project({ project, mousePosition }: ProjectProps) {
  const { date, slug, title, image, image_url, pinned } = project;

  const imageHeight = 200; // Set to desired height
  const imageWidth = 350; // Set to desired width
  const imageOffset = 24;

  // Calculate bounded position to prevent image from going off-screen
  const getBoundedPosition = () => {
    if (!mousePosition) return { top: 0, left: 0 };

    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 768;

    let top = mousePosition.y - imageHeight - imageOffset;
    let left = mousePosition.x - imageWidth / 2;

    // Prevent going off the right edge
    if (left + imageWidth > viewportWidth - 20) {
      left = viewportWidth - imageWidth - 20;
    }

    // Prevent going off the left edge
    if (left < 20) {
      left = 20;
    }

    // Prevent going off the top edge
    if (top < 20) {
      top = mousePosition.y + imageOffset;
    }

    // Prevent going off the bottom edge
    if (top + imageHeight > viewportHeight - 20) {
      top = viewportHeight - imageHeight - 20;
    }

    return { top, left };
  };

  const boundedPosition = getBoundedPosition();

  return (
    <li className="group py-3 transition-opacity first:pt-0 last:pb-0">
      <Link href={`/projects/${slug}`}>
        <div className="transition-opacity">
          {(image_url || image) && mousePosition && (
            <motion.div
              animate={boundedPosition}
              initial={false}
              transition={{ ease: "easeOut" }}
              style={{ width: imageWidth, height: imageHeight }}
              {...({
                className:
                  "pointer-events-none absolute z-10 hidden overflow-hidden rounded-lg bg-tertiary shadow-sm sm:group-hover:block",
              } as any)}
            >
              <UniversalImage
                src={image_url || image || ""}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                className="rounded-lg object-cover"
                priority
              />
            </motion.div>
          )}
          <div className="mt-4 flex items-center justify-between gap-6">
            <Section heading={formatShortDate(date)} isPinned={pinned}>
              <div>
                <span className="flex gap-2 text-pretty font-medium leading-tight">
                  {title}
                </span>
                <span className="text-tertiary">{project.summary}</span>
                <div className="flex flex-wrap items-center gap-1">
                  {project.technologies?.map((tech) => (
                    <Badge variant="secondary" key={tech}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        </div>
      </Link>
    </li>
  );
}
