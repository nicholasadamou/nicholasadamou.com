import fs from "fs";
import RSS from "rss";
import path from "path";
import matter from "gray-matter";

// Function to get all notes (replicated from our lib)
function getAllNotes() {
  const contentDir = path.join(process.cwd(), "content", "notes");

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
        image: frontmatter.image_url || null,
        ...frontmatter,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const allNotes = getAllNotes();

// Fetch base URL
const isDevelopment = process.env.NODE_ENV === "development";
const baseUrl = isDevelopment
  ? "http://localhost:3000"
  : "https://nicholasadamou.com";

const feed = new RSS({
  title: "Nicholas Adamou's Notes",
  description:
    "I am a full stack software engineer who is on a mission to make the world a better place through code.",
  feed_url: `${baseUrl}/rss.xml`,
  site_url: baseUrl,
  language: "en",
});

async function generateRSS() {
  for (const note of allNotes) {
    const { title, summary, date, image, slug } = note;

    const imageUrl = image ? `${baseUrl}${image}` : null;
    const mimeType = imageUrl ? getMimeType(imageUrl) : "image/jpeg";

    feed.item({
      title: title,
      description: summary,
      url: `${baseUrl}/notes/${slug}`,
      date: date,
      custom_elements: [
        ...(imageUrl
          ? [
              {
                "media:content": {
                  _attr: { url: imageUrl, type: mimeType, medium: "image" },
                },
              },
            ]
          : []),
      ],
    });
  }

  const rss = feed.xml({ indent: true });
  fs.writeFileSync(path.join(process.cwd(), "public", "rss.xml"), rss);
}

generateRSS();

function getMimeType(imageUrl) {
  const extension = path.extname(imageUrl).toLowerCase();
  switch (extension) {
    case ".jpeg":
    case ".jpg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}
