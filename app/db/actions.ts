"use server";
import { sql } from "@vercel/postgres";

export async function incrementViews(slug: string, req: Request) {
	if (!process.env.POSTGRES_URL) {
		console.log("No POSTGRES_URL found, skipping incrementViews");
		return;
	}

	const cookie = req.headers.get("cookie");
	const lastViewTime = cookie ? parseInt(cookie.split('lastViewTime=')[1]) : 0;
	const currentTime = Date.now();

	// Check if the last view was less than a minute ago
	if (currentTime - lastViewTime < 60000) {
		console.log("View increment skipped due to throttling.");
		return;
	}

	console.log(`incrementViews(${slug})`);

	try {
		await sql`
            INSERT INTO blog_views (slug, count)
            VALUES (${slug}, 1)
            ON CONFLICT (slug)
            DO UPDATE SET count = blog_views.count + EXCLUDED.count;
        `;

		// Set a cookie to track the last view time
		const newCookie = `lastViewTime=${currentTime}; Path=/; HttpOnly;`;
		req.headers.set("Set-Cookie", newCookie);

		console.log(`Successfully incremented ${slug} by 1 view`);
	} catch (error) {
		console.error("Error incrementing views:", error);
	}
}
