import React from "react";
import UniversalImage from "@/components/common/media/UniversalImage";
import Link from "@/components/common/ui/Link";

type HeaderImageProps = {
  imageSrc: string;
  imageAlt: string;
  imageAttribution?: {
    author: string;
    authorUrl: string;
  } | null;
};

const HeaderImage: React.FC<HeaderImageProps> = ({
  imageSrc,
  imageAlt,
  imageAttribution,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden">
        <UniversalImage
          src={imageSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover"
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
      </div>
      {imageAttribution && (
        <small className="text-tertiary italic">
          Photo by{" "}
          <Link href={imageAttribution.authorUrl}>
            {imageAttribution.author}
          </Link>{" "}
          on{" "}
          <Link
            href={`https://unsplash.com/?utm_source=nicholasadamou.com&utm_medium=referral`}
          >
            Unsplash
          </Link>
          .
        </small>
      )}
    </div>
  );
};

export default HeaderImage;
