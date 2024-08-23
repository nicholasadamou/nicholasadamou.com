import { allProjects } from "contentlayer/generated";
import { notFound } from "next/navigation";
import readingTime from "reading-time";

import Avatar from "@/app/components/Avatar";
import Link from "@/app/components/Link";
import Mdx from "@/app/blog/components/MdxWrapper";
import Me from "@/public/avatar.png";
import React from "react";
import Image from "next/image";

export default function Project({ params }: { params: any }) {
  const project = allProjects.find((project) => project.slug === params.slug);

  if (!project) {
    notFound();
  }

	const readingStats = readingTime(project.body.raw);

  return (
		<div className="flex flex-col gap-14">
			<article>
				<div className="flex flex-col gap-8">
					<div className="flex max-w-xl flex-col gap-4 text-pretty">
						<h1 className="text-3xl font-bold leading-tight tracking-tight text-primary">
							{project.title}
						</h1>
						<p className="text-secondary">
							{project.longSummary || project.summary}
						</p>
						<Link underline href={project.url || ""}>
							Visit Project
						</Link>
					</div>
					<div className="flex max-w-none items-center gap-4">
						<Avatar src={Me} initials="br" size="sm" />
						<div className="leading-tight">
							<p>Nicholas Adamou</p>
							<p className="text-secondary">
								<time dateTime={project.date}>{project.date}</time>
								{" · "}
								{readingStats.text}
							</p>
						</div>
					</div>
				</div>
				<div className="h-16" />
				<div className="project prose prose-neutral">
					<Mdx code={project.body.code} />
				</div>
			</article>
			<h2 className="text-2xl font-bold leading-tight tracking-tight text-primary">
				If you liked this project.
				<p className="mt-1 text-secondary">You will love these ones as well.</p>
			</h2>
			<div className="flex flex-wrap md:w-[1000px] w-[100%] md:gap-5 gap-8">
				{allProjects
					.filter((p) => p.slug !== project.slug)
					.slice(0, 2)
					.map((project) => {
						const { title, image, summary, slug } = project;
						const readingStats = readingTime(project.body.raw);

						return (
							<a
								key={slug}
								href={`/projects/${slug}`}
								className="flex flex-col gap-2 w-full md:w-1/3"
							>
								<div className="relative h-[300px] overflow-hidden rounded-lg">
									<Image
										src={image}
										alt={`${title} project image`}
										fill
										className="rounded-lg object-cover"
										priority
										sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
									/>
								</div>
								<p className="text-xl font-bold leading-tight tracking-tight text-primary">{title} — {readingStats.text}</p>
								<p className="text-secondary">{summary}</p>
							</a>
						)
					})}
			</div>
		</div>
	);
}
