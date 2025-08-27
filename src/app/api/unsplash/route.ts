import { NextRequest, NextResponse } from "next/server";
import {
  getUnsplashPhoto,
  extractUnsplashPhotoId,
  createPremiumUnsplashUrl,
} from "@/lib/utils/unsplash";
import { unsplashCache } from "@/lib/cache/unsplash-cache";

// Rate limiting and backoff configuration
const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000, // 1 second base delay
  maxDelayMs: 30000, // 30 seconds max delay
  jitterMs: 500, // Random jitter up to 500ms
  exponentialBackoffFactor: 2,
} as const;

// In-memory rate limit tracking (consider using Redis for production clusters)
const rateLimitState = {
  lastRateLimitTime: 0,
  consecutiveRateLimits: 0,
  backoffUntil: 0,
};

/**
 * Calculate exponential backoff delay with jitter
 * @param attemptNumber - Current retry attempt (0-based)
 * @param baseDelay - Base delay in milliseconds
 * @param maxDelay - Maximum delay in milliseconds
 * @param jitter - Maximum random jitter in milliseconds
 * @returns Delay in milliseconds
 */
function calculateBackoffDelay(
  attemptNumber: number,
  baseDelay: number = RATE_LIMIT_CONFIG.baseDelayMs,
  maxDelay: number = RATE_LIMIT_CONFIG.maxDelayMs,
  jitter: number = RATE_LIMIT_CONFIG.jitterMs
): number {
  const exponentialDelay =
    baseDelay *
    Math.pow(RATE_LIMIT_CONFIG.exponentialBackoffFactor, attemptNumber);
  const delayWithJitter = exponentialDelay + Math.random() * jitter;
  return Math.min(delayWithJitter, maxDelay);
}

/**
 * Sleep for specified milliseconds
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if we're currently in a rate limit backoff period
 * @returns true if we should wait before making requests
 */
function isInBackoffPeriod(): boolean {
  return Date.now() < rateLimitState.backoffUntil;
}

/**
 * Update rate limit state based on response
 * @param isRateLimited - Whether the current request was rate limited
 */
function updateRateLimitState(isRateLimited: boolean): void {
  if (isRateLimited) {
    rateLimitState.lastRateLimitTime = Date.now();
    rateLimitState.consecutiveRateLimits++;

    // Calculate backoff period based on consecutive rate limits
    const backoffDelay = calculateBackoffDelay(
      rateLimitState.consecutiveRateLimits - 1
    );
    rateLimitState.backoffUntil = Date.now() + backoffDelay;

    console.warn(
      `🚨 Rate limit hit (consecutive: ${rateLimitState.consecutiveRateLimits}). ` +
        `Backing off for ${Math.round(backoffDelay / 1000)}s until ${new Date(rateLimitState.backoffUntil).toISOString()}`
    );
  } else {
    // Reset consecutive rate limits on successful request
    rateLimitState.consecutiveRateLimits = 0;
    rateLimitState.backoffUntil = 0;
  }
}

/**
 * Enhanced Unsplash API call with rate limit backoff and retry logic
 * @param photoId - The Unsplash photo ID
 * @param retryCount - Current retry attempt (for recursive calls)
 * @returns Photo data or null if failed
 */
async function getUnsplashPhotoWithBackoff(
  photoId: string,
  retryCount: number = 0
): Promise<any> {
  // Check if we're in a backoff period
  if (isInBackoffPeriod()) {
    const waitTime = rateLimitState.backoffUntil - Date.now();
    console.log(
      `⏳ In backoff period, waiting ${Math.round(waitTime / 1000)}s before retry for photo ${photoId}`
    );
    await sleep(waitTime);
  }

  try {
    console.log(
      `🌐 Fetching photo from Unsplash API: ${photoId} ` +
        `(attempt ${retryCount + 1}/${RATE_LIMIT_CONFIG.maxRetries + 1})`
    );

    const photo = await getUnsplashPhoto(photoId);

    if (photo) {
      // Success - reset rate limit state
      updateRateLimitState(false);
      return photo;
    }

    // Photo not found or API error - don't retry for client errors
    return null;
  } catch (error) {
    // Check if this is a rate limit error
    const isRateLimitError =
      error instanceof Error &&
      (error.message.includes("Rate Limit") || error.message.includes("429"));

    if (isRateLimitError) {
      updateRateLimitState(true);

      // Retry if we haven't exceeded max retries
      if (retryCount < RATE_LIMIT_CONFIG.maxRetries) {
        const retryDelay = calculateBackoffDelay(retryCount);
        console.log(
          `🔄 Rate limit detected, retrying in ${Math.round(retryDelay / 1000)}s ` +
            `(attempt ${retryCount + 2}/${RATE_LIMIT_CONFIG.maxRetries + 1})`
        );

        await sleep(retryDelay);
        return getUnsplashPhotoWithBackoff(photoId, retryCount + 1);
      } else {
        console.error(
          `❌ Max retries (${RATE_LIMIT_CONFIG.maxRetries}) exceeded for photo ${photoId} due to rate limiting`
        );
        throw new Error("Rate limit exceeded - max retries reached");
      }
    }

    // Non-rate-limit error - don't retry
    throw error;
  }
}

/**
 * Enhanced download tracking with rate limit backoff
 * @param photoId - The Unsplash photo ID
 * @param accessKey - Unsplash access key
 * @param retryCount - Current retry attempt
 */
