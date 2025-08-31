import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Function to get all content
function getAllContent(contentType) {
  const contentDir = path.join(process.cwd(), "content", contentType);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  return mdxFiles
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter } = matter(fileContent);
      const slug = path.basename(file, ".mdx");

      return {
        slug,
        title: frontmatter.title,
        summary: frontmatter.summary,
        date: frontmatter.date,
        ...frontmatter,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const allNotes = getAllContent("notes");
const allProjects = getAllContent("projects");

const generateSitemap = async () => {
  const sitemapStream = new SitemapStream({
    hostname: process.env.SITE_URL || "https://nicholasadamou.com",
  });

  // Static pages
  sitemapStream.write({ url: "/about", changefreq: "monthly", priority: 0.8 });

  // Notes posts
  allNotes.forEach((note) => {
    sitemapStream.write({
      url: `/notes/${note.slug}`,
      changefreq: "weekly",
      priority: 0.9,
    });
  });

  // Projects
  allProjects.forEach((project) => {
    sitemapStream.write({
      url: `/projects/${project.slug}`,
      changefreq: "monthly",
      priority: 0.8,
    });
  });

  // End sitemap stream
  sitemapStream.end();

  // Generate sitemap XML
  const sitemapOutput = path.join(process.cwd(), "public", "sitemap.xml");
  const writeStream = createWriteStream(sitemapOutput);
  const sitemap = await streamToPromise(sitemapStream).then((data) =>
    data.toString()
  );

  writeStream.write(sitemap);
  writeStream.end();

  console.log("Sitemap generated at:", sitemapOutput);
};

generateSitemap().catch(console.error);
