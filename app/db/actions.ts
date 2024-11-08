import { sql } from "@vercel/postgres";

export async function incrementViews(slug: string) {
	if (!process.env.POSTGRES_URL) {
		console.log("No POSTGRES_URL found, skipping incrementViews");
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

		console.log(`Successfully incremented ${slug} by 1 view`);
	} catch (error) {
		console.error("Error incrementing views:", error);
	}
}
