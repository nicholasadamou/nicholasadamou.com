import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import readingTime from "reading-time";

export interface Article {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  image?: string | null;
  pinned?: boolean;
  body: {
    code: string;
    raw: string;
  };
}

const contentDirectory = path.join(process.cwd(), "content");

const getSlug = (filePath: string): string => {
  return path.basename(filePath, ".mdx");
};

function parseMDXFile(filePath: string): Article {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent, {
    engines: {
      yaml: (s: string) => yaml.load(s) as object,
    },
  });

  const slug = getSlug(filePath);
  const stats = readingTime(content);

  return {
    slug,
    title: frontmatter.title,
    summary: frontmatter.summary,
    date: frontmatter.date,
    readTime: stats.text,
    image: frontmatter.image_url || frontmatter.image || null,
    pinned: frontmatter.pinned || false,
    body: {
      code: content,
      raw: content,
    },
  };
}

export function getAllArticles(): Article[] {
  const notesDir = path.join(contentDirectory, "notes");

  if (!fs.existsSync(notesDir)) {
    return [];
  }

  const files = fs.readdirSync(notesDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  return mdxFiles
    .map((file) => {
      const filePath = path.join(notesDir, file);
      return parseMDXFile(filePath);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(contentDirectory, "notes", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseMDXFile(filePath);
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}

export function getRelatedArticles(slug: string, count = 2): Article[] {
  const all = getAllArticles();
  const filtered = all.filter((a) => a.slug !== slug);

  // Shuffle and pick `count` articles
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered.slice(0, count);
}
