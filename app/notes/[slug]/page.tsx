import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import readingTime from "reading-time";

import { allNotes } from "contentlayer/generated";

import Avatar from "@/app/components/Avatar";
import Link from "@/app/components/Link";

import Mdx from "@/app/components/mdx/MdxWrapper";
import ProjectLink from "@/app/components/mdx/ProjectLink";
import HeaderImage from "@/app/components/mdx/HeaderImage";

import Views from "@/app/notes/components/Views";

import Me from "@/public/avatar.png";

import {
  formatLongDateWithSuffix,
  formatShortDate,
} from "@/app/_utils/formatShortDate";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";


const baseUrl = getBaseUrl();

type Props = {
  params: {
    slug: string;
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = allNotes.find(
    (note: { slug: string }) => note.slug === params.slug,
  );

  if (!note) {
    notFound();
  }

  const {
    title,
    date: publishedTime,
    summary: description,
    image,
    slug,
  } = note;

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
      images: [{ url: ogImage, alt: title }],
    },
  };
}

type NoteProps = {
  params: { slug: string; id: string };
};

export default async function Note({ params }: NoteProps) {
  const note = allNotes.find(
    (note: { slug: string }) => note.slug === params.slug,
  );

  if (!note) {
    notFound();
  }

  const readingStats = readingTime(note.body.raw);

  return (
    <div className="mx-auto flex max-w-[700px] flex-col gap-12 px-4">
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

            {note.url && (
              <ProjectLink url={note.url} />
            )}
          </div>
          <div className="flex max-w-none items-center gap-4">
            <Avatar src={Me} initials="na" size="sm" />
            <div className="leading-tight">
              <Link underline href="/about">Nicholas Adamou</Link>
              <p className="flex flex-row justify-center gap-1 mt-1 text-secondary text-sm md:text-md">
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
						<HeaderImage
							imageSrc={note.image}
							imageAlt={`${note.title} note image`}
							imageAuthor={note.image_author}
							imageAuthorUrl={note.image_author_url}
							imageUrl={note.image_url}
						/>
          </>
        )}
        <div className="h-8" />
        <div className="prose prose-neutral text-pretty">
          <Mdx code={note.body.code} />
        </div>
      </article>
      {allNotes.length > 1 && (
        <>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-primary md:text-2xl">
            If you found this note helpful.
            <p className="mt-1 text-secondary">
              You will love these ones as well.
            </p>
          </h2>
          <div className="flex w-[100%] flex-wrap gap-8 md:w-[1000px] md:gap-5">
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
                    className="flex w-full flex-col gap-2 md:w-1/3"
                  >
                    <div className="relative h-[200px] overflow-hidden rounded-lg md:h-[300px]">
                      <Image
                        src={image}
                        alt={`${title} note image`}
                        fill
                        className="rounded-lg object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                      />
                    </div>
                    <h3 className="text-md leading-tight tracking-tight text-secondary md:text-xl">
                      {formatLongDateWithSuffix(date)} — {readingStats.text}
                    </h3>
                    <p className="text-md font-bold leading-tight tracking-tight text-primary md:text-xl">
                      {title}
                    </p>
                  </a>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
