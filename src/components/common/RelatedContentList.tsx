import React from "react";
import UniversalImage from "@/components/common/UniversalImage";

interface RelatedContentItem {
  title: string;
  image?: string;
  image_url?: string;
  summary: string;
  slug: string;
  date: string;
  readingTime?: string;
}

interface RelatedContentListProps {
  items: RelatedContentItem[];
  basePath: string;
}

export const RelatedContentList: React.FC<RelatedContentListProps> = ({
  items,
  basePath,
}) => (
  <div className="flex max-w-fit flex-wrap gap-8 md:gap-5">
    {items.map(({ title, image, image_url, summary, slug, readingTime }) => (
      <a
        key={slug}
        href={`/${basePath}/${slug}`}
        className="flex w-full flex-col gap-2 md:w-1/3 md:flex-1"
      >
        {(image_url || image) && (
          <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[200px]">
            <UniversalImage
              src={image_url || image || ""}
              alt={`${title} image`}
              fill
              className="rounded-lg object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
            />
          </div>
        )}
        <p className="text-md font-bold leading-tight tracking-tight text-primary md:text-xl">
          {title} — {readingTime}
        </p>
        <p className="text-secondary">{summary}</p>
      </a>
    ))}
  </div>
);
