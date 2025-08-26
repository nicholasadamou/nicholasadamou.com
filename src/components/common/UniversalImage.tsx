"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type UniversalImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

// Types for the static manifest
interface ManifestImageData {
  id: string;
  optimized_url: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };
  user: {
    name: string;
    username: string;
    profile_url: string;
  };
  image_author: string;
  image_author_url: string;
  description?: string;
  width: number;
  height: number;
  cached_at: number;
}

interface UnsplashManifest {
  generated_at: string;
  images: Record<string, ManifestImageData>;
  stats: {
    total_found: number;
    successfully_cached: number;
    failed_to_cache: number;
  };
}

// Cache for the manifest to avoid multiple fetches
let manifestCache: UnsplashManifest | null = null;
let manifestFetchPromise: Promise<UnsplashManifest | null> | null = null;

// Fetch the static manifest
async function getUnsplashManifest(): Promise<UnsplashManifest | null> {
  if (manifestCache) {
    return manifestCache;
  }

  if (manifestFetchPromise) {
    return manifestFetchPromise;
  }

  manifestFetchPromise = (async () => {
    try {
      const response = await fetch("/unsplash-manifest.json");
      if (response.ok) {
        manifestCache = await response.json();
        console.log(
          "📄 Loaded Unsplash manifest with",
          Object.keys(manifestCache?.images || {}).length,
          "cached images"
        );
        return manifestCache;
      }
    } catch (error) {
      console.warn("Could not load Unsplash manifest:", error);
    }
    return null;
  })();

  return manifestFetchPromise;
}

// Extract Unsplash photo ID from page URL
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

const UniversalImage: React.FC<UniversalImageProps> = ({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  sizes,
  className,
}) => {
  const [actualImageSrc, setActualImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if this is an Unsplash page URL
    const isUnsplashPageUrl = src.includes("unsplash.com/photos/");

    if (!isUnsplashPageUrl) {
      // If it's already a direct image URL, use it as-is
      setActualImageSrc(src);
      return;
    }

    const fetchOptimizedImageUrl = async () => {
      const photoId = extractUnsplashPhotoId(src);
      if (!photoId) {
        // If we can't extract ID, don't render the image
        console.warn("Could not extract photo ID from Unsplash URL:", src);
        setActualImageSrc(null);
        return;
      }

      setLoading(true);

      try {
        // First, try to get the image from the static manifest
        const manifest = await getUnsplashManifest();
        if (manifest && manifest.images[photoId]) {
          const imageData = manifest.images[photoId];
          console.log(`🎯 Using cached image from manifest: ${photoId}`);

          // Use the optimized URL from the manifest
          if (imageData.optimized_url) {
            setActualImageSrc(imageData.optimized_url);
          } else if (imageData.urls?.regular) {
            setActualImageSrc(imageData.urls.regular);
          }
          setLoading(false);
          return;
        }

        // If not found in manifest, fall back to API call
        console.log(
          `🌐 Image not found in manifest, fetching from API: ${photoId}`
        );
        const response = await fetch(
          `/api/unsplash?action=get-photo&id=${photoId}`
        );

        if (response.ok) {
          const data = await response.json();
          // Use the optimized URL from the API response
          if (data.optimized_url) {
            setActualImageSrc(data.optimized_url);
          } else if (data.urls?.regular) {
            setActualImageSrc(data.urls.regular);
          }
        } else {
          // If API fails, don't render the image
          console.warn(
            "API call failed for photo ID:",
            photoId,
            "Status:",
            response.status
          );
          setActualImageSrc(null);
        }
      } catch (error) {
        // If error occurs, don't render the image
        console.error("Error fetching image:", error);
        setActualImageSrc(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOptimizedImageUrl();
  }, [src]);

  // Show loading state for Unsplash page URLs while fetching
  const isUnsplashPageUrl = src.includes("unsplash.com/photos/");
  if (isUnsplashPageUrl && loading) {
    return (
      <div
        className={`animate-pulse bg-secondary ${className}`}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      />
    );
  }

  // Only render the Image when we have a valid actualImageSrc
  if (!actualImageSrc) {
    return (
      <div
        className={`bg-secondary ${className}`}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      />
    );
  }

  return (
    <Image
      src={actualImageSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
};

export default UniversalImage;
