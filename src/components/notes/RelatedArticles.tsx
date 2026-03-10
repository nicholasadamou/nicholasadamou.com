"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import UniversalImage from "@/components/ui/UniversalImage";

interface RelatedArticle {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  image: string | null;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  const { getTextColorClass, getOpacityClass, shouldUseDarkText } = useTheme();

  if (articles.length === 0) return null;

  const headingColor = shouldUseDarkText() ? "text-stone-950" : "text-white";
  const subColor = shouldUseDarkText() ? "text-stone-950/50" : "text-white/50";

  return (
    <section className="mb-8 mt-16">
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${headingColor}`}>
          If you liked this note.
        </h2>
        <p className={`text-xl ${subColor}`}>You will love these as well.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/notes/${article.slug}`}
            className="group flex flex-col gap-3"
          >
            {article.image && (
              <div className="relative h-[200px] overflow-hidden rounded-lg md:h-[180px]">
                <UniversalImage
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <p className={`font-bold leading-tight ${getTextColorClass()}`}>
              {article.title} — {article.readTime}
            </p>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              {article.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
