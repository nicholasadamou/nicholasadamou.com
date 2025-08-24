import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import fs from 'fs';
import path from 'path';

// Import JSON files directly to avoid the assert syntax issue
const allNotes = JSON.parse(fs.readFileSync('./.contentlayer/generated/Note/_index.json', 'utf8'));
const allProjects = JSON.parse(fs.readFileSync('./.contentlayer/generated/Project/_index.json', 'utf8'));

const generateSitemap = async () => {
	const sitemapStream = new SitemapStream({ hostname: process.env.SITE_URL || 'https://nicholasadamou.com' });

	// Static pages
	sitemapStream.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });

	// Notes posts
	allNotes.forEach((note) => {
		sitemapStream.write({ url: `/notes/${note.slug}`, changefreq: 'weekly', priority: 0.9 });
	});

	// Projects
	allProjects.forEach((project) => {
		sitemapStream.write({ url: `/projects/${project.slug}`, changefreq: 'monthly', priority: 0.8 });
	});

	// End sitemap stream
	sitemapStream.end();

	// Generate sitemap XML
	const sitemapOutput = path.join(process.cwd(), 'public', 'sitemap.xml');
	const writeStream = createWriteStream(sitemapOutput);
	const sitemap = await streamToPromise(sitemapStream).then((data) => data.toString());

	writeStream.write(sitemap);
	writeStream.end();

	console.log('Sitemap generated at:', sitemapOutput);
};

generateSitemap().catch(console.error);
