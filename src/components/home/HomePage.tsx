"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useHomeLayout } from "@/hooks/use-home-layout";
import { useBatchViews } from "@/hooks/use-batch-views";
import BioSection from "@/components/home/BioSection";
import FeaturedGallery from "@/components/gallery/FeaturedGallery";
import GumroadSection from "@/components/home/GumroadSection";
import SpotifySection from "@/components/home/SpotifySection";
import { projects } from "@/lib/projects/config";
import { ProjectIcon } from "@/lib/projects/icons";
import ImagePreview from "@/components/ui/ImagePreview";
import type { Article } from "@/lib/content/mdx";

interface HomePageProps {
  articles: Pick<Article, "slug" | "title" | "date" | "readTime" | "image">[];
}

export default function HomePage({ articles }: HomePageProps) {
  const {
    getTextColorClass,
    getLinkColorClass,
    getOpacityClass,
    getHrColorClass,
    shouldUseDarkText,
    isHydrated,
  } = useTheme();
  const { layout } = useHomeLayout();
  const slugs = useMemo(() => articles.map((a) => a.slug), [articles]);
  const viewCounts = useBatchViews(slugs);
  const isTwoCol = layout === "two-column";

  if (!isHydrated) {
    return <div className="flex h-screen items-center justify-center" />;
  }

  const light = shouldUseDarkText();
  const hr = `border-dashed ${getOpacityClass()} ${getHrColorClass()}`;

  return (
    <main
      className={`min-h-screen w-full font-sans transition-colors duration-200 ${
        isTwoCol ? "sm:h-screen" : ""
      } ${getTextColorClass()}`}
    >
      <div
        className={`flex flex-col justify-between gap-6 p-6 pb-32 text-sm ${
          isTwoCol
            ? "sm:h-full sm:flex-row sm:gap-0 sm:overflow-hidden sm:p-0"
            : "mx-auto sm:max-w-[30rem] sm:pt-10 sm:pb-24"
        }`}
      >
        {/* Bio */}
        <div
          className={`flex-1 space-y-6 ${
            isTwoCol ? "sm:max-w-[27rem] sm:p-10" : ""
          }`}
        >
          <BioSection
            light={light}
            opacityClass={getOpacityClass()}
            linkColorClass={getLinkColorClass()}
          />
        </div>

        <hr
          className={`animate-fadeInHome2 ${isTwoCol ? "sm:hidden" : ""} ${hr}`}
        />

        {/* Content */}
        <div
          className={`animate-fadeInHome2 no-scrollbar flex-1 space-y-6 ${
            isTwoCol
              ? "sm:h-full sm:max-w-[25rem] sm:overflow-y-auto sm:p-10"
              : ""
          }`}
        >
          {/* Projects */}
          <div className="space-y-4 sm:space-y-3">
            <h2 className={`${getOpacityClass()} text-sm`}>Projects</h2>
            <div className="space-y-4 sm:space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.name} className="space-y-0.5">
                  <Link
                    href={project.href}
                    target="_blank"
                    className={`flex items-center gap-1.5 text-sm !leading-snug font-medium transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
                  >
                    <ProjectIcon icon={project.icon} name={project.name} />
                    {project.name.toLowerCase()}
                  </Link>
                  <p className={`${getOpacityClass()}`}>
                    {project.description}
                  </p>
                </div>
              ))}
              <Link
                href="/projects"
                className={`text-sm transition-opacity hover:opacity-60 ${getOpacityClass()}`}
              >
                View all projects &rarr;
              </Link>
            </div>
          </div>

          <hr className={hr} />

          {/* Notes */}
          <div className="space-y-4 sm:space-y-3">
            <h2 className={`${getOpacityClass()} text-sm`}>Notes</h2>
            <div className="space-y-4 sm:space-y-3">
              {articles.map((article) => (
                <ImagePreview
                  key={article.slug}
                  src={article.image}
                  alt={`${article.title} header image`}
                >
                  <div className="space-y-0.5">
                    <Link
                      href={`/notes/${article.slug}`}
                      className={`block text-sm !leading-snug font-medium transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
                    >
                      {article.title}
                    </Link>
                    <p
                      className={`flex items-center gap-1.5 ${getOpacityClass()}`}
                    >
                      <span>
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="opacity-50">/</span>
                      <span>{article.readTime}</span>
                      <span className="opacity-50">/</span>
                      {viewCounts[article.slug] ? (
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {viewCounts[article.slug].toLocaleString()}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </ImagePreview>
              ))}
              <Link
                href="/notes"
                className={`text-sm transition-opacity hover:opacity-60 ${getOpacityClass()}`}
              >
                View all notes &rarr;
              </Link>
            </div>
          </div>

          <hr className={hr} />

          {/* Photos */}
          <div className="space-y-4 sm:space-y-3">
            <h2 className={`${getOpacityClass()} text-sm`}>Photos</h2>
            <FeaturedGallery />
            <Link
              href="/gallery"
              className={`text-sm transition-opacity hover:opacity-60 ${getOpacityClass()}`}
            >
              View gallery &rarr;
            </Link>
          </div>

          <hr className={hr} />

          {/* Spotify */}
          <SpotifySection
            light={light}
            opacityClass={getOpacityClass()}
            linkColorClass={getLinkColorClass()}
          />

          <hr className={hr} />

          {/* Gumroad Products */}
          <GumroadSection
            light={light}
            opacityClass={getOpacityClass()}
            linkColorClass={getLinkColorClass()}
          />
        </div>
      </div>
    </main>
  );
}
