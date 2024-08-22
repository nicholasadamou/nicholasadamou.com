"use server";
import { sql } from "@vercel/postgres";

export async function getViewsCount(): Promise<
	{ slug: string; count: number }[]
> {
	console.log("getViewsCount()");
	try {
		const result = await sql`
      SELECT slug, count FROM blog_views;
    `;

		const results = result.rows as { slug: string; count: number }[];
		console.log(results);

		return results;
	} catch (error) {
		console.error("Error in getViewsCount():", error);
		return [];
	}
}
