import Image from "next/image";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import readingTime from "reading-time";

import {allBlogs} from "contentlayer/generated";

import Avatar from "@/app/components/Avatar";
import Mdx from "@/app/blog/components/MdxWrapper";
import FlipNumber from "@/app/components/FlipNumber";
import Link from "@/app/components/Link";
import Me from "@/public/avatar.png";

import { formatLongDateWithSuffix, formatShortDate } from "@/app/_utils/formatShortDate";
import {getViewsCount} from "@/app/db/queries";
import {incrementViews} from "@/app/db/actions";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";
import React from "react";

const baseUrl = getBaseUrl();

type Props = {
  params: {
    slug: string;
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const blog = allBlogs.find((blog: { slug: string }) => blog.slug === params.slug);

	if (!blog) {
		notFound();
	}

	const { title, date: publishedTime, summary: description, image, slug } = blog;

	const ogImage = image
		? `${baseUrl}/${image}`
		: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;

	return {
		metadataBase: new URL(baseUrl),
		title: `${title} | Nicholas Adamou`,
		description,
		openGraph: {
			title: `${title} | Nicholas Adamou`,
			description,
			type: "article",
			publishedTime,
			url: `${baseUrl}/blog/${slug}`,
			images: [{url: ogImage, alt: title}],
		},
	};
}

export default async function Blog({ params }: Readonly<{ params: any }>) {
  const blog = allBlogs.find((blog: { slug: any; }) => blog.slug === params.slug);

  if (!blog) {
    notFound();
  }

	const readingStats = readingTime(blog.body.raw);

  return (
		<div className="flex flex-col gap-14">
			<article>
				<div className="flex flex-col gap-8">
					<Link href="/blog" underline>
						← Back to Overview
					</Link>
					<div className="flex max-w-xl flex-col gap-4 text-pretty">
						<h1 className="text-3xl font-bold leading-tight tracking-tight text-primary">
							{blog.title}
						</h1>
						<p className="text-secondary">{blog.summary}</p>
					</div>
					<div className="flex max-w-none items-center gap-4">
						<Avatar src={Me} initials="na" size="sm" />
						<div className="leading-tight">
							<p>Nicholas Adamou</p>
							<p className="text-secondary">
								<time dateTime={blog.date}>{formatShortDate(blog.date)}</time>
								{blog.updatedAt
									? `(Updated ${formatShortDate(blog.updatedAt)})`
									: ""}
								{" · "}
								{readingStats.text}
								{" · "}
								<Views slug={blog.slug} />
							</p>
						</div>
					</div>
				</div>
				{blog.image && (
					<>
						<div className="h-8" />
						<div className="relative h-[350px] overflow-hidden">
							<Image
								src={blog.image}
								alt={`${blog.title} blog image`}
								fill
								className="rounded-lg object-cover"
								priority
								sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
							/>
						</div>
					</>
				)}
				<div className="h-16" />
				<div className="prose prose-neutral text-pretty">
					<Mdx code={blog.body.code} />
				</div>
			</article>
			<h2 className="text-2xl font-bold leading-tight tracking-tight text-primary">
				If you found this article helpful.
				<p className="mt-1 text-secondary">You will love these ones as well.</p>
			</h2>
			<div className="flex flex-wrap md:w-[1000px] w-[100%] md:gap-5 gap-8">
				{allBlogs
					.filter((b) => b.slug !== blog.slug)
					.slice(0, 2)
					.map((blog) => {
						const { title, date, image, slug } = blog;
						const readingStats = readingTime(blog.body.raw);

						return (
							<a
								key={slug}
								href={`/blog/${slug}`}
								className="flex flex-col gap-2 w-full md:w-1/3"
							>
								<div className="relative h-[300px] overflow-hidden rounded-lg">
									<Image
										src={image}
										alt={`${title} blog image`}
										fill
										className="rounded-lg object-cover"
										priority
										sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
									/>
								</div>
								<h3 className="text-xl leading-tight tracking-tight text-secondary">
									{formatLongDateWithSuffix(date)} — {readingStats.text}
								</h3>
								<p className="text-xl font-bold leading-tight tracking-tight text-primary">{title}</p>
							</a>
						)
					})}
			</div>
		</div>
	);
}

async function Views({ slug }: Readonly<{ slug: string }>) {
	let blogViews = await getViewsCount();
	const viewsForBlog = blogViews.find((view) => view.slug === slug);

	await incrementViews(slug);

	return (
		<span>
      <FlipNumber>{viewsForBlog?.count ?? 0}</FlipNumber>
			{viewsForBlog?.count === 1 ? " view" : " views"}
    </span>
	);
}
