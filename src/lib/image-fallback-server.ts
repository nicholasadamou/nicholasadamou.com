/**
 * Server-side Image Fallback Utility
 *
 * For use in build-time processes, SSR, and Node.js environments
 */

import fs from "fs";
import path from "path";
import {
  extractUnsplashPhotoId,
  LocalImageManifest,
  ImageMetadata,
} from "./image-fallback";

// Server-side cached manifest
let serverManifestCache: LocalImageManifest | null = null;

/**
 * Load the local manifest synchronously (server-side only)
 */
export function loadLocalManifestSync(): LocalImageManifest | null {
  if (serverManifestCache) {
    return serverManifestCache;
  }

  const manifestPath = path.join(
    process.cwd(),
    "public",
    "images",
    "unsplash",
    "local-manifest.json"
  );

  try {
    if (fs.existsSync(manifestPath)) {
      const manifestContent = fs.readFileSync(manifestPath, "utf-8");
      serverManifestCache = JSON.parse(manifestContent);
      console.log(
        "🖼️ [Server] Loaded local image manifest with",
        Object.keys(serverManifestCache?.images || {}).length,
        "local images"
      );
      return serverManifestCache;
    } else {
      console.log("📄 [Server] Local image manifest not found");
      serverManifestCache = {
        generated_at: "",
        version: "",
        source_manifest: "",
        images: {},
        stats: { total_images: 0, downloaded: 0, failed: 0, skipped: 0 },
      };
      return serverManifestCache;
    }
  } catch (error) {
    console.warn("[Server] Failed to load local manifest:", error);
    serverManifestCache = {
      generated_at: "",
      version: "",
      source_manifest: "",
      images: {},
      stats: { total_images: 0, downloaded: 0, failed: 0, skipped: 0 },
    };
    return serverManifestCache;
  }
}

/**
 * Get optimized image source synchronously (server-side)
 */
export function getOptimizedImageSrcSync(
  imageUrl: string,
  fallbackUrl?: string
): string {
  const photoId = extractUnsplashPhotoId(imageUrl);

  if (!photoId) {
    return fallbackUrl || imageUrl;
  }

  const manifest = loadLocalManifestSync();
  const localImage = manifest.images[photoId];

  if (localImage?.local_path) {
    console.log(`🏠 [Server] Using local image for ${photoId}`);
    return localImage.local_path;
  }

  return fallbackUrl || imageUrl;
}

/**
 * Get image metadata synchronously (server-side)
 */
export function getImageMetadataSync(imageUrl: string): ImageMetadata | null {
  const photoId = extractUnsplashPhotoId(imageUrl);

  if (!photoId) {
    return null;
  }

  const manifest = loadLocalManifestSync();
  const localImage = manifest.images[photoId];

  return {
    photoId,
    localPath: localImage?.local_path || null,
    author: localImage?.author || null,
    isLocal: !!localImage?.local_path,
  };
}

/**
 * Check if an image is available locally (server-side)
 */
export function isImageLocalSync(imageUrl: string): boolean {
  const metadata = getImageMetadataSync(imageUrl);
  return metadata?.isLocal || false;
}

/**
 * Get all local images (useful for preloading or analysis)
 */
export function getAllLocalImages(): Record<string, any> {
  const manifest = loadLocalManifestSync();
  return manifest.images;
}

/**
 * Get local manifest stats
 */
export function getLocalManifestStats(): {
  total_images: number;
  downloaded: number;
  failed: number;
  skipped: number;
  generated_at: string;
} {
  const manifest = loadLocalManifestSync();
  return {
    ...manifest.stats,
    generated_at: manifest.generated_at,
  };
}

/**
 * Pre-generate optimized image sources for a list of URLs
 * Useful for build-time optimization
 */
export function preGenerateImageSources(
  imageUrls: string[]
): Record<string, string> {
  const results: Record<string, string> = {};

  for (const imageUrl of imageUrls) {
    const optimizedSrc = getOptimizedImageSrcSync(imageUrl);
    results[imageUrl] = optimizedSrc;
  }

  return results;
}

/**
 * Check if the local manifest is up-to-date compared to the build manifest
 */
export function isLocalManifestCurrent(): {
  isCurrent: boolean;
  localGenerated: string;
  buildManifestGenerated: string | null;
  localImageCount: number;
  buildManifestImageCount: number | null;
} {
  const localManifest = loadLocalManifestSync();

  // Load build manifest
  const buildManifestPath = path.join(
    process.cwd(),
    "public",
    "unsplash-manifest.json"
  );
  let buildManifest = null;

  try {
    if (fs.existsSync(buildManifestPath)) {
      const buildManifestContent = fs.readFileSync(buildManifestPath, "utf-8");
      buildManifest = JSON.parse(buildManifestContent);
    }
  } catch (error) {
    console.warn("[Server] Failed to load build manifest:", error);
  }

  return {
    isCurrent: localManifest.source_manifest === buildManifest?.generated_at,
    localGenerated: localManifest.generated_at,
    buildManifestGenerated: buildManifest?.generated_at || null,
    localImageCount: Object.keys(localManifest.images).length,
    buildManifestImageCount: buildManifest
      ? Object.keys(buildManifest.images).length
      : null,
  };
}

/**
 * Generate a Next.js compatible image config for local images
 */
export function generateNextImageConfig(): {
  localDomains: string[];
  imageCount: number;
} {
  const localImages = getAllLocalImages();

  return {
    localDomains: ["localhost"], // Local images are served from the same domain
    imageCount: Object.keys(localImages).length,
  };
}

/**
 * Validate that local image files actually exist on disk
 */
export function validateLocalImages(): {
  valid: string[];
  missing: string[];
  total: number;
} {
  const manifest = loadLocalManifestSync();
  const valid: string[] = [];
  const missing: string[] = [];

  for (const [photoId, imageData] of Object.entries(manifest.images)) {
    const fullPath = path.join(process.cwd(), "public", imageData.local_path);

    if (fs.existsSync(fullPath)) {
      valid.push(photoId);
    } else {
      missing.push(photoId);
      console.warn(`[Server] Missing local image file: ${fullPath}`);
    }
  }

  return {
    valid,
    missing,
    total: Object.keys(manifest.images).length,
  };
}
