import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

type Params = { slug: string };

export async function POST(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { error: "POSTGRES_URL not configured" },
      { status: 500 }
    );
  }

  const userIdCookie = request.headers
    .get("cookie")
    ?.match(/user_id=([^;]*)/)?.[1];
  const userId = userIdCookie || uuidv4();

  const userIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("remote-addr");

  // Skip localhost
  if (userIp === "::1" || userIp === "127.0.0.1") {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  const response = NextResponse.json({});
  if (!userIdCookie) {
    response.headers.set(
      "Set-Cookie",
      `user_id=${userId}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 365}`
    );
  }

  try {
    const currentTime = new Date();

    // Throttle: 1 view per minute per user/IP/slug
    const result = await sql`
      SELECT last_viewed FROM user_views
      WHERE slug = ${slug} AND user_id = ${userId} AND ip_address = ${userIp}
    `;

    const existing = result.rows[0];
    if (
      existing?.last_viewed &&
      new Date(currentTime.getTime() - 60000) < new Date(existing.last_viewed)
    ) {
      return NextResponse.json({ message: "Rate limited" }, { status: 429 });
    }

    // Upsert user_views
    await sql`
      INSERT INTO user_views (user_id, ip_address, slug, last_viewed)
      VALUES (${userId}, ${userIp}, ${slug}, ${currentTime.toISOString()})
      ON CONFLICT (user_id, ip_address, slug)
      DO UPDATE SET last_viewed = ${currentTime.toISOString()}
    `;

    // Increment notes_views
    await sql`
      INSERT INTO notes_views (slug, count) VALUES (${slug}, 1)
      ON CONFLICT (slug) DO UPDATE SET count = notes_views.count + 1
    `;

    return response;
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Failed to increment views" },
      { status: 500 }
    );
  }
}

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }

  try {
    const result = await sql`
      SELECT count FROM notes_views WHERE slug = ${slug}
    `;
    const count = result.rows[0]?.count || 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
