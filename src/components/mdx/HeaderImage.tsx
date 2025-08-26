import React, { useState, useEffect } from "react";
import UniversalImage from "@/components/common/UniversalImage";
import Link from "@/components/common/Link";

type ImageAttributionProps = {
  imageSrc: string;
  imageAlt: string;
};

type UnsplashAuthorData = {
  image_author: string;
  image_author_url: string;
} | null;

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

// Extract Unsplash photo ID from image URL
function extractUnsplashPhotoId(url: string): string | null {
  if (!url || !url.includes("unsplash.com/photos/")) return null;

  // Handle page URLs: https://unsplash.com/photos/{slug}-{id}
  // The photo ID is typically the last segment after the final hyphen and contains alphanumeric characters and underscores
  const pageUrlMatch = url.match(
    /https:\/\/unsplash\.com\/photos\/.*-([a-zA-Z0-9_-]{11})(?:[\?#]|$)/
  );
  if (pageUrlMatch) {
    return pageUrlMatch[1];
  }

  // Handle simple page URLs: https://unsplash.com/photos/{id}
  // For URLs that might just be the photo ID without a slug
  const simplePageMatch = url.match(
    /https:\/\/unsplash\.com\/photos\/([a-zA-Z0-9_-]{11})(?:[\?#]|$)/
  );
  if (simplePageMatch) {
    return simplePageMatch[1];
  }

  return null;
}

const HeaderImage: React.FC<ImageAttributionProps> = ({
  imageSrc,
  imageAlt,
}) => {
  const [unsplashData, setUnsplashData] = useState<UnsplashAuthorData>(null);
  const [loading, setLoading] = useState(false);

  // Check if this is an Unsplash image and fetch author data
  const isUnsplashImage = imageSrc.includes("unsplash.com");

  useEffect(() => {
    if (!isUnsplashImage) return;

    const fetchUnsplashData = async () => {
      const photoId = extractUnsplashPhotoId(imageSrc);
      if (!photoId) return; // Only works with proper Unsplash page URLs

      setLoading(true);

      try {
        const response = await fetch(
          `/api/unsplash?action=get-photo&id=${photoId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.image_author && data.image_author_url) {
            setUnsplashData({
              image_author: data.image_author,
              image_author_url: data.image_author_url,
            });
          }
        }
        // If the lookup fails, we'll just not show attribution
      } catch (error) {
        // Silently fail - just don't show attribution
      } finally {
        setLoading(false);
      }
    };

    fetchUnsplashData();
  }, [imageSrc, isUnsplashImage]);

  // Use dynamically fetched author data
  const finalAuthor = unsplashData?.image_author;
  const finalAuthorUrl = unsplashData?.image_author_url;

  const hasAttribution = finalAuthor && finalAuthorUrl && isUnsplashImage;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[350px] overflow-hidden">
        <UniversalImage
          src={imageSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
        />
      </div>
      {hasAttribution && (
        <small className="italic text-tertiary">
          Photo by <Link href={finalAuthorUrl}>{finalAuthor}</Link> on{" "}
          <Link
            href={`${imageSrc}?utm_source=nicholasadamou.com&utm_medium=referral`}
          >
            Unsplash
          </Link>
          .{loading && <span className="ml-1 opacity-50">...</span>}
        </small>
      )}
    </div>
  );
};

export default HeaderImage;
