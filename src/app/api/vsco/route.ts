import { NextRequest, NextResponse } from "next/server";
import type { VscoApiResponse } from "@/types/vsco";
import { getLocalVscoImages, hasLocalVscoImages } from "@/lib/vsco-local";

const CACHE_DURATION = 3600; // 1 hour

interface CachedVscoData {
  data: VscoApiResponse;
  timestamp: number;
}

let cachedData: CachedVscoData | null = null;

function getVscoImages(limit?: number, offset?: number): VscoApiResponse {
  const shouldUseCache = !offset || offset === 0;

  if (
    shouldUseCache &&
    cachedData &&
    Date.now() - cachedData.timestamp < CACHE_DURATION * 1000
  ) {
    if (limit && cachedData.data.images.length > limit) {
      return {
        ...cachedData.data,
        images: cachedData.data.images.slice(0, limit),
        hasMore: cachedData.data.images.length > limit,
      };
    }
    return cachedData.data;
  }

  if (hasLocalVscoImages()) {
    const localData = getLocalVscoImages(limit, offset);

    if (shouldUseCache) {
      cachedData = { data: localData, timestamp: Date.now() };
    }

    return localData;
  }

  return {
    images: [],
    hasMore: false,
    totalCount: 0,
    source: "local-manifest",
    error:
      "No local VSCO manifest found. Run pnpm download:images:vsco to generate images.",
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
    console.error("VSCO API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch VSCO gallery",
        images: [],
        hasMore: false,
        totalCount: 0,
      },
      { status: 500 }
    );
  }
}
