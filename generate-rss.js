const fs = require('fs');
const RSS = require('rss');
const path = require('path');
const matter = require('gray-matter');

// Fetch base URL
const isDevelopment = process.env.NODE_ENV === 'development'
const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://nicholasadamou.com';

const feed = new RSS({
	title: 'Nicholas Adamou\'s Blog',
	description: 'I am a full stack software engineer who is on a mission to make the world a better place through code.',
	feed_url: `${baseUrl}/rss.xml`,  // Base URL includes the protocol
	site_url: baseUrl,
	language: 'en',
});

// Directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), 'content/blog');

// Read filenames in the posts directory
const filenames = fs.readdirSync(postsDirectory);

filenames.forEach((filename) => {
	const filePath = path.join(postsDirectory, filename);
	const fileContents = fs.readFileSync(filePath, 'utf8');

	const { data } = matter(fileContents); // Parse front-matter

	// Add each post to the RSS feed
	feed.item({
		title: data.title,
		description: data.description,
		url: `${baseUrl}/blog/${filename.replace('.mdx', '')}`,  // Construct the correct URL
		date: data.date,
	});
});

// Generate RSS XML
const rss = feed.xml({ indent: true });

// Write the RSS XML to a public file
fs.writeFileSync(path.join(process.cwd(), 'public', 'rss.xml'), rss);
