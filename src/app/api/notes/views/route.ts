import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get("slugs");

  if (!slugsParam) {
    return NextResponse.json(
      { error: "slugs query parameter is required" },
      { status: 400 }
    );
  }

  const slugs = slugsParam.split(",").filter(Boolean);

  if (slugs.length === 0) {
    return NextResponse.json({ counts: {} });
  }

  if (!process.env.POSTGRES_URL) {
    const counts: Record<string, number> = {};
    for (const slug of slugs) counts[slug] = 0;
    return NextResponse.json({ counts });
  }

  try {
    const result = await sql.query(
      `SELECT slug, count FROM notes_views WHERE slug = ANY($1)`,
      [slugs]
    );

    const counts: Record<string, number> = {};
    for (const slug of slugs) counts[slug] = 0;
    for (const row of result.rows) {
      counts[row.slug] = row.count;
    }

    return NextResponse.json({ counts });
  } catch (error) {
    console.error("Error fetching batch views:", error);
    const counts: Record<string, number> = {};
    for (const slug of slugs) counts[slug] = 0;
    return NextResponse.json({ counts });
  }
}
