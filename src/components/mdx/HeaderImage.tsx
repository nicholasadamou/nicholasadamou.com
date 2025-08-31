"use client";

import React, { useState, useEffect } from "react";
import UniversalImage from "@/components/common/UniversalImage";
import Link from "@/components/common/Link";
import { extractUnsplashPhotoId, getImageMetadata } from "@/lib/image-fallback";

type ImageAttributionProps = {
  imageSrc: string;
  imageAlt: string;
};

type UnsplashAuthorData = {
  image_author: string;
  image_author_url: string;
  isLocal?: boolean;
} | null;
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
        // STEP 1: Try to get author info from local manifest first
        const imageMetadata = await getImageMetadata(imageSrc);
        if (imageMetadata?.isLocal && imageMetadata.author) {
          console.log(`🏠 Using local author data for ${photoId}`);
          setUnsplashData({
            image_author: imageMetadata.author,
            image_author_url: `https://unsplash.com/@${imageMetadata.author.toLowerCase().replace(/\s+/g, "")}`,
            isLocal: true,
          });
          setLoading(false);
          return;
        }

        // STEP 2: Fall back to API call for author data
        console.log(`🌐 Fetching author data from API for ${photoId}`);
        const response = await fetch(
          `/api/unsplash?action=get-photo&id=${photoId}`,
          {
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000), // 5 second timeout for attribution
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.image_author && data.image_author_url) {
            setUnsplashData({
              image_author: data.image_author,
              image_author_url: data.image_author_url,
              isLocal: false,
            });
          }
        } else if (response.status === 429) {
          // Handle rate limit - just don't show attribution
          console.warn(
            `🚫 Rate limit encountered while fetching author data for ${photoId}. Skipping attribution.`
          );
        }
        // If the lookup fails, we'll just not show attribution
      } catch (error) {
        // Handle timeout and other errors - just don't show attribution
        if (error instanceof Error && error.name === "TimeoutError") {
          console.warn(`⌚ Timeout fetching author data for ${photoId}`);
        } else {
          console.warn("Failed to fetch image metadata:", error);
        }
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
      <div className="relative aspect-video w-full overflow-hidden">
        <UniversalImage
          src={imageSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />
      </div>
      {hasAttribution && (
        <small className="text-tertiary italic">
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
