// Note: We avoid using the unsplash-js client due to occasional parsing issues in some runtimes.
// We'll use direct fetch calls to the Unsplash API for reliability.

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
 * Get a specific photo by ID
 * @param photoId - The Unsplash photo ID
 */
export async function getUnsplashPhoto(
  photoId: string
): Promise<UnsplashImageData | null> {
  try {
    const resp = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        Accept: "application/json",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();

      if (resp.status === 403 && text.includes("Rate Limit Exceeded")) {
        console.warn(`⚠️ Unsplash rate limit exceeded for photo ${photoId}`);
      } else {
        console.error(
          `Unsplash API error: status=${resp.status} ${resp.statusText} body=${text?.slice(0, 500)}`
        );
      }

      return null;
    }

    const data = (await resp.json()) as UnsplashImageData;
    return data;
  } catch (error) {
    console.error("Error fetching Unsplash photo (network or parsing):", error);
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
