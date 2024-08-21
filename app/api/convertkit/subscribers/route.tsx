const API_SECRET = process.env.CONVERTKIT_API_SECRET;

export async function GET() {
	if (!API_SECRET) {
		console.error("Error: CONVERTKIT_API_SECRET is missing");
		return new Response("Internal Server Error: API secret is missing", {
			status: 500,
		});
	}

	const url = `https://api.convertkit.com/v3/subscribers?api_secret=${API_SECRET}`;

	try {
		const response = await fetch(url, {
			cache: "no-store",
		});

		if (!response.ok) {
			const errorResponse = await response.json();
			console.error(`Error: ${response.status} ${response.statusText}`, errorResponse);
			return new Response(`Error: ${response.status} ${response.statusText}`, {
				status: response.status,
			});
		}

		const data = await response.json();
		const subscribers = data.total_subscribers;

		return new Response(JSON.stringify({ subscribers }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Unexpected Error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
