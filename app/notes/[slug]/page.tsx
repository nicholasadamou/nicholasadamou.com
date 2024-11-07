import { headers } from 'next/headers';
import Image from "next/image";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import readingTime from "reading-time";

import {allNotes} from "contentlayer/generated";

import Avatar from "@/app/components/Avatar";
import Mdx from "@/app/notes/components/MdxWrapper";
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
	const note = allNotes.find((note: { slug: string }) => note.slug === params.slug);

	if (!note) {
		notFound();
	}

	const { title, date: publishedTime, summary: description, image, slug } = note;

	const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}&type=note`;

	return {
		metadataBase: new URL(baseUrl),
		title: `${title} | Nicholas Adamou`,
		description,
		openGraph: {
			title: `${title} | Nicholas Adamou`,
			description,
			type: "article",
			publishedTime,
			url: `${baseUrl}/notes/${slug}`,
			images: [{url: ogImage, alt: title}],
		},
	};
}

export default async function Note({ params }: Readonly<{ params: any }>) {
  const note = allNotes.find((note: { slug: any; }) => note.slug === params.slug);

  if (!note) {
    notFound();
  }

	const readingStats = readingTime(note.body.raw);

  return (
		<div className="flex flex-col gap-12 px-4 max-w-[700px] mx-auto">
			<article>
				<div className="flex flex-col gap-8">
					<Link href="/notes" underline>
						← Back to Notes
					</Link>
					<div className="flex max-w-xl flex-col gap-4 text-pretty">
						<h1 className="text-3xl font-bold leading-tight tracking-tight text-primary">
							{note.title}
						</h1>
						<p className="text-secondary">{note.summary}</p>
					</div>
					<div className="flex max-w-none items-center gap-4">
						<Avatar src={Me} initials="na" size="sm" />
						<div className="leading-tight">
							<p>Nicholas Adamou</p>
							<p className="text-secondary">
								<time dateTime={note.date}>{formatShortDate(note.date)}</time>
								{note.updatedAt
									? `(Updated ${formatShortDate(note.updatedAt)})`
									: ""}
								{" · "}
								{readingStats.text}
								{" · "}
								<Views slug={note.slug} />
							</p>
						</div>
					</div>
				</div>
				{note.image && (
					<>
						<div className="h-8" />
						<div className="relative h-[350px] overflow-hidden">
							<Image
								src={note.image}
								alt={`${note.title} note image`}
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
					<Mdx code={note.body.code} />
				</div>
			</article>
			{allNotes.length > 1 && (
				<>
					<h2 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-primary">
						If you found this note helpful.
						<p className="mt-1 text-secondary">You will love these ones as well.</p>
					</h2>
					<div className="flex flex-wrap md:w-[1000px] w-[100%] md:gap-5 gap-8">
						{allNotes
							.filter((b) => b.slug !== note.slug)
							.slice(0, 2)
							.map((note) => {
								const { title, date, image, slug } = note;
								const readingStats = readingTime(note.body.raw);

								return (
									<a
										key={slug}
										href={`/notes/${slug}`}
										className="flex flex-col gap-2 w-full md:w-1/3"
									>
										<div className="relative h-[200px] md:h-[300px] overflow-hidden rounded-lg">
											<Image
												src={image}
												alt={`${title} note image`}
												fill
												className="rounded-lg object-cover"
												priority
												sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
											/>
										</div>
										<h3 className="text-md md:text-xl leading-tight tracking-tight text-secondary">
											{formatLongDateWithSuffix(date)} — {readingStats.text}
										</h3>
										<p className="text-md md:text-xl font-bold leading-tight tracking-tight text-primary">{title}</p>
									</a>
								)
							})}
					</div>
				</>
			)}
		</div>
	);
}

async function Views({ slug }: Readonly<{ slug: string }>) {
	let noteViews = await getViewsCount();
	const viewsForNotes = noteViews.find((view) => view.slug === slug);

	const reqHeaders = headers();
	await incrementViews(slug, reqHeaders);

	return (
		<span>
      <FlipNumber>{viewsForNotes?.count ?? 0}</FlipNumber>
			{viewsForNotes?.count === 1 ? " view" : " views"}
    </span>
	);
}
