"use client";

import { readingProse } from "@/lib/styles/reading-prose";
import { Eye, Pencil } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useViews } from "@/hooks/use-views";
import RelatedArticles from "@/components/notes/RelatedArticles";
import TableOfContents from "@/components/notes/TableOfContents";
import UniversalImage from "@/components/ui/UniversalImage";

interface ArticlePageProps {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  image?: string | null;
  imageAttribution?: { author: string; authorUrl: string } | null;
  relatedArticles?: {
    slug: string;
    title: string;
    summary: string;
    readTime: string;
    image: string | null;
  }[];
  children: React.ReactNode;
}

export default function ArticlePage({
  slug,
  title,
  date,
  readTime,
  image,
  imageAttribution,
  relatedArticles,
  children,
}: ArticlePageProps) {
  const { getTextColorClass, shouldUseDarkText } = useTheme();
  const views = useViews(slug);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-[45rem] px-5 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <article>
          <header className="animate-fadeInText mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm opacity-60 sm:text-base">
              <time>{formattedDate}</time>
              <span className="opacity-50">/</span>
              <span>{readTime}</span>
              <span className="opacity-50">/</span>
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {views.toLocaleString()}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-medium sm:text-4xl">{title}</h1>
          </header>

          {image && (
            <div className="animate-fadeInHome1 mb-8 space-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <UniversalImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 45rem"
                />
              </div>
              {imageAttribution && (
                <p className="text-xs opacity-40">
                  Photo by{" "}
                  <a
                    href={imageAttribution.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {imageAttribution.author}
                  </a>{" "}
                  on{" "}
                  <a
                    href="https://unsplash.com/?utm_source=nicholasadamou.com&utm_medium=referral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Unsplash
                  </a>
                </p>
              )}
            </div>
          )}

          <TableOfContents />

          <div className={readingProse(shouldUseDarkText())}>{children}</div>
        </article>

        <section className="animate-fadeInHome2 mt-16 mb-8">
          <div
            className={`rounded-lg border border-dashed p-6 ${
              shouldUseDarkText() ? "border-stone-950/10" : "border-white/10"
            }`}
          >
            <div className="flex items-start gap-4">
              <Pencil
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  shouldUseDarkText() ? "text-stone-950/40" : "text-white/40"
                }`}
              />
              <div>
                <h3 className="text-base font-medium">Found a mistake?</h3>
                <p
                  className={`mt-1 text-sm ${
                    shouldUseDarkText() ? "text-stone-950/60" : "text-white/60"
                  }`}
                >
                  Every post is a Markdown file so contributing is simple as
                  following the link below and pressing the pencil icon inside
                  GitHub to edit it.
                </p>
                <a
                  href={`https://github.com/nicholasadamou/nicholasadamou.com/edit/main/content/notes/${slug}.mdx`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-60 ${
                    shouldUseDarkText() ? "text-stone-950/80" : "text-white/80"
                  }`}
                >
                  Edit on GitHub
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {relatedArticles && relatedArticles.length > 0 && (
          <RelatedArticles articles={relatedArticles} />
        )}
      </div>
    </main>
  );
}
