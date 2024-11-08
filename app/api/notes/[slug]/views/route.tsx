import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

type Params = {
	slug: string;
};

export async function POST(request: NextRequest, { params }: { params: Params }) {
	const { slug } = params;

	if (!slug) {
		return NextResponse.json({ error: "Slug is required" }, { status: 400 });
	}

	// Throttling with Cache-Control
	const headers = new Headers();
	headers.set("Cache-Control", "public, max-age=60"); // Throttles increments to once per minute per user

	if (!process.env.POSTGRES_URL) {
		console.log("No POSTGRES_URL found, skipping incrementViews");
		return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
	}

	try {
		await sql`
      INSERT INTO notes_views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = notes_views.count + EXCLUDED.count;
    `;

		return NextResponse.json({ message: `Successfully incremented ${slug} by 1 view` }, { headers });
	} catch (error) {
		console.error("Error incrementing views:", error);
		return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 });
	}
}
