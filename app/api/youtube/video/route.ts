import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

const { YOUTUBE_API_KEY } = process.env;

if (!YOUTUBE_API_KEY) {
	throw new Error('YouTube API key is not set');
}

export async function GET(req: NextApiRequest) {
	const { searchParams } = new URL(req.url || '');
	const id = searchParams.get('id');

	if (!id) {
		return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
	}

	try {
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${YOUTUBE_API_KEY}&part=snippet`
		);
		const data = await response.json();

		if (data.items && data.items.length > 0) {
			const { title, channelTitle } = data.items[0].snippet;
			return NextResponse.json({ title, channelTitle });
		} else {
			return NextResponse.json({ error: 'Video not found' }, { status: 404 });
		}
	} catch (error) {
		return NextResponse.json({ error: 'Error fetching video details' }, { status: 500 });
	}
}
