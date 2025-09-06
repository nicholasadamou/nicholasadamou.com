/**
 * Unsplash utilities for Open Graph route
 * Handles Unsplash URL detection, photo ID extraction, and manifest-based image resolution
 */

import { readFileSync } from "fs";
import { join } from "path";

interface UnsplashManifest {
  images: Record<
    string,
    {
      local_path?: string;
      image_url?: string;
      author?: string;
      author_url?: string;
      description?: string;
      width?: number;
      height?: number;
      skipped?: boolean;
    }
  >;
}

/**
 * Checks if a URL is an Unsplash photo URL
 * @param url - URL to check
 * @returns True if it's an Unsplash photo URL
 */
export const isUnsplashPhotoUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === "unsplash.com" &&
      urlObj.pathname.startsWith("/photos/")
    );
  } catch {
    return false;
  }
};

/**
 * Extracts the photo ID from an Unsplash photo URL
 * @param url - Unsplash photo URL
 * @returns Photo ID or null if not found
 */
export const extractUnsplashPhotoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname !== "unsplash.com" ||
      !urlObj.pathname.startsWith("/photos/")
    ) {
      return null;
    }

    // Extract ID from path like /photos/Am6pBe2FpJw or /photos/diagram-Am6pBe2FpJw
    const pathParts = urlObj.pathname.split("/");
    if (pathParts.length < 3) return null;

    const photoSlug = pathParts[2];
    // If the slug contains a dash, the ID is typically after the last dash
    const dashIndex = photoSlug.lastIndexOf("-");
    if (dashIndex > -1 && dashIndex < photoSlug.length - 1) {
      return photoSlug.substring(dashIndex + 1);
    }

    // Otherwise, assume the entire slug is the ID
    return photoSlug;
  } catch {
    return null;
  }
};

/**
 * Loads the Unsplash manifest from the public directory
 * @returns Parsed manifest or null if not found
 */
export const loadUnsplashManifest = (): UnsplashManifest | null => {
  try {
    const manifestPath = join(
      process.cwd(),
      "public",
      "images",
      "unsplash",
      "manifest.json"
    );
    const manifestContent = readFileSync(manifestPath, "utf-8");
    return JSON.parse(manifestContent) as UnsplashManifest;
  } catch {
    return null;
  }
};

/**
 * Resolves an Unsplash photo URL to a usable image URL
 * Tries local path first, then falls back to direct image URL from manifest
 * @param url - Unsplash photo URL
 * @returns Resolved image URL or null if not found
 */
export const resolveUnsplashImage = (url: string): string | null => {
  const photoId = extractUnsplashPhotoId(url);
  if (!photoId) return null;

  const manifest = loadUnsplashManifest();
  if (!manifest || !manifest.images[photoId]) return null;

  const imageData = manifest.images[photoId];

  // Skip images marked as skipped
  if (imageData.skipped) return null;

  // Prefer local path if available, convert to public URL
  if (imageData.local_path) {
    // Convert local path like "/../../public/images/unsplash/Am6pBe2FpJw.jpg"
    // to public URL like "/images/unsplash/Am6pBe2FpJw.jpg"
    const publicPath = imageData.local_path.replace(/^.*?\/public/, "");
    return publicPath;
  }

  // Fall back to direct image URL
  if (imageData.image_url) {
    return imageData.image_url;
  }

  return null;
};

/**
 * Gets image metadata from the manifest
 * @param photoId - Unsplash photo ID
 * @returns Image metadata or null if not found
 */
export const getUnsplashImageMetadata = (photoId: string) => {
  const manifest = loadUnsplashManifest();
  if (!manifest || !manifest.images[photoId]) return null;

  return manifest.images[photoId];
};
