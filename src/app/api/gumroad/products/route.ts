import { NextResponse } from "next/server";

const CACHE_DURATION = 3600; // 1 hour

interface CachedGumroadData {
  data: unknown;
  timestamp: number;
}

let cachedData: CachedGumroadData | null = null;

function getGumroadToken(): string {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) {
    throw new Error("GUMROAD_ACCESS_TOKEN is not set");
  }
  return token;
}

export const GET = async () => {
  try {
    if (
      cachedData &&
      Date.now() - cachedData.timestamp < CACHE_DURATION * 1000
    ) {
      return NextResponse.json(cachedData.data, {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        },
      });
    }

    const token = getGumroadToken();
    const response = await fetch("https://api.gumroad.com/v2/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: response.status }
      );
    }

    const data = await response.json();
    cachedData = { data, timestamp: Date.now() };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
