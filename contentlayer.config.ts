import fs from "fs";
import path from "path";
import { Pluggable } from "unified";

import {ComputedFields, defineDocumentType, makeSource,} from "contentlayer/source-files"; // eslint-disable-line

import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";

import remarkPlantUML from "@akebifiky/remark-simple-plantuml";

const getSlug = (doc: any) => doc._raw.sourceFileName.replace(/\.mdx$/, "");

const noteComputedFields: ComputedFields = {
	slug: {
		type: "string",
		resolve: (doc) => getSlug(doc),
	},
	image: {
		type: "string",
		resolve: (doc) => {
			const imagePath = path.join(
				process.cwd(),
				"public",
				"notes",
				`${getSlug(doc)}/image.png`,
			);
			return fs.existsSync(imagePath)
				? `/notes/${getSlug(doc)}/image.png`
				: null;
		},
	},
	og: {
		type: "string",
		resolve: (doc) => `/notes/${getSlug(doc)}/image.png`,
	},
};

export const Note = defineDocumentType(() => ({
	name: "Note",
	filePathPattern: `notes/**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: {type: "string", required: true},
		summary: {type: "string", required: true},
		date: {type: "string", required: true},
		updatedAt: {type: "string", required: false},
	},
	computedFields: noteComputedFields,
}));

const projectComputedFields: ComputedFields = {
	slug: {
		type: "string",
		resolve: (doc) => getSlug(doc),
	},
	image: {
		type: "string",
		resolve: (doc) => `/projects/${getSlug(doc)}/image.png`,
	},
};

export const Project = defineDocumentType(() => ({
	name: "Project",
	filePathPattern: `project/**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: {type: "string", required: true},
		summary: {type: "string", required: true},
		longSummary: {type: "string", required: false},
		date: {type: "string", required: true},
		url: {type: "string", required: false},
	},
	computedFields: projectComputedFields,
}));

export default makeSource({
	contentDirPath: "content",
	documentTypes: [Note, Project],
	mdx: {
		remarkPlugins: [
			remarkPlantUML as Pluggable,
		],
		rehypePlugins: [
			rehypePrism as Pluggable,
			rehypeSlug,
		],
	},
});
