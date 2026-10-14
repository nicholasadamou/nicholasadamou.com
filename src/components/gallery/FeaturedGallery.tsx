import Image from "next/image";
import type { VscoImage } from "@/types/vsco";

export default function FeaturedGallery({ photos }: { photos: VscoImage[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.map(({ id, url, alt }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${alt || "gallery"} photograph`}
          className="group relative aspect-square overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Image
            src={url}
            alt={alt || "Gallery photograph"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
            sizes="(max-width: 640px) 45vw, 200px"
          />
        </a>
      ))}
    </div>
  );
}
