import { NextResponse } from "next/server";
import RSS from "rss";
import { getAllNotes } from "@/lib/content/contentlayer-data";

export async function GET() {
  const allNotes = getAllNotes();

  // Determine base URL
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://nicholasadamou.com";

  const feed = new RSS({
    title: "Nicholas Adamou's Notes",
    description:
      "I am a full stack software engineer who is on a mission to make the world a better place through code.",
    feed_url: `${baseUrl}/rss.xml`,
    site_url: baseUrl,
    language: "en",
  });

  // Add each note to the RSS feed
  allNotes.forEach((note) => {
    const { title, summary, date, image_url, slug } = note;

    const imageUrl = image_url ? `${baseUrl}${image_url}` : null;
    const mimeType = imageUrl ? getMimeType(imageUrl) : "image/jpeg";

    feed.item({
      title: title,
      description: summary,
      url: `${baseUrl}/notes/${slug}`,
      date: date,
      custom_elements: [
        ...(imageUrl
          ? [
              {
                "media:content": {
                  _attr: { url: imageUrl, type: mimeType, medium: "image" },
                },
              },
            ]
          : []),
      ],
    });
  });

  const rss = feed.xml({ indent: true });

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      // Cache for 1 hour, allow stale content for 24 hours
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function getMimeType(imageUrl: string): string {
  const extension = imageUrl.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}
