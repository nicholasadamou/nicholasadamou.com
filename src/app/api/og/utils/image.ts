/**
 * Image utilities for Open Graph route
 * Handles image path validation for Next.js ImageResponse
 */

import { readFileSync } from "fs";
import { join } from "path";
import { isUnsplashPhotoUrl, resolveUnsplashImage } from "./unsplash";
import { logProcessingStep } from "./logger";

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

/**
 * Fetches an image and converts it to a base64 data URL
 * This prevents timeouts when Satori tries to fetch external images
 * @param imageUrl - Image URL to fetch (absolute URL)
 * @param isLocal - Whether the image is local (starts with /)
 * @returns Base64 data URL or null if fetch fails
 */
export const fetchImageAsBase64 = async (
  imageUrl: string,
  isLocal: boolean = false
): Promise<string | null> => {
  try {
    logProcessingStep("Fetching image for base64 conversion", {
      imageUrl,
      isLocal,
    });

    let buffer: Buffer;
    let contentType: string;

    // For local images, read directly from filesystem to avoid fetch timeout
    if (isLocal) {
      try {
        // Extract the path from the URL (e.g., /avatar.jpeg -> avatar.jpeg)
        const urlPath = imageUrl.includes("://")
          ? new URL(imageUrl).pathname
          : imageUrl;
        const cleanPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;

        // Read from public directory
        const publicPath = join(process.cwd(), "public", cleanPath);
        logProcessingStep("Reading local image from filesystem", publicPath);

        buffer = readFileSync(publicPath);

        // Determine content type from file extension
        contentType = cleanPath.toLowerCase().endsWith(".png")
          ? "image/png"
          : cleanPath.toLowerCase().endsWith(".gif")
            ? "image/gif"
            : cleanPath.toLowerCase().endsWith(".webp")
              ? "image/webp"
              : "image/jpeg";
      } catch (fsError) {
        console.error("Error reading local image from filesystem:", fsError);
        return null;
      }
    } else {
      // For external images, fetch over HTTP
      const response = await fetch(imageUrl, {
        // Add a reasonable timeout
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);

      // Determine content type from response headers or URL
      contentType =
        response.headers.get("content-type") ||
        (imageUrl.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");
    }

    const base64 = buffer.toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    logProcessingStep("Image converted to base64", {
      size: buffer.length,
      contentType,
    });

    return dataUrl;
  } catch (error) {
    console.error("Error fetching image as base64:", error);
    return null;
  }
};