async function triggerDownloadTrackingWithBackoff(
  photoId: string,
  accessKey: string,
  retryCount: number = 0
): Promise<void> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/${photoId}/download`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.status === 429) {
      // Rate limited - apply backoff and retry
      updateRateLimitState(true);

      if (retryCount < RATE_LIMIT_CONFIG.maxRetries) {
        const retryDelay = calculateBackoffDelay(retryCount);
        console.log(
          `🔄 Download tracking rate limited, retrying in ${Math.round(retryDelay / 1000)}s ` +
            `(attempt ${retryCount + 2}/${RATE_LIMIT_CONFIG.maxRetries + 1})`
        );

        await sleep(retryDelay);
        return triggerDownloadTrackingWithBackoff(
          photoId,
          accessKey,
          retryCount + 1
        );
      } else {
        console.warn(
          `⚠️ Download tracking failed after ${RATE_LIMIT_CONFIG.maxRetries} retries for photo: ${photoId}`
        );
        return; // Don't throw - download tracking failure shouldn't break the main request
      }
    }

    if (!response.ok) {
      console.warn(
        `⚠️ Download tracking failed with status ${response.status} for photo: ${photoId}`
      );
      return;
    }

    // Success - reset rate limit state
    updateRateLimitState(false);
    console.log(`✅ Download tracking successful for photo: ${photoId}`);
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      console.warn(`⚠️ Download tracking timeout for photo: ${photoId}`);
    } else {
      console.warn(`⚠️ Download tracking error for photo: ${photoId}`, error);
    }
    // Don't throw - download tracking failure shouldn't break the main request
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Check if an API key is configured
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error("❌ UNSPLASH_ACCESS_KEY environment variable is not set");
    return NextResponse.json(
      { error: "Unsplash API key not configured" },
      { status: 500 }
    );
  }

  try {
    switch (action) {
      case "get-photo": {
        const photoId = searchParams.get("id");
        if (!photoId) {
          return NextResponse.json(
            { error: "Photo ID is required" },
            { status: 400 }
          );
        }

        // Check cache first
        const cachedPhoto = await unsplashCache.get(photoId);
        if (cachedPhoto) {
          console.log(`🎯 Returning cached photo: ${photoId}`);
          return NextResponse.json(cachedPhoto);
        }

        // Use enhanced API call with rate limit backoff
        let photo;
        try {
          photo = await getUnsplashPhotoWithBackoff(photoId);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes("Rate limit exceeded")
          ) {
            console.error(`❌ Rate limit exceeded for photo ${photoId}`);
            return NextResponse.json(
              {
                error: "Rate limit exceeded",
                message:
                  "Unsplash API rate limit reached. Please try again later. The system will automatically retry with exponential backoff.",
                retryAfter:
                  rateLimitState.backoffUntil > Date.now()
                    ? Math.ceil(
                        (rateLimitState.backoffUntil - Date.now()) / 1000
                      )
                    : 60, // Default 60 seconds if no specific backoff time
              },
              {
                status: 429,
                headers: {
                  "Retry-After":
                    rateLimitState.backoffUntil > Date.now()
                      ? Math.ceil(
                          (rateLimitState.backoffUntil - Date.now()) / 1000
                        ).toString()
                      : "60",
                },
              }
            );
          }
          throw error; // Re-throw non-rate-limit errors
        }

        if (!photo) {
          console.error(`❌ Photo not found or API error for ID: ${photoId}`);
          return NextResponse.json(
            {
              error: "Photo not found or API error",
              message:
                "This could be due to an invalid photo ID or API issues. Please try again later.",
            },
            { status: 404 }
          );
        }

        // Create premium watermark-free URL if we have Unsplash+ credentials
        // Note: For Unsplash+ watermark removal to work, your API application must be
        // properly linked to your Unsplash+ subscription. Contact Unsplash support if needed.
        const premiumUrl = createPremiumUnsplashUrl(
          photo.urls.regular,
          photo.id,
          1200,
          80
        );

        // Trigger download tracking with enhanced backoff as required by Unsplash API terms
        await triggerDownloadTrackingWithBackoff(
          photo.id,
          process.env.UNSPLASH_ACCESS_KEY!
        );

        // Add rate limit status to response headers for monitoring
        const responseHeaders: Record<string, string> = {};
        if (rateLimitState.consecutiveRateLimits > 0) {
          responseHeaders["X-Rate-Limit-Status"] =
            `consecutive-limits-${rateLimitState.consecutiveRateLimits}`;
        }
        if (rateLimitState.backoffUntil > Date.now()) {
          responseHeaders["X-Rate-Limit-Backoff-Until"] = new Date(
            rateLimitState.backoffUntil
          ).toISOString();
        }

        const responseData = {
          id: photo.id,
          optimized_url: premiumUrl, // Use watermark-free URL
          urls: photo.urls,
          user: {
            name: photo.user.name,
            username: photo.user.username,
            profile_url: `https://unsplash.com/@${photo.user.username}`,
          },
          // Additional convenience fields for easier usage
          image_author: photo.user.name,
          image_author_url: `https://unsplash.com/@${photo.user.username}`,
          description: photo.description || photo.alt_description,
          width: photo.width,
          height: photo.height,
        };

        // Cache the response
        await unsplashCache.set(photoId, responseData);
        console.log(`💾 Cached photo: ${photoId}`);

        return NextResponse.json(responseData, { headers: responseHeaders });
      }

      case "extract-id": {
        const url = searchParams.get("url");
        if (!url) {
          return NextResponse.json(
            { error: "URL is required" },
            { status: 400 }
          );
        }

        const photoId = extractUnsplashPhotoId(url);
        if (!photoId) {
          return NextResponse.json(
            { error: "Could not extract photo ID from URL" },
            { status: 400 }
          );
        }

        return NextResponse.json({ photo_id: photoId });
      }

      default:
        return NextResponse.json(
          {
            error: "Invalid action. Supported actions: get-photo, extract-id",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
