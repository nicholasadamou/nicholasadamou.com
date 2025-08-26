/**
 * Image Fallback Utility
 *
 * Provides a seamless fallback system for Unsplash images:
 * 1. Try local downloaded image first
 * 2. Fall back to external API/URL
 */

import React from "react";

// Types for better TypeScript support
export interface LocalImageManifest {
  generated_at: string;
  version: string;
  source_manifest: string;
  images: Record<
    string,
    {
      local_path: string;
      original_url: string;
      author: string;
      downloaded_at: string;
      skipped?: boolean;
      reason?: string;
    }
  >;
  stats: {
    total_images: number;
    downloaded: number;
    failed: number;
    skipped: number;
  };
}

export interface ImageMetadata {
  photoId: string | null;
  localPath: string | null;
  author: string | null;
  isLocal: boolean;
}

// Cache for the local manifest to avoid multiple fetches
let localManifestCache: LocalImageManifest | null = null;
let localManifestFetchPromise: Promise<LocalImageManifest | null> | null = null;

// Dynamically load the local manifest (handles cases where it might not exist)
async function loadLocalManifest(): Promise<LocalImageManifest | null> {
  if (localManifestCache !== null) {
    return localManifestCache;
  }

  if (localManifestFetchPromise) {
    return localManifestFetchPromise;
  }

  localManifestFetchPromise = (async (): Promise<LocalImageManifest | null> => {
    try {
      const response = await fetch("/images/unsplash/local-manifest.json");
      if (response.ok) {
        localManifestCache = await response.json();
        console.log(
          "🖼️ Loaded local image manifest with",
          Object.keys(localManifestCache?.images || {}).length,
          "local images"
        );
        return localManifestCache;
      } else {
        console.log(
          "📄 Local image manifest not available, using fallback system"
        );
        localManifestCache = {
          generated_at: "",
          version: "",
          source_manifest: "",
          images: {},
          stats: { total_images: 0, downloaded: 0, failed: 0, skipped: 0 },
        };
        return localManifestCache;
      }
    } catch (error) {
      console.log("📄 Local image manifest not found, using fallback system");
      localManifestCache = {
        generated_at: "",
        version: "",
        source_manifest: "",
        images: {},
        stats: { total_images: 0, downloaded: 0, failed: 0, skipped: 0 },
      };
      return localManifestCache;
    }
  })();

  return localManifestFetchPromise;
}

/**
 * Extract Unsplash photo ID from a URL
 * Mirrors the logic from your existing scripts
 */
export function extractUnsplashPhotoId(url: string): string | null {
  if (!url || !url.includes("unsplash.com/photos/")) return null;

  // Clean the URL first by removing any trailing punctuation
  const cleanUrl = url.replace(/["'.,;:!?]+$/, "");

  // Handle page URLs: https://unsplash.com/photos/{slug}-{id}
  const pageUrlMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/.*-([a-zA-Z0-9_-]{11})(?:[\?#]|$)/
  );
  if (pageUrlMatch) {
    return pageUrlMatch[1];
  }

  // Handle simple page URLs: https://unsplash.com/photos/{id}
  const simplePageMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/([a-zA-Z0-9_-]{11})(?:[\?#]|$)/
  );
  if (simplePageMatch) {
    return simplePageMatch[1];
  }

  // Handle URLs where the ID is at the end of the path (without slug)
  const endMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/[^/]*([a-zA-Z0-9_-]{11})$/
  );
  if (endMatch) {
    return endMatch[1];
  }

  return null;
}

/**
 * Get the best available image source with fallback logic
 * @param imageUrl - The original Unsplash URL
 * @param fallbackUrl - Fallback URL (usually your API endpoint)
 * @returns Promise<string> - The best available image URL
 */
export async function getOptimizedImageSrc(
  imageUrl: string,
  fallbackUrl?: string
): Promise<string> {
  // Extract the photo ID
  const photoId = extractUnsplashPhotoId(imageUrl);

  if (!photoId) {
    return fallbackUrl || imageUrl;
  }

  // Load local manifest
  const manifest = await loadLocalManifest();

  if (!manifest) {
    return fallbackUrl || imageUrl;
  }

  // Try local image first
  const localImage = manifest.images[photoId];
  if (localImage?.local_path) {
    return localImage.local_path;
  }

  // Fall back to provided fallback URL or original URL
  return fallbackUrl || imageUrl;
}

/**
 * Synchronous version that works with static imports
 * Use this if you can import the manifest at build time
 */
export function getOptimizedImageSrcSync(
  imageUrl: string,
  fallbackUrl?: string,
  staticManifest?: any
): string {
  const photoId = extractUnsplashPhotoId(imageUrl);

  if (!photoId || !staticManifest) {
    return fallbackUrl || imageUrl;
  }

  const localImage = staticManifest.images[photoId];
  if (localImage?.local_path) {
    return localImage.local_path;
  }

  return fallbackUrl || imageUrl;
}

/**
 * Get image metadata from local manifest
 */
export async function getImageMetadata(imageUrl: string): Promise<{
  photoId: string | null;
  localPath: string | null;
  author: string | null;
  isLocal: boolean;
} | null> {
  const photoId = extractUnsplashPhotoId(imageUrl);

  if (!photoId) {
    return null;
  }

  const manifest = await loadLocalManifest();
  if (!manifest) {
    return {
      photoId,
      localPath: null,
      author: null,
      isLocal: false,
    };
  }

  const localImage = manifest.images[photoId];

  return {
    photoId,
    localPath: localImage?.local_path || null,
    author: localImage?.author || null,
    isLocal: !!localImage?.local_path,
  };
}

/**
 * Check if an image is available locally
 */
export async function isImageLocal(imageUrl: string): Promise<boolean> {
  const metadata = await getImageMetadata(imageUrl);
  return metadata?.isLocal || false;
}

/**
 * Hook for React components
 */
export function useOptimizedImage(imageUrl: string, fallbackUrl?: string) {
  const [optimizedSrc, setOptimizedSrc] = React.useState(
    fallbackUrl || imageUrl
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLocal, setIsLocal] = React.useState(false);

  React.useEffect(() => {
    getOptimizedImageSrc(imageUrl, fallbackUrl).then((src) => {
      setOptimizedSrc(src);
      setIsLocal(src.startsWith("/images/unsplash/"));
      setIsLoading(false);
    });
  }, [imageUrl, fallbackUrl]);

  return {
    src: optimizedSrc,
    isLoading,
    isLocal,
  };
}
