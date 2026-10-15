"use client";

import { clientImages } from "@/lib/content/client-images";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { clients } from "@/lib/content/clients";
import { Eye } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useHomeLayout } from "@/hooks/use-home-layout";
import { useBatchViews } from "@/hooks/use-batch-views";
import SiteFooter from "@/components/layout/SiteFooter";
import BioSection from "@/components/home/BioSection";
import SmelterySpotlight from "@/components/projects/SmelterySpotlight";
import FeaturedGallery from "@/components/gallery/FeaturedGallery";
import GumroadSection from "@/components/home/GumroadSection";
import SpotifySection from "@/components/home/SpotifySection";
import { projects } from "@/lib/projects/config";
import { ProjectIcon } from "@/lib/projects/icons";
import ImagePreview from "@/components/ui/ImagePreview";
import type { VscoImage } from "@/types/vsco";
import type { Article } from "@/lib/content/mdx";

interface HomePageProps {
  photos?: VscoImage[];
  articles: Pick<Article, "slug" | "title" | "date" | "readTime" | "image">[];
}

export default function HomePage({ articles, photos = [] }: HomePageProps) {
  const {
    getTextColorClass,
    getLinkColorClass,
    getOpacityClass,
    getHrColorClass,
    shouldUseDarkText,
  } = useTheme();
  const { layout } = useHomeLayout();
  const slugs = useMemo(() => articles.map((a) => a.slug), [articles]);
  const viewCounts = useBatchViews(slugs);
  const isTwoCol = layout === "two-column";

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
            <h3 className="text-sm font-medium">Featured open-source tools</h3>
            <div className="space-y-4 sm:space-y-3">
              {projects
                .filter((p) => p.featured)
                .map((project) => (
                  <ImagePreview
                    key={project.name}
                    src={project.preview}
                    alt={`${project.name} preview`}
                  >
                    <div className="space-y-0.5">
                      <h3>
                        <Link
                          href={project.href}
                          target="_blank"
                          className={`flex items-center gap-1.5 text-sm !leading-snug font-medium transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
                        >
                          <ProjectIcon
                            icon={project.icon}
                            name={project.name}
                          />
                          {project.name.toLowerCase()}
                        </Link>
                      </h3>
                      <p className={`${getOpacityClass()}`}>
                        {project.description}
                      </p>
                    </div>
                  </ImagePreview>
                ))}
              <Link
                href="/projects"
                className={`text-sm transition-opacity hover:opacity-60 ${getOpacityClass()}`}
              >
                View all projects &rarr;
              </Link>
            </div>
          </div>

          <SmelterySpotlight compact />

          <hr className={hr} />

          <section
            className="space-y-4 sm:space-y-3"
            aria-labelledby="client-work-heading"
          >
            <div className="flex items-center justify-between">
              <h2
                id="client-work-heading"
                className={`${getOpacityClass()} text-sm`}
              >
                Client work
              </h2>
              <span className={`text-xs ${getOpacityClass()}`}>
                Selected websites
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              {clients.map((client) => (
                <ImagePreview
                  key={client.slug}
                  src={clientImages[client.slug].src}
                  alt={`${client.name} homepage`}
                >
                  <Link
                    href={`/clients/${client.slug}`}
                    aria-label={`Read the ${client.name} case study`}
                    className={`group block ${getLinkColorClass()}`}
                  >
                    <div className="overflow-hidden rounded-lg border border-current/10">
                      <Image
                        src={clientImages[client.slug]}
                        alt={`${client.name} homepage`}
                        width={1440}
                        height={900}
                        sizes="(max-width: 640px) 45vw, 160px"
                        className="aspect-[8/5] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                      />
                    </div>
                    <h3 className="mt-2 text-xs leading-snug font-medium">
                      {client.name}
                    </h3>
                    <p className={`mt-0.5 text-[11px] ${getOpacityClass()}`}>
                      {client.category}
                    </p>
                  </Link>
                </ImagePreview>
              ))}
            </div>
            <Link
              href="/clients"
              className={`inline-block text-sm transition-opacity hover:opacity-60 ${getOpacityClass()}`}
            >
              Explore client work &rarr;
            </Link>
          </section>
          <hr className={hr} />

          {/* Notes */}
          <div className="space-y-4 sm:space-y-3">
            <h2 className={`${getOpacityClass()} text-sm`}>Notes</h2>
            <h3 className="text-sm font-medium">Recent writing</h3>
            <div className="space-y-4 sm:space-y-3">
              {articles.map((article) => (
                <ImagePreview
                  key={article.slug}
                  src={article.image}
                  alt={`${article.title} header image`}
                >
                  <div className="space-y-0.5">
                    <h3>
                      <Link
                        href={`/notes/${article.slug}`}
                        className={`block text-sm !leading-snug font-medium transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
                      >
                        {article.title}
                      </Link>
                    </h3>
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

          <>
            {/* Photos */}
            <div className="space-y-4 sm:space-y-3">
              <h2 className={`${getOpacityClass()} text-sm`}>Photos</h2>
              <h3 className="text-sm font-medium">Photography gallery</h3>
              <FeaturedGallery photos={photos} />
              <Link
                href="/gallery"
                className={`text-sm transition-opacity hover:opacity-60 ${getOpacityClass()}`}
              >
                View gallery &rarr;
              </Link>
            </div>

            <hr className={hr} />
          </>
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
          <SiteFooter embedded />
        </div>
      </div>
    </main>
  );
}
