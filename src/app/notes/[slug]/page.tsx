import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkSimplePlantuml from "@akebifiky/remark-simple-plantuml";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "@mapbox/rehype-prism";
import rehypeKatex from "rehype-katex";
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getRelatedArticles,
} from "@/lib/content/mdx";
import { resolveImageUrl, getAttribution } from "@/lib/image/unsplash";
import ArticlePage from "@/components/notes/ArticlePage";
import { Table } from "@/components/mdx/Table";
import { YouTubeEmbed } from "@/components/mdx/YouTubeEmbed";

import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const { generateOGUrl, getBaseUrl } = await import("@/lib/og");
  const baseUrl = getBaseUrl();
  const imageForOG = article.image ? resolveImageUrl(article.image) : undefined;
  const ogImageUrl = generateOGUrl({
    title: article.title,
    description: article.summary,
    type: "note",
    ...(imageForOG && { image: imageForOG }),
  });

  return {
    title: `${article.title} — Nicholas Adamou`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      images: [
        {
          url: `${baseUrl}${ogImageUrl}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [`${baseUrl}${ogImageUrl}`],
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const image = article.image ? resolveImageUrl(article.image) : null;
  const imageAttribution = article.image ? getAttribution(article.image) : null;

  const related = getRelatedArticles(slug).map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    readTime: a.readTime,
    image: a.image ? resolveImageUrl(a.image) : null,
  }));

  return (
    <ArticlePage
      slug={slug}
      title={article.title}
      date={article.date}
      readTime={article.readTime}
      image={image}
      imageAttribution={imageAttribution}
      relatedArticles={related}
    >
      <MDXRemote
        source={article.body.raw}
        components={{ Table, YouTubeEmbed }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkSimplePlantuml, remarkMath],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              rehypePrism as any,
              rehypeKatex,
            ],
          },
        }}
      />
    </ArticlePage>
  );
}
