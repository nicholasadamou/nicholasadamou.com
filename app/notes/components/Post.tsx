import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "@/app/components/Link";
import Section from "@/app/components/Section";
import { formatShortDate } from "@/app/_utils/formatShortDate";
import type { Note } from "contentlayer/generated";
import { useViews } from "@/app/notes/hooks/useViews";
import { Eye } from "lucide-react";

type PostProps = {
	post: Note;
	mousePosition?: {
		x: number;
		y: number;
	};
};

export default function Post({ post, mousePosition }: PostProps) {
	const { date, slug, title, image } = post;

	const viewCount = useViews({ slug });

	const imageHeight = 200; // Set to desired height
	const imageWidth = 350; // Set to desired width
	const imageOffset = 24;

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
							className="pointer-events-none absolute z-10 hidden overflow-hidden rounded-lg bg-tertiary shadow-sm sm:group-hover:block"
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
					<div className="flex items-center justify-between gap-6 mt-4">
						<Section heading={formatShortDate(date)}>
							<span className="font-medium leading-tight text-pretty">{title}</span>
						</Section>
						<div className="flex items-center text-sm text-muted-foreground">
							<Eye className="w-4 h-4 mr-1" />{" "}
							<span>{viewCount || 0}</span>
						</div>
					</div>
				</div>
			</Link>
		</li>
	);
}
