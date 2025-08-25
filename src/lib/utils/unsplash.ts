import { createApi } from "unsplash-js";
import type { Basic } from "unsplash-js/dist/methods/photos/types";

// Initialize Unsplash API client
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
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
  const baseUrl = `https://images.unsplash.com/photo-${imageId}`;
  const params = new URLSearchParams({
    ixlib: "rb-4.0.3",
    ixid: process.env.UNSPLASH_SECRET_KEY || "",
    auto: format,
    fit,
    w: width.toString(),
    q: quality.toString(),
  });

  return `${baseUrl}?${params.toString()}`;
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
  // Handle direct image URLs: https://images.unsplash.com/photo-{id}?...
  const directImageMatch = url.match(
    /https:\/\/images\.unsplash\.com\/photo-([^?]+)/
  );
  if (directImageMatch) {
    return directImageMatch[1];
  }

  // Handle page URLs: https://unsplash.com/photos/{slug}-{id}
  const pageUrlMatch = url.match(
    /https:\/\/unsplash\.com\/photos\/[^\/]+-([^\/\?]+)/
  );
  if (pageUrlMatch) {
    return pageUrlMatch[1];
  }

  // Handle simple page URLs: https://unsplash.com/photos/{id}
  const simplePageMatch = url.match(
    /https:\/\/unsplash\.com\/photos\/([^\/\?]+)/
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
  const utmParams = "utm_source=your-app-name&utm_medium=referral";

  return {
    photographerUrl: `https://unsplash.com/@${photographerUsername}?${utmParams}`,
    unsplashUrl: `https://unsplash.com/?${utmParams}`,
    utmParams,
  };
}
