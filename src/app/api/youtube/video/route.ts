import { NextRequest, NextResponse } from "next/server";

// Function to get YouTube API key with runtime validation
function getYouTubeApiKey(): string {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API key is not set");
  }
  return YOUTUBE_API_KEY;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url || "");
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = getYouTubeApiKey();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=snippet`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const { title, channelTitle } = data.items[0].snippet;
      return NextResponse.json({ title, channelTitle });
    } else {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching video details" },
      { status: 500 }
    );
  }
}
