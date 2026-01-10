import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

// Types matching your existing Contentlayer schema
export interface BaseContent {
  slug: string;
  title: string;
  summary: string;
  date: string;
  image: string | null;
  og: string;
  _raw: {
    sourceFilePath: string;
    sourceFileDir: string;
    sourceFileName: string;
    contentType: string;
  };
  body: {
    code: string;
    raw: string;
  };
}

export interface Note extends BaseContent {
  url?: string;
  pinned?: boolean;
  updatedAt?: string;
  image_url?: string;
}

export interface Project extends BaseContent {
  longSummary?: string;
  url?: string;
  demoUrl?: string;
  technologies?: string[];
  pinned?: boolean;
  image_url?: string;
}

const contentDirectory = path.join(process.cwd(), "content");

// Utility function to get the slug from file path
const getSlug = (filePath: string): string => {
  return path.basename(filePath, ".mdx");
};

// Utility function to resolve image path from frontmatter
const resolveImageFromUrl = (frontmatter: any): string | null => {
  // Use external image URL if provided in frontmatter
  if (frontmatter.image_url) {
    return frontmatter.image_url;
  }
  return null;
};

// Function to read and parse a single MDX file
function parseMDXFile(
  filePath: string,
  contentType: "notes" | "projects"
): BaseContent {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent, {
    engines: {
      yaml: (s: string) => yaml.load(s) as object,
    },
  });

  const slug = getSlug(filePath);
  const relativePath = path.relative(contentDirectory, filePath);

  return {
    slug,
    title: frontmatter.title,
    summary: frontmatter.summary,
    date: frontmatter.date,
    image: resolveImageFromUrl(frontmatter),
    og: `/${contentType}/${slug}/image.png`,
    _raw: {
      sourceFilePath: relativePath,
      sourceFileDir: path.dirname(relativePath),
      sourceFileName: path.basename(filePath),
      contentType: "mdx",
    },
    body: {
      code: content, // Raw MDX content for processing
      raw: content, // Raw content for reading time calculation
    },
    ...frontmatter, // Spread all other frontmatter properties
  };
}

// Function to get all content of a specific type
function getAllContent(contentType: "notes" | "projects"): BaseContent[] {
  const contentDir = path.join(contentDirectory, contentType);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  return mdxFiles
    .map((file) => {
      const filePath = path.join(contentDir, file);
      return parseMDXFile(filePath, contentType);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
}

// Function to get a specific content item by slug
function getContentBySlug(
  contentType: "notes" | "projects",
  slug: string
): BaseContent | null {
  const filePath = path.join(contentDirectory, contentType, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseMDXFile(filePath, contentType);
}

// Export the main functions (replacing Contentlayer's allNotes, allProjects)
export function getAllNotes(): Note[] {
  return getAllContent("notes") as Note[];
}

export function getAllProjects(): Project[] {
  return getAllContent("projects") as Project[];
}

export function getNoteBySlug(slug: string): Note | null {
  return getContentBySlug("notes", slug) as Note | null;
}

export function getProjectBySlug(slug: string): Project | null {
  return getContentBySlug("projects", slug) as Project | null;
}

// Utility functions for filtering
export function getPinnedNotes(): Note[] {
  return getAllNotes().filter((note) => note.pinned === true);
}

export function getPinnedProjects(): Project[] {
  return getAllProjects().filter((project) => project.pinned === true);
}

// Function to get all slugs for static generation
export function getAllNoteSlugs(): string[] {
  return getAllNotes().map((note) => note.slug);
}

export function getAllProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}
