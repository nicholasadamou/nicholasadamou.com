import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
  const { date, slug, title, image, pinned } = project;

  const imageHeight = 200; // Set to desired height
  const imageWidth = 350; // Set to desired width
  const imageOffset = 24;

  return (
    <li className="group py-3 transition-opacity first:pt-0 last:pb-0">
      <Link href={`/projects/${slug}`}>
        <div className="transition-opacity">
          {image && mousePosition && (
            <motion.div
              animate={{
                top: mousePosition.y - imageHeight - imageOffset,
                left: mousePosition.x - imageWidth / 2,
              }}
              initial={false}
              transition={{ ease: "easeOut" }}
              style={{ width: imageWidth, height: imageHeight }}
              {...({
                className:
                  "pointer-events-none absolute z-10 hidden overflow-hidden rounded-lg bg-tertiary shadow-sm sm:group-hover:block",
              } as any)}
            >
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                style={{ objectFit: "cover" }}
                className="rounded-lg"
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
