// Note: We avoid using the unsplash-js client due to occasional parsing issues in some runtimes.
// We'll use direct fetch calls to the Unsplash API for reliability.

import { logger } from "@/lib/logger";

export interface UnsplashImageData {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    profile_image?: {
      small: string;
    };
  };
  description?: string;
  alt_description?: string;
  width: number;
  height: number;
}

/**
 * Create premium watermark-free URL for Unsplash+ subscribers
 * @param baseUrl - Base image URL from Unsplash API
 * @param photoId - The Unsplash photo ID
 * @param width - Desired width (default: 1200)
 * @param quality - Image quality 1-100 (default: 80)
 */
export function createPremiumUnsplashUrl(
  baseUrl: string,
  photoId: string,
  width: number = 1200,
  quality: number = 80
): string {
  // If we don't have a secret key, return the regular URL
  if (!process.env.UNSPLASH_SECRET_KEY) {
    return baseUrl;
  }

  try {
    const url = new URL(baseUrl);

    // For premium content (plus.unsplash.com), we need to ensure proper authentication
    if (url.hostname === "plus.unsplash.com") {
      // For premium content, use minimal parameters and ensure client_id is included
      // Clear existing parameters that might interfere with premium access
      const cleanUrl = new URL(url.origin + url.pathname);

      // Keep essential Unsplash parameters
      if (url.searchParams.get("ixid")) {
        cleanUrl.searchParams.set("ixid", url.searchParams.get("ixid")!);
      }
      if (url.searchParams.get("ixlib")) {
        cleanUrl.searchParams.set("ixlib", url.searchParams.get("ixlib")!);
      }

      // Add our authentication
      cleanUrl.searchParams.set("client_id", process.env.UNSPLASH_ACCESS_KEY!);

      // Add minimal optimization parameters
      cleanUrl.searchParams.set("w", width.toString());
      cleanUrl.searchParams.set("q", quality.toString());
      cleanUrl.searchParams.set("fm", "jpg");

      return cleanUrl.toString();
    } else {
      // For regular images, add standard optimization parameters
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("fit", "crop");
      url.searchParams.set("crop", "entropy");
      url.searchParams.set("cs", "tinysrgb");
      url.searchParams.set("fm", "jpg");
      url.searchParams.set("client_id", process.env.UNSPLASH_ACCESS_KEY!);
    }

    return url.toString();
  } catch (error) {
    // Silently fallback - URL parsing errors shouldn't break image display
    return baseUrl; // Fallback to original URL
  }
}

/**
 * Get a specific photo by ID
 * @param photoId - The Unsplash photo ID
 */
export async function getUnsplashPhoto(
  photoId: string
): Promise<UnsplashImageData | null> {
  // Check if an API key is configured
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    // Should be logged at startup, not per request
    return null;
  }

  try {
    const fetchOptions: RequestInit = {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        Accept: "application/json",
      },
    };

    // Only add timeout in non-test environments to avoid MSW compatibility issues
    let timeoutId: NodeJS.Timeout | undefined;
    if (process.env.NODE_ENV !== "test") {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      fetchOptions.signal = controller.signal;
    }

    const resp = await fetch(
      `https://api.unsplash.com/photos/${photoId}`,
      fetchOptions
    );

    // Clear the timeout if request completes
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!resp.ok) {
      const text = await resp.text();

      if (
        resp.status === 429 ||
        (resp.status === 403 && text.includes("Rate Limit Exceeded"))
      ) {
        logger.warn(
          `Unsplash rate limit exceeded for photo ${photoId} (status: ${resp.status})`
        );
        // Throw error for rate limits so backoff logic can handle it
        throw new Error(`Rate Limit Exceeded: ${resp.status} - ${text}`);
      } else {
        logger.error(
          `Unsplash API error: status=${resp.status} ${resp.statusText} body=${text?.slice(0, 500)}`
        );
      }

      return null;
    }

    const data = (await resp.json()) as UnsplashImageData;
    return data;
  } catch (error) {
    // Re-throw rate limit errors so backoff logic can handle them
    if (error instanceof Error && error.message.includes("Rate Limit")) {
      throw error;
    }

    if (error instanceof Error && error.name === "TimeoutError") {
      logger.error(`Timeout fetching Unsplash photo ${photoId}`);
    } else {
      logger.error(
        "Error fetching Unsplash photo (network or parsing):",
        error
      );
    }
    return null;
  }
}

/**
 * Extract photo ID from various Unsplash URL formats
 * @param url - Unsplash URL (page URL or direct image URL)
 * @returns Photo ID or null if not found
 */
export function extractUnsplashPhotoId(url: string): string | null {
  if (!url || !url.includes("unsplash.com/photos/")) return null;

  // Clean the URL first by removing any trailing punctuation
  const cleanUrl = url.replace(/["'.,;:!?]+$/, "");

  // Handle page URLs: https://unsplash.com/photos/{slug}-{id}
  // The photo ID is typically the last segment after the final hyphen and contains alphanumeric characters and underscores
  const pageUrlMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/.*-([a-zA-Z0-9_-]{11,12})(?:[\?#]|$)/
  );
  if (pageUrlMatch) {
    return pageUrlMatch[1];
  }

  // Handle simple page URLs: https://unsplash.com/photos/{id}
  // For URLs that might just be the photo ID without a slug (11-12 characters)
  const simplePageMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/([a-zA-Z0-9_-]{11,12})(?:[\?#]|$)/
  );
  if (simplePageMatch) {
    return simplePageMatch[1];
  }

  // Extract all potential 11-12 character IDs and pick the last one (most likely to be the photo ID)
  const allMatches = cleanUrl.match(/[a-zA-Z0-9_-]{11,12}/g);
  if (allMatches && allMatches.length > 0) {
    // Return the last match, which is usually the photo ID
    return allMatches[allMatches.length - 1];
  }

  return null;
}
