import Image from "next/image";
import arizona from "../../../public/images/gallery/arizona.jpg";
import lakePlacid from "../../../public/images/gallery/lake-placid.jpg";
import rhodeIsland from "../../../public/images/gallery/road-island.jpg";
import cactus from "../../../public/images/gallery/cactus.jpg";

const photos = [
  { src: arizona, alt: "Arizona" },
  { src: lakePlacid, alt: "Lake Placid" },
  { src: rhodeIsland, alt: "Rhode Island" },
  { src: cactus, alt: "Cactus" },
];

export default function FeaturedGallery() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.map(({ src, alt }) => (
        <a
          key={src.src}
          href={src.src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${alt} photograph`}
          className="group relative aspect-square overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Image
            src={src}
            alt={alt}
            fill
            placeholder="blur"
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
            sizes="(max-width: 640px) 45vw, 200px"
          />
        </a>
      ))}
    </div>
  );
}
