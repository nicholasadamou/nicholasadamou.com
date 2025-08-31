"use client";

import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type ContentImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  priority?: boolean;
  contained?: boolean;
  size?: "base" | "lg";
  className?: string;
};

/**
 * Enhanced Image component that automatically resolves images from content directories
 *
 * Usage in MDX:
 * <ImageFromContent src="diagram.png" alt="System architecture" caption="Our system design" />
 * <ImageFromContent src="hero.png" alt="Hero image" size="lg" priority />
 */
export default function ImageFromContent({
  src,
  alt,
  width = 800,
  height = 600,
  caption,
  priority = false,
  contained = true,
  size = "base",
  className,
}: ContentImageProps) {
  const pathname = usePathname();

  // Extract content type and slug from pathname
  // e.g., /notes/my-post -> contentType: notes, slug: my-post
  const pathParts = pathname.split("/").filter(Boolean);
  const contentType = pathParts[0]; // notes or projects
  const slug = pathParts[1];

  // Resolve image path
  let imageSrc = src;
  if (!src.startsWith("http") && !src.startsWith("/")) {
    // For relative paths, assume it's co-located with the content
    imageSrc = `/${contentType}/${slug}/${src}`;
  }

  return (
    <div className={clsx("not-prose my-8 w-full", className)}>
      <figure className="m-0 flex flex-col gap-2">
        <Image
          src={imageSrc}
          width={width}
          height={height}
          alt={alt}
          priority={priority}
          className={clsx(
            "h-auto w-full",
            contained &&
              "overflow-hidden rounded-md border border-secondary bg-secondary md:rounded-lg",
            size === "lg" && "max-w-none md:-ml-20 md:w-[calc(100%+160px)]"
          )}
        />
        {caption && (
          <figcaption className="text-center text-sm italic text-tertiary">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
