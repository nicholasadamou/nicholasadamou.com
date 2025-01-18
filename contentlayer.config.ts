import fs from "fs";
import path from "path";
import { Pluggable } from "unified";

import { ComputedFields, defineDocumentType, makeSource } from "contentlayer/source-files";

import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from 'rehype-katex';

import remarkPlantUML from "@akebifiky/remark-simple-plantuml";
import remarkToc from "remark-toc";
import remarkMath from 'remark-math';

// Utility function to get the slug
const getSlug = (doc: any) => doc._raw.sourceFileName.replace(/\.mdx$/, "");

// Utility function to resolve image path
const resolveImagePath = (basePath: string, slug: string): string | null => {
	const imagePath = path.join(process.cwd(), "public", basePath, `${slug}/image.png`);
	return fs.existsSync(imagePath) ? `/${basePath}/${slug}/image.png` : null;
};

// Utility function to generate GitHub ZIP URL
const resolveZipUrl = (githubUrl?: string): string => {
	if (!githubUrl) return "";
	const matches = githubUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/);
	if (matches) {
		const [_, owner, repo] = matches;
		return `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;
	}
	return "";
};

// Common computed fields
const commonComputedFields = (basePath: string): ComputedFields => ({
	slug: {
		type: "string",
		resolve: (doc) => getSlug(doc),
	},
	image: {
		type: "string",
		resolve: (doc) => resolveImagePath(basePath, getSlug(doc)),
	},
	zip: {
		type: "string",
		resolve: (doc) => resolveZipUrl(doc.url),
	},
});

// Define Note document type
export const Note = defineDocumentType(() => ({
	name: "Note",
	filePathPattern: `notes/**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		summary: { type: "string", required: true },
		url: { type: "string", required: false },
		pinned: { type: "boolean", required: false },
		date: { type: "string", required: true },
		updatedAt: { type: "string", required: false },
		image_author: { type: "string", required: false },
		image_author_url: { type: "string", required: false },
		image_url: { type: "string", required: false },
	},
	computedFields: {
		...commonComputedFields("notes"),
		og: {
			type: "string",
			resolve: (doc) => `/notes/${getSlug(doc)}/image.png`,
		},
	},
}));

// Define Project document type
export const Project = defineDocumentType(() => ({
	name: "Project",
	filePathPattern: `project/**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		summary: { type: "string", required: true },
		longSummary: { type: "string", required: false },
		date: { type: "string", required: true },
		url: { type: "string", required: false },
		technologies: { type: "list", of: { type: "string" }, required: false },
		pinned: { type: "boolean", required: false },
		image_author: { type: "string", required: false },
		image_author_url: { type: "string", required: false },
		image_url: { type: "string", required: false },
	},
	computedFields: commonComputedFields("projects"),
}));

// Export source configuration
export default makeSource({
	contentDirPath: "content",
	documentTypes: [Note, Project],
	mdx: {
		remarkPlugins: [
			remarkPlantUML as Pluggable,
			[remarkToc, { heading: "Table of Contents", maxDepth: 4 }],
			remarkMath,
		],
		rehypePlugins: [
			rehypePrism as Pluggable,
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "wrap", // Wrap the heading text in an anchor link
				},
			],
			rehypeKatex,
		],
	},
});
