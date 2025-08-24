import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Note } from "@/lib/contentlayer-data";

import Link from "@/app/components/Link";
import Section from "@/app/components/Section";
import { formatShortDate } from "@/app/utils/formatShortDate";
import { Badge } from "@/app/components/ui/badge";
import readingTime from "reading-time";
import { Clock } from "lucide-react";

type PostProps = {
	post: Note;
	shouldShowPin?: boolean;
	mousePosition?: {
		x: number;
		y: number;
	};
};

export default function Post({ post, mousePosition, shouldShowPin }: PostProps) {
	const { date, slug, title, image, pinned } = post;

	const imageHeight = 200; // Set to desired height
	const imageWidth = 350; // Set to desired width
	const imageOffset = 24;

	const readingStats = readingTime(post.body.raw);

	return (
    <li className="group py-3 transition-opacity first:pt-0 last:pb-0">
      <Link href={`/notes/${slug}`}>
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
                className: "pointer-events-none absolute z-10 hidden overflow-hidden rounded-lg bg-tertiary shadow-sm sm:group-hover:block"
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
            <Section heading={formatShortDate(date)} isPinned={pinned} showPin={shouldShowPin}>
              <div className="flex flex-col gap-1">
                <span className="text-pretty font-medium leading-tight">
                  {title}
                </span>
                <span className="text-tertiary">{post.summary}</span>
								<div>
									<Badge variant="secondary">
										<div className="flex gap-1.5 items-center">
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
