"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  extractUnsplashPhotoId,
  getOptimizedImageSrc,
} from "@/lib/image/fallback";
import { logger } from "@/lib/logger";

type UniversalImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
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
        // Manifest loaded successfully (silent)
        return manifestCache;
      }
    } catch (error) {
      logger.warn("Could not load Unsplash manifest:", error);
    }
    return null;
  })();

  return manifestFetchPromise;
}

const UniversalImage: React.FC<UniversalImageProps> = ({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  fetchPriority,
  sizes,
  className,
  objectFit = "cover",
  objectPosition = "center",
}) => {
  const [actualImageSrc, setActualImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

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
        logger.warn("Could not extract photo ID from Unsplash URL:", src);
        setActualImageSrc(null);
        return;
      }

      setLoading(true);

      try {
        // PRODUCTION: Always use Unsplash CDN URLs to comply with hotlinking requirement
        // Per Unsplash API Terms: "Photos must be hotlinked to the original image URL on Unsplash"
        if (process.env.NODE_ENV === "production") {
          // STEP 1: Try the static build manifest (cached at build time)
          const manifest = await getUnsplashManifest();
          if (manifest && manifest.images[photoId]) {
            const imageData = manifest.images[photoId];
            // Using cached manifest image (silent)

            // Use the optimized URL from the manifest (Unsplash CDN)
            if (imageData.optimized_url) {
              setActualImageSrc(imageData.optimized_url);
            } else if (imageData.urls?.regular) {
              setActualImageSrc(imageData.urls.regular);
            }
            setLoading(false);
            return;
          }

          // STEP 2: Fall back to runtime API call
        } else {
          // DEVELOPMENT: Try local downloaded images first for faster loading
          const localImageSrc = await getOptimizedImageSrc(src);
          if (
            localImageSrc !== src &&
            localImageSrc.startsWith("/images/unsplash/")
          ) {
            // Using local image (silent)
            setActualImageSrc(localImageSrc);
            setLoading(false);
            return;
          }

          // Try the static build manifest in development too
          const manifest = await getUnsplashManifest();
          if (manifest && manifest.images[photoId]) {
            const imageData = manifest.images[photoId];
            // Using cached image (silent)

            // Use the optimized URL from the manifest
            if (imageData.optimized_url) {
              setActualImageSrc(imageData.optimized_url);
            } else if (imageData.urls?.regular) {
              setActualImageSrc(imageData.urls.regular);
            }
            setLoading(false);
            return;
          }
        }

        // STEP 3: Fall back to runtime API call (both prod and dev)
        // Only log failures, not routine API fallbacks

        try {
          const response = await fetch(
            `/api/unsplash?action=get-photo&id=${photoId}`,
            {
              // Add timeout and retry logic
              signal: AbortSignal.timeout(10000), // 10 second timeout
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Successfully fetched (silent)

            // Use the optimized URL from the API response
            if (data.optimized_url) {
              setActualImageSrc(data.optimized_url);
            } else if (data.urls?.regular) {
              setActualImageSrc(data.urls.regular);
            } else {
              logger.warn(
                `No usable URLs in API response for ${photoId}:`,
                data
              );
              setActualImageSrc(null);
            }
          } else if (response.status === 429) {
            // Handle rate limit specifically - don't retry, just show placeholder
            logger.warn(
              `Rate limit encountered for photo ID: ${photoId}. Showing placeholder instead of retrying.`
            );
            setIsRateLimited(true);
            setActualImageSrc(null);
          } else {
            // If API fails, log detailed error information
            const errorText = await response
              .text()
              .catch(() => "Unknown error");
            logger.warn(`API fallback failed for photo ID: ${photoId}`, {
              status: response.status,
              error: errorText,
            });
            setActualImageSrc(null);
          }
        } catch (fetchError) {
          if (
            fetchError instanceof Error &&
            fetchError.name === "TimeoutError"
          ) {
            logger.warn(`API fallback timeout for photo ID: ${photoId}`);
          } else {
            logger.warn(
              `API fallback network error for photo ID: ${photoId}:`,
              fetchError
            );
          }
          setActualImageSrc(null);
        }
      } catch (error) {
        // If error occurs, don't render the image
        logger.error("Error fetching image:", error);
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
        className={`bg-secondary animate-pulse ${className}`}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      />
    );
  }

  // Only render the Image when we have a valid actualImageSrc
  if (!actualImageSrc) {
    const isUnsplash = src.includes("unsplash.com");
    return (
      <div
        className={`bg-secondary flex items-center justify-center ${className}`}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      >
        {isRateLimited && isUnsplash ? (
          <div className="p-4 text-center">
            <div className="mb-2 text-2xl">🚫</div>
            <div className="text-tertiary text-sm">
              Image temporarily unavailable
              <br />
              <span className="text-xs opacity-70">Rate limit reached</span>
            </div>
          </div>
        ) : (
          isUnsplash && (
            <div className="p-4 text-center">
              <div className="mb-2 text-2xl">🖼️</div>
              <div className="text-tertiary text-sm">Image unavailable</div>
            </div>
          )
        )}
      </div>
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
      fetchPriority={fetchPriority}
      sizes={sizes}
      className={className}
      style={{
        objectFit,
        objectPosition,
      }}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
      loading={priority ? undefined : "lazy"}
    />
  );
};

export default UniversalImage;
