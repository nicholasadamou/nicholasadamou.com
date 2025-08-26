import { createApi } from "unsplash-js";
import type { Basic } from "unsplash-js/dist/methods/photos/types";

// Initialize Unsplash API client
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
  // Add secret key for premium access
  ...(process.env.UNSPLASH_SECRET_KEY && {
    secret: process.env.UNSPLASH_SECRET_KEY,
  }),
});

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
    console.error("Error creating premium Unsplash URL:", error);
    return baseUrl; // Fallback to original URL
  }
}

/**
 * Get optimized image URL from Unsplash with custom parameters
 * @param imageId - The Unsplash photo ID
 * @param width - Desired width (default: 1200)
 * @param quality - Image quality 1-100 (default: 80)
 * @param fit - How to fit the image (default: 'crop')
 * @param format - Image format (default: 'auto')
 */
export function getOptimizedUnsplashUrl(
  imageId: string,
  width: number = 1200,
  quality: number = 80,
  fit: "crop" | "clip" | "fill" | "fillmax" | "max" | "min" | "scale" = "crop",
  format: "auto" | "webp" | "jpg" | "png" = "auto"
): string {
  // Don't generate custom URLs - let the Unsplash API provide the correct URLs
  // This function should only be used when we have actual photo data from the API
  throw new Error(
    "getOptimizedUnsplashUrl should not be called directly. Use API response URLs instead."
  );
}

/**
 * Search for Unsplash images
 * @param query - Search query
 * @param perPage - Number of results per page (max 30)
 * @param page - Page number
 */
export async function searchUnsplashImages(
  query: string,
  perPage: number = 10,
  page: number = 1
): Promise<Basic[] | null> {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      perPage,
      page,
    });

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors);
      return null;
    }

    return result.response?.results || null;
  } catch (error) {
    console.error("Error searching Unsplash images:", error);
    return null;
  }
}

/**
 * Get a specific photo by ID
 * @param photoId - The Unsplash photo ID
 */
export async function getUnsplashPhoto(
  photoId: string
): Promise<UnsplashImageData | null> {
  try {
    const result = await unsplash.photos.get({
      photoId,
    });

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors);
      return null;
    }

    return result.response as UnsplashImageData;
  } catch (error) {
    console.error("Error fetching Unsplash photo:", error);
    return null;
  }
}

/**
 * Get random photos from Unsplash
 * @param count - Number of photos (max 30)
 * @param collections - Collection IDs to search in
 * @param query - Search query to filter random photos
 */
export async function getRandomUnsplashPhotos(
  count: number = 1,
  collections?: string[],
  query?: string
): Promise<UnsplashImageData[] | null> {
  try {
    const result = await unsplash.photos.getRandom({
      count,
      collectionIds: collections,
      query,
    });

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors);
      return null;
    }

    if (Array.isArray(result.response)) {
      return result.response as UnsplashImageData[];
    } else {
      return [result.response as UnsplashImageData];
    }
  } catch (error) {
    console.error("Error fetching random Unsplash photos:", error);
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

/**
 * Generate proper Unsplash attribution
 * @param photographer - Photographer's name
 * @param photographerUsername - Photographer's username
 * @param photoId - Photo ID for tracking
 */
export function generateUnsplashAttribution(
  photographer: string,
  photographerUsername: string,
  photoId: string
): {
  photographerUrl: string;
  unsplashUrl: string;
  utmParams: string;
} {
  const utmParams = "utm_source=nicholasadamou.com&utm_medium=referral";

  return {
    photographerUrl: `https://unsplash.com/@${photographerUsername}?${utmParams}`,
    unsplashUrl: `https://unsplash.com/?${utmParams}`,
    utmParams,
  };
}
