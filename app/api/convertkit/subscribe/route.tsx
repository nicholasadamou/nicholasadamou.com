import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.CONVERTKIT_API_KEY;
const FORM_ID = process.env.CONVERTKIT_FORM_ID;

export async function POST(req: NextRequest) {
	if (!API_KEY || !FORM_ID) {
		console.error("Error: Missing CONVERTKIT_API_KEY or CONVERTKIT_FORM_ID environment variable.");
		return new Response("Internal Server Error: Configuration missing", {
			status: 500,
		});
	}

	try {
		const { email } = await req.json();

		if (!email || typeof email !== 'string') {
			console.error("Error: Invalid email provided.");
			return new Response("Bad Request: Invalid email", {
				status: 400,
			});
		}

		const url = `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({
				api_key: API_KEY,
				email: email,
			}),
		});

		if (!response.ok) {
			const errorResponse = await response.json();
			console.error(`Error: ${response.status} ${response.statusText}`, errorResponse);
			return new Response(`Error: ${response.status} ${response.statusText}`, {
				status: response.status,
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Unexpected Error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
