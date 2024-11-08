import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

type Params = {
	slug: string;
};

export async function POST(request: Request, { params }: { params: Params }) {
	const { slug } = params;

	// Get or set a user ID in a cookie
	const userIdCookie = request.headers.get("cookie")?.match(/user_id=([^;]*)/)?.[1];
	const userId = userIdCookie || uuidv4(); // Generate a new ID if none found

	// Extract IP address
	const userIp = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("remote-addr");

	// Check if the userIp is localhost and skip incrementing views
	if (userIp === "::1" || userIp === "127.0.0.1") {
		console.log(`Skipping view increment for '${slug}' as requests from localhost are not tracked.`);
		return NextResponse.json(
			{ error: `Skipping view increment for '${slug}' as requests from localhost are not tracked.` },
			{ status: 200 }
		);
	}

	const response = NextResponse.json({});
	if (!userIdCookie) {
		response.headers.set("Set-Cookie", `user_id=${userId}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 365}`);
	}

	if (!slug) {
		console.log("Slug is required");
		return NextResponse.json({ error: "Slug is required" }, { status: 400 });
	}

	if (!process.env.POSTGRES_URL) {
		console.log("Environment variable POSTGRES_URL is not set. Skipping view increment.");
		return NextResponse.json(
			{ error: "Server configuration error: POSTGRES_URL environment variable is missing. Please set POSTGRES_URL to connect to the database." },
			{ status: 500 }
		);
	}

	try {
		const currentTime = new Date();

		// Check the last viewed time for this slug, user, and IP address combination
		const result = await sql`
      SELECT last_viewed
      FROM user_views
      WHERE slug = ${slug} AND user_id = ${userId} AND ip_address = ${userIp}
    `;

		const userViewData = result.rows[0];

		if (userViewData) {
			const { last_viewed } = userViewData;

			// Throttle: Allow only if the last viewed timestamp is more than 1 minute ago
			if (last_viewed && new Date(currentTime.getTime() - 60000) < new Date(last_viewed)) {
				console.log("You can only increment the view count once per minute.");
				return NextResponse.json(
					{ message: "You can only increment the view count once per minute." },
					{ status: 429 }
				);
			}
		}

		// Upsert into user_views: update last_viewed if a record already exists
		await sql`
      INSERT INTO user_views (user_id, ip_address, slug, last_viewed)
      VALUES (${userId}, ${userIp}, ${slug}, ${currentTime.toISOString()})
      ON CONFLICT (user_id, ip_address, slug)
      DO UPDATE SET last_viewed = ${currentTime.toISOString()};
    `;

		// Increment the view count in notes_views for the slug
		await sql`
      INSERT INTO notes_views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = notes_views.count + 1;
    `;

		console.log(`Successfully incremented ${slug} by 1 view for user ${userId} with IP ${userIp}`);
		return response;
	} catch (error) {
		console.error("Error incrementing views:", error);
		return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 });
	}
}
