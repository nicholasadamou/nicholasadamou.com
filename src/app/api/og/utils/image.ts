/**
 * Image utilities for Open Graph route
 * Handles image path validation for Next.js ImageResponse
 */

import { isUnsplashPhotoUrl, resolveUnsplashImage } from "./unsplash";

/**
 * Validates if a string is a valid image path or URL
 * @param imagePath - Image path or URL to validate
 * @returns True if valid, false otherwise
 */
export const isValidImagePath = (imagePath?: string): boolean => {
  if (!imagePath || imagePath.trim() === "") return false;

  // Check if it's an Unsplash photo URL
  if (isUnsplashPhotoUrl(imagePath)) {
    // Validate by trying to resolve it through the manifest
    const resolved = resolveUnsplashImage(imagePath);
    return resolved !== null;
  }

  // Check if it looks like a URL (contains protocol)
  if (imagePath.includes("://")) {
    try {
      const url = new URL(imagePath);
      // Only allow http and https protocols
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return false;
      }
      // Check for valid hostname
      if (!url.hostname || url.hostname === "") {
        return false;
      }
      // Additional validation for malformed URLs
      if (url.hostname.includes("..") || url.hostname.includes("[")) {
        return false;
      }
      // Check for valid image extension in URL path
      const validExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      const pathname = url.pathname.toLowerCase();

      return validExtensions.some((ext) => pathname.includes(ext));
    } catch {
      return false;
    }
  }

  // For non-URL paths, ensure they don't look like URLs without protocol
  // Only check if it doesn't start with './' or '../' (valid relative paths)
  if (
    imagePath.includes(".") &&
    imagePath.includes("/") &&
    !imagePath.startsWith("./") &&
    !imagePath.startsWith("../") &&
    imagePath.indexOf(".") < imagePath.indexOf("/")
  ) {
    // This might be a malformed URL like "example.com/image.png"
    return false;
  }

  // Check for valid local path with image extension
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return validExtensions.some((ext) => imagePath.toLowerCase().endsWith(ext));
};
