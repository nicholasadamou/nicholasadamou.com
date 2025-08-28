import React from "react";
import { motion } from "framer-motion";
import UniversalImage from "@/components/common/UniversalImage";
import type { Note } from "@/lib/contentlayer-data";

import Link from "@/components/common/Link";
import Section from "@/components/common/Section";
import { formatShortDate } from "@/lib/utils/formatShortDate";
import { Badge } from "@/components/ui/badge";
import readingTime from "reading-time";
import { Clock } from "lucide-react";
import { getBoundedPosition } from "@/lib/utils/getBoundedPosition";

type PostProps = {
  post: Note;
  shouldShowPin?: boolean;
  mousePosition?: {
    x: number;
    y: number;
  };
};

export default function Post({
  post,
  mousePosition,
  shouldShowPin,
}: PostProps) {
  const { date, slug, title, image, image_url, pinned } = post;

  const imageHeight = 200; // Set to desired height
  const imageWidth = 350; // Set to desired width
  const imageOffset = 24;

  const readingStats = readingTime(post.body.raw);

  const boundedPosition = mousePosition
    ? getBoundedPosition({
        mousePosition,
        imageWidth,
        imageHeight,
        imageOffset,
      })
    : { top: 0, left: 0 };

  return (
    <li className="group py-3 transition-opacity first:pt-0 last:pb-0">
      <Link href={`/notes/${slug}`}>
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
            <Section
              heading={formatShortDate(date)}
              isPinned={pinned}
              showPin={shouldShowPin}
            >
              <div className="flex flex-col gap-1">
                <span className="text-pretty font-medium leading-tight">
                  {title}
                </span>
                <span className="text-tertiary">{post.summary}</span>
                <div>
                  <Badge variant="secondary">
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} /> {readingStats.text}
                    </div>
                  </Badge>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </Link>
    </li>
  );
}
