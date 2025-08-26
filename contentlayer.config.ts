import fs from "fs";
import path from "path";
import { Pluggable } from "unified";
import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from "contentlayer/source-files";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import remarkPlantUML from "@akebifiky/remark-simple-plantuml";
import remarkMath from "remark-math";

// Utility function to get the slug
const getSlug = (doc: any): string => {
  const filePath = doc._raw.sourceFilePath;
  // For flat structure: notes/slug.mdx -> slug
  return path.basename(filePath, ".mdx");
};

// Utility function to resolve image path from frontmatter
const resolveImageFromUrl = (doc: any): string | null => {
  // Use external image URL if provided in frontmatter
  if (doc.image_url) {
    return doc.image_url;
  }
  return null;
};

// Common computed fields
const commonComputedFields = (basePath: string): ComputedFields => ({
  slug: { type: "string", resolve: (doc) => getSlug(doc) },
  image: {
    type: "string",
    resolve: (doc) => resolveImageFromUrl(doc),
  },
});

// Define Note document type
export const Note = defineDocumentType(() => ({
  name: "Note",
  filePathPattern: `notes/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    url: { type: "string", required: false },
    pinned: { type: "boolean", required: false },
    date: { type: "string", required: true },
    updatedAt: { type: "string", required: false },
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
  filePathPattern: `projects/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    longSummary: { type: "string", required: false },
    date: { type: "string", required: true },
    url: { type: "string", required: false },
    demoUrl: { type: "string", required: false },
    technologies: { type: "list", of: { type: "string" }, required: false },
    pinned: { type: "boolean", required: false },
    image_url: { type: "string", required: false },
  },
  computedFields: commonComputedFields("projects"),
}));

// Export source configuration
export default makeSource({
  contentDirPath: "content",
  documentTypes: [Note, Project],
  mdx: {
    remarkPlugins: [remarkPlantUML as Pluggable, remarkMath],
    rehypePlugins: [
      rehypePrism as Pluggable,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      rehypeKatex,
    ],
  },
});
