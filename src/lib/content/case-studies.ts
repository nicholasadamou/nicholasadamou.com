import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { clients } from "./clients";

export function getCaseStudy(slug: string) {
  const client = clients.find((item) => item.slug === slug);
  if (!client) return null;
  const { content, data } = matter(
    fs.readFileSync(
      path.join(process.cwd(), "content/clients", `${slug}.md`),
      "utf8"
    )
  );
  if (
    !Array.isArray(data.stack) ||
    !data.stack.every((item) => typeof item === "string")
  )
    throw new Error(`Invalid case-study stack: ${slug}`);
  return {
    ...client,
    content,
    stack: data.stack as string[],
    readTime: readingTime(content).text,
  };
}
