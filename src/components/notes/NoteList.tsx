"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useViews } from "@/hooks/use-views";
import UniversalImage from "@/components/ui/UniversalImage";
import ImagePreview from "@/components/ui/ImagePreview";

function NoteViewCount({ slug }: { slug: string }) {
  const views = useViews(slug, false);
  if (!views) return null;
  return (
    <span className="flex items-center gap-1">
      <Eye size={12} />
      {views.toLocaleString()}
    </span>
  );
}

interface ArticleItem {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  pinned?: boolean;
  image?: string | null;
}

interface NoteListProps {
  articles: ArticleItem[];
}

export default function NoteList({ articles }: NoteListProps) {
  const {
    getTextColorClass,
    getLinkColorClass,
    getOpacityClass,
    shouldUseDarkText,
    isHydrated,
  } = useTheme();

  const [search, setSearch] = useState("");

  const pinnedArticles = useMemo(
    () => articles.filter((a) => a.pinned),
    [articles]
  );

  const filtered = useMemo(() => {
    const list = search.trim() ? articles : articles.filter((a) => !a.pinned);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }, [articles, search]);

  if (!isHydrated) {
    return <main className="min-h-screen" />;
  }

  const inputBg = shouldUseDarkText()
    ? "bg-stone-950/5 placeholder:text-stone-950/30 focus:ring-stone-950/10"
    : "bg-white/5 placeholder:text-white/30 focus:ring-white/10";

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-[45rem] px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <div className="animate-fadeInHome1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">Notes</h1>
            <p className={`text-sm ${getOpacityClass()}`}>
              {articles.length} posts about software engineering, architecture,
              and developer tools.
            </p>
          </div>

          {/* Pinned notes */}
          {!search && pinnedArticles.length > 0 && (
            <div className="space-y-4">
              <h2
                className={`text-xs font-medium uppercase tracking-wider ${getOpacityClass()}`}
              >
                Pinned
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pinnedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/notes/${article.slug}`}
                    className="group block space-y-3"
                  >
                    {article.image && (
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <UniversalImage
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <span
                        className={`block text-sm font-medium !leading-snug transition-opacity group-hover:opacity-60 ${getLinkColorClass()}`}
                      >
                        {article.title}
                      </span>
                      <p
                        className={`line-clamp-2 text-sm leading-relaxed ${getOpacityClass()}`}
                      >
                        {article.summary}
                      </p>
                      <span
                        className={`flex items-center gap-2 text-xs ${getOpacityClass()}`}
                      >
                        {article.readTime}
                        <NoteViewCount slug={article.slug} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg border-none px-4 py-2.5 text-sm outline-none transition-colors focus:ring-1 ${inputBg}`}
          />

          <div className="animate-fadeInHome2 space-y-6">
            {filtered.map((article) => (
              <ImagePreview
                key={article.slug}
                src={article.image}
                alt={`${article.title} header image`}
              >
                <Link
                  href={`/notes/${article.slug}`}
                  className="group block space-y-1"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className={`text-sm font-medium !leading-snug transition-opacity group-hover:opacity-60 ${getLinkColorClass()}`}
                    >
                      {article.title}
                    </span>
                    <span
                      className={`flex shrink-0 items-center gap-2 text-xs ${getOpacityClass()}`}
                    >
                      {article.readTime}
                      <NoteViewCount slug={article.slug} />
                    </span>
                  </div>
                  <p
                    className={`line-clamp-2 text-sm leading-relaxed ${getOpacityClass()}`}
                  >
                    {article.summary}
                  </p>
                </Link>
              </ImagePreview>
            ))}

            {filtered.length === 0 && (
              <p className={`text-sm ${getOpacityClass()}`}>
                No notes found for &ldquo;{search}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
