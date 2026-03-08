/**
 * Unsplash utilities for Open Graph route
 * Delegates to the shared image module
 */

import { extractPhotoId, resolveImageUrl } from "@/lib/image/unsplash";

/**
 * Checks if a URL is an Unsplash photo URL
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

export { extractPhotoId as extractUnsplashPhotoId };

/**
 * Resolves an Unsplash photo URL to a usable image URL
 */
export const resolveUnsplashImage = (url: string): string | null => {
  return resolveImageUrl(url);
};
