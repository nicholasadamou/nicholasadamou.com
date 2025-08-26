import { NextRequest, NextResponse } from "next/server";
import {
  getUnsplashPhoto,
  extractUnsplashPhotoId,
  createPremiumUnsplashUrl,
} from "@/lib/utils/unsplash";
import { unsplashCache } from "@/lib/cache/unsplash-cache";

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

        console.log(`🌐 Fetching photo from Unsplash API: ${photoId}`);
        const photo = await getUnsplashPhoto(photoId);
        if (!photo) {
          console.error(`❌ Photo not found or API error for ID: ${photoId}`);
          return NextResponse.json(
            {
              error: "Photo not found or API error",
              message:
                "This could be due to rate limiting, invalid photo ID, or API issues. Please try again later.",
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

        // Trigger download tracking as required by Unsplash API terms
        try {
          await fetch(`https://api.unsplash.com/photos/${photo.id}/download`, {
            headers: {
              Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
          });
        } catch (error) {
          // Download tracking failed, but continue serving the image
          console.warn("Download tracking failed for photo:", photo.id);
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

        return NextResponse.json(responseData);
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
            error:
              "Invalid action. Supported actions: get-photo, extract-id",
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
