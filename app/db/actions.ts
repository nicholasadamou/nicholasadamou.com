import { sql } from "@vercel/postgres";

export async function incrementViews(slug: string, reqHeaders: Headers) {
	if (!process.env.POSTGRES_URL) {
		console.log("No POSTGRES_URL found, skipping incrementViews");
		return;
	}

	const cookie = reqHeaders.get("cookie");
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
			INSERT INTO notes_views (slug, count)
			VALUES (${slug}, 1)
			ON CONFLICT (slug)
			DO UPDATE SET count = notes_views.count + EXCLUDED.count;
		`;

		// Set a cookie to track the last view time
		reqHeaders.set("Set-Cookie", `lastViewTime=${currentTime}; Path=/; HttpOnly;`);

		console.log(`Successfully incremented ${slug} by 1 view`);
	} catch (error) {
		console.error("Error incrementing views:", error);
	}
}
