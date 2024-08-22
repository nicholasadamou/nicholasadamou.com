"use server";
import { sql } from "@vercel/postgres";

export async function incrementViews(slug: string) {
	console.log(`incrementViews(${slug})`);
	try {
		await sql`
      INSERT INTO blog_views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = blog_views.count + 1
    `;
		console.log(`Successfully incremented ${slug} by 1 view`);
	} catch (error) {
		console.error("Error incrementing views:", error);
	}
}
