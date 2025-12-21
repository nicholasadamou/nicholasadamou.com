import { NextRequest, NextResponse } from "next/server";
import { VscoApiResponse } from "@/types/vsco";
import { getLocalVscoImages, hasLocalVscoImages } from "@/lib/utils/vsco-local";
import { logger } from "@/lib/logger";

const CACHE_DURATION = 3600; // 1 hour in seconds

interface CachedVscoData {
  data: VscoApiResponse;
  timestamp: number;
}

let cachedData: CachedVscoData | null = null;

/**
 * Get VSCO images from local manifest
 */
function getVscoImages(limit?: number, offset?: number): VscoApiResponse {
  // For pagination, we don't cache individual pages, only cache when offset is 0 or undefined
  const shouldUseCache = !offset || offset === 0;

  if (
    shouldUseCache &&
    cachedData &&
    Date.now() - cachedData.timestamp < CACHE_DURATION * 1000
  ) {
    // If using cache and requesting first page, apply limit to cached data
    if (limit && cachedData.data.images.length > limit) {
      return {
        ...cachedData.data,
        images: cachedData.data.images.slice(0, limit),
        hasMore: cachedData.data.images.length > limit,
      };
    }
    return cachedData.data;
  }

  // Get images from local manifest
  if (hasLocalVscoImages()) {
    logger.debug(
      `Using local VSCO images from manifest (limit: ${limit}, offset: ${offset})`
    );
    const localData = getLocalVscoImages(limit, offset);

    // Only cache when requesting first page
    if (shouldUseCache) {
      cachedData = {
        data: localData,
        timestamp: Date.now(),
      };
    }

    return localData;
  }

  // If no local images, return empty result
  return {
    images: [],
    hasMore: false,
    totalCount: 0,
    source: "local-manifest",
    error:
      "No local VSCO manifest found. Run the VSCO downloader script to generate images.",
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");

    const data = getVscoImages(limit, offset);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
      },
    });
  } catch (error) {
    logger.error("VSCO API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch VSCO gallery",
        message: error instanceof Error ? error.message : "Unknown error",
        images: [],
        hasMore: false,
        totalCount: 0,
      },
      { status: 500 }
    );
  }
}
