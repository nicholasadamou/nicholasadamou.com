"use client";

import { Eye } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useViews } from "@/hooks/use-views";
import RelatedArticles from "@/components/notes/RelatedArticles";
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
  const { getTextColorClass, isHydrated, shouldUseDarkText } = useTheme();
  const views = useViews(slug);

  if (!isHydrated) {
    return <main className="min-h-screen" />;
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lightProseClasses = `prose-stone prose-headings:text-stone-950 prose-p:text-stone-950/80
    prose-a:text-stone-950/80 hover:prose-a:opacity-60
    prose-strong:text-stone-950 prose-li:text-stone-950/80
    prose-blockquote:text-stone-950/70 prose-blockquote:border-stone-950/10
    prose-hr:border-stone-950/10 prose-a:border-stone-950/20`;

  const darkProseClasses = `prose-invert prose-headings:text-white prose-p:text-white/80
    prose-a:text-white/80 hover:prose-a:opacity-60
    prose-strong:text-white prose-li:text-white/80
    prose-blockquote:text-white/70 prose-blockquote:border-white/10
    prose-hr:border-white/10 prose-a:border-white/20`;

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-[45rem] px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <article>
          <header className="mb-8">
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
            <div className="mb-8 space-y-2">
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

          <div
            className={`prose prose-base sm:prose-lg prose-headings:font-medium prose-headings:transition-colors prose-h2:text-2xl
              prose-h2:mt-10 sm:prose-h2:mt-12
              prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 sm:prose-h3:mt-8
              prose-h3:mb-3 prose-p:leading-[1.75] prose-p:transition-colors prose-a:no-underline
              prose-a:border-b prose-a:border-dashed
              prose-a:pb-0.5 prose-a:font-normal prose-a:transition-opacity prose-strong:font-medium prose-strong:transition-colors prose-ul:my-4
              prose-ol:my-4 prose-ol:pl-5
              prose-ul:pl-5 prose-li:pl-0.5 prose-li:my-2 prose-li:leading-[1.75] prose-li:transition-colors
              prose-blockquote:font-normal prose-blockquote:border-l-2 prose-blockquote:pl-4
              prose-blockquote:my-6 prose-blockquote:transition-colors prose-hr:my-8 prose-hr:transition-colors prose-img:rounded-md
              prose-video:my-8 prose-video:rounded-md
              prose-code:before:content-none
              prose-code:after:content-none max-w-none
              transition-colors duration-200
              ${shouldUseDarkText() ? lightProseClasses : darkProseClasses}`}
          >
            {children}
          </div>
        </article>

        {relatedArticles && relatedArticles.length > 0 && (
          <RelatedArticles articles={relatedArticles} />
        )}
      </div>
    </main>
  );
}
