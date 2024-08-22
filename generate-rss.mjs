import fs from 'fs';
import RSS from 'rss';
import path from 'path';

import { allBlogs } from './.contentlayer/generated/index.mjs';

// Fetch base URL
const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://nicholasadamou.com';

const feed = new RSS({
	title: "Nicholas Adamou's Blog",
	description: 'I am a full stack software engineer who is on a mission to make the world a better place through code.',
	feed_url: `${baseUrl}/rss.xml`,
	site_url: baseUrl,
	language: 'en',
});

async function generateRSS() {
	for (const blog of allBlogs) {
		const { title, summary, date, image, slug } = blog;

		const imageUrl = image ? `${baseUrl}${image}` : null;
		const mimeType = imageUrl ? getMimeType(imageUrl) : 'image/jpeg';

		feed.item({
			title: title,
			description: summary,
			url: `${baseUrl}/blog/${slug}`,
			date: date,
			custom_elements: [
				...(imageUrl ? [{ 'media:content': { _attr: { url: imageUrl, type: mimeType, medium: 'image' } } }] : []),
			],
		});
	}

	const rss = feed.xml({ indent: true });
	fs.writeFileSync(path.join(process.cwd(), 'public', 'rss.xml'), rss);
}

generateRSS();

function getMimeType(imageUrl) {
	const extension = path.extname(imageUrl).toLowerCase();
	switch (extension) {
		case '.jpeg':
		case '.jpg':
			return 'image/jpeg';
		case '.png':
			return 'image/png';
		case '.gif':
			return 'image/gif';
		case '.svg':
			return 'image/svg+xml';
		case '.webp':
			return 'image/webp';
		default:
			return 'image/jpeg';
	}
}
