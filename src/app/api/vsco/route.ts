import { NextRequest, NextResponse } from "next/server";
import { getLocalVscoImages } from "@/lib/vsco-local";

const CACHE_DURATION = 3600; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");

    const data = getLocalVscoImages(limit, offset);

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
