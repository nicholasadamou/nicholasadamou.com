"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  extractUnsplashPhotoId,
  getOptimizedImageSrc,
} from "@/lib/image-fallback";

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
        // PRODUCTION: Always use Unsplash CDN URLs to comply with hotlinking requirement
        // Per Unsplash API Terms: "Photos must be hotlinked to the original image URL on Unsplash"
        if (process.env.NODE_ENV === "production") {
          // STEP 1: Try the static build manifest (cached at build time)
          const manifest = await getUnsplashManifest();
          if (manifest && manifest.images[photoId]) {
            const imageData = manifest.images[photoId];
            console.log(
              `🎯 Using Unsplash CDN from build manifest: ${photoId}`
            );

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
            console.log(
              `🏠 Using local downloaded image (dev only): ${photoId}`
            );
            setActualImageSrc(localImageSrc);
            setLoading(false);
            return;
          }

          // Try the static build manifest in development too
          const manifest = await getUnsplashManifest();
          if (manifest && manifest.images[photoId]) {
            const imageData = manifest.images[photoId];
            console.log(
              `🎯 Using cached image from build manifest: ${photoId}`
            );

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
        console.log(
          `🌐 Image not found locally or in manifest, fetching from API: ${photoId}`
        );

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
            console.log(
              `✅ Successfully fetched image via API fallback: ${photoId}`
            );

            // Use the optimized URL from the API response
            if (data.optimized_url) {
              setActualImageSrc(data.optimized_url);
            } else if (data.urls?.regular) {
              setActualImageSrc(data.urls.regular);
            } else {
              console.warn(
                `⚠️ No usable URLs in API response for ${photoId}:`,
                data
              );
              setActualImageSrc(null);
            }
          } else {
            // If API fails, log detailed error information
            const errorText = await response
              .text()
              .catch(() => "Unknown error");
            console.warn(
              `❌ API fallback failed for photo ID: ${photoId}`,
              `Status: ${response.status}`,
              `Error: ${errorText}`
            );
            setActualImageSrc(null);
          }
        } catch (fetchError) {
          if (
            fetchError instanceof Error &&
            fetchError.name === "TimeoutError"
          ) {
            console.warn(`⏰ API fallback timeout for photo ID: ${photoId}`);
          } else {
            console.warn(
              `❌ API fallback network error for photo ID: ${photoId}:`,
              fetchError
            );
          }
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
