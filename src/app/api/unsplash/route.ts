import { NextRequest, NextResponse } from "next/server";
import {
  getUnsplashPhoto,
  searchUnsplashImages,
  getRandomUnsplashPhotos,
  extractUnsplashPhotoId,
  getOptimizedUnsplashUrl,
} from "@/lib/utils/unsplash";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Check if API key is configured
  if (!process.env.UNSPLASH_ACCESS_KEY) {
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

        const photo = await getUnsplashPhoto(photoId);
        if (!photo) {
          return NextResponse.json(
            { error: "Photo not found" },
            { status: 404 }
          );
        }

        // Generate optimized URL
        const optimizedUrl = getOptimizedUnsplashUrl(photo.id);

        return NextResponse.json({
          id: photo.id,
          optimized_url: optimizedUrl,
          urls: photo.urls,
          user: {
            name: photo.user.name,
            username: photo.user.username,
            profile_url: `https://unsplash.com/@${photo.user.username}`,
          },
          description: photo.description || photo.alt_description,
          width: photo.width,
          height: photo.height,
        });
      }

      case "search": {
        const query = searchParams.get("query");
        if (!query) {
          return NextResponse.json(
            { error: "Search query is required" },
            { status: 400 }
          );
        }

        const perPage = Math.min(
          parseInt(searchParams.get("per_page") || "10"),
          30
        );
        const page = parseInt(searchParams.get("page") || "1");

        const photos = await searchUnsplashImages(query, perPage, page);
        if (!photos) {
          return NextResponse.json({ error: "Search failed" }, { status: 500 });
        }

        const results = photos.map((photo) => ({
          id: photo.id,
          optimized_url: getOptimizedUnsplashUrl(photo.id),
          urls: photo.urls,
          user: {
            name: photo.user.name,
            username: photo.user.username,
            profile_url: `https://unsplash.com/@${photo.user.username}`,
          },
          description: photo.description || photo.alt_description,
          width: photo.width,
          height: photo.height,
        }));

        return NextResponse.json({ results });
      }

      case "random": {
        const count = Math.min(parseInt(searchParams.get("count") || "1"), 30);
        const query = searchParams.get("query") || undefined;
        const collections =
          searchParams.get("collections")?.split(",") || undefined;

        const photos = await getRandomUnsplashPhotos(count, collections, query);
        if (!photos) {
          return NextResponse.json(
            { error: "Failed to fetch random photos" },
            { status: 500 }
          );
        }

        const results = photos.map((photo) => ({
          id: photo.id,
          optimized_url: getOptimizedUnsplashUrl(photo.id),
          urls: photo.urls,
          user: {
            name: photo.user.name,
            username: photo.user.username,
            profile_url: `https://unsplash.com/@${photo.user.username}`,
          },
          description: photo.description || photo.alt_description,
          width: photo.width,
          height: photo.height,
        }));

        return NextResponse.json({ results });
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

      case "optimize-url": {
        const photoId = searchParams.get("id");
        if (!photoId) {
          return NextResponse.json(
            { error: "Photo ID is required" },
            { status: 400 }
          );
        }

        const width = parseInt(searchParams.get("width") || "1200");
        const quality = parseInt(searchParams.get("quality") || "80");
        const fit = (searchParams.get("fit") || "crop") as any;
        const format = (searchParams.get("format") || "auto") as any;

        const optimizedUrl = getOptimizedUnsplashUrl(
          photoId,
          width,
          quality,
          fit,
          format
        );

        return NextResponse.json({ optimized_url: optimizedUrl });
      }

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: get-photo, search, random, extract-id, optimize-url",
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
