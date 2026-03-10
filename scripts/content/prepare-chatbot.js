// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

/**
 * Script to extract and compile all site content for AI chatbot training.
 * This creates a comprehensive text file containing all blog posts, projects,
 * and other relevant site information.
 */

const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "training-data",
  "chatbot-training-data.txt"
);
const CONTENT_DIR = path.join(__dirname, "..", "..", "content");
const PROJECTS_CONFIG = path.join(
  __dirname,
  "..",
  "..",
  "src",
  "lib",
  "projects",
  "config.ts"
);

// Helper function to recursively find all MDX files
function findMdxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findMdxFiles(fullPath, files);
    } else if (item.endsWith(".mdx") || item.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Helper function to extract content without frontmatter
function extractContent(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    // Extract title from frontmatter
    const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath);

    return {
      title,
      frontmatter,
      body,
    };
  }

  return {
    title: path.basename(filePath),
    frontmatter: "",
    body: content,
  };
}

// Extract projects from TypeScript config file
function extractProjects() {
  const content = fs.readFileSync(PROJECTS_CONFIG, "utf-8");
  const projects = [];

  // Match each project object in the array
  const projectRegex =
    /\{\s*name:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"[\s\S]*?description:\s*(?:"([^"]+)"|`([^`]+)`)[\s\S]*?(?:tags:\s*\[([^\]]*)\])?\s*\}/g;

  let match;
  while ((match = projectRegex.exec(content)) !== null) {
    const tags = match[5]
      ? match[5]
          .match(/"([^"]+)"/g)
          ?.map((t) => t.replace(/"/g, ""))
          .join(", ")
      : "";

    projects.push({
      name: match[1],
      href: match[2],
      description: match[3] || match[4],
      tags,
    });
  }

  return projects;
}

async function compileContent() {
  console.log("🚀 Starting content extraction for chatbot training...\n");

  let output = `# Nicholas Adamou - Website Content for AI Training
# Generated: ${new Date().toISOString()}
# This file contains all the content from nicholasadamou.com for AI assistant training.

## About Nicholas Adamou
Nicholas Adamou is a Senior Software Engineer at Onebrief, passionate about making the world better through software.

He is a senior software engineer who has worked at companies including IBM, Lockheed Martin (Space), Apple, and Fly Blackbird (acquired by SurfAir).

He holds a Master of Science in Computer Science from Georgia Institute of Technology and a Bachelor of Arts in Computer Science from Cornell College.

He specializes in React, Next.js, TypeScript, Node.js, Java, Spring Boot, Cloud Architecture, and DevOps. His portfolio website showcases his projects, blog posts (notes), and professional experience.

---

`;

  // Process blog posts (notes)
  const notesDir = path.join(CONTENT_DIR, "notes");
  if (fs.existsSync(notesDir)) {
    console.log("📝 Processing blog posts...");
    const noteFiles = findMdxFiles(notesDir);

    output += `## BLOG POSTS / NOTES (${noteFiles.length} posts)\n\n`;

    for (const file of noteFiles) {
      const { title, frontmatter, body } = extractContent(file);
      output += `### ${title}\n\n`;
      if (frontmatter) {
        output += `**Metadata:**\n${frontmatter}\n\n`;
      }
      output += `${body}\n\n---\n\n`;
      console.log(`  ✅ Processed: ${title}`);
    }
  }

  // Process projects from config
  if (fs.existsSync(PROJECTS_CONFIG)) {
    console.log("\n🛠️  Processing projects...");
    const projects = extractProjects();

    output += `## PROJECTS (${projects.length} projects)\n\n`;

    for (const project of projects) {
      output += `### ${project.name}\n\n`;
      output += `- URL: ${project.href}\n`;
      output += `- Description: ${project.description}\n`;
      if (project.tags) {
        output += `- Tags: ${project.tags}\n`;
      }
      output += `\n---\n\n`;
      console.log(`  ✅ Processed: ${project.name}`);
    }
  }

  // Add additional context
  output += `## CONTACT INFORMATION

Nicholas Adamou can be contacted through:
- Email: nicholasadamou@outlook.com
- GitHub: https://github.com/nicholasadamou
- LinkedIn: https://linkedin.com/in/nicholas-adamou

## WEBSITE STRUCTURE

The website is organized into the following main sections:
- Home (/) - Landing page with introduction, featured projects, and recent notes
- Notes (/notes) - Blog posts and technical articles
- Projects (/projects) - Portfolio of open-source work and tools

## TECHNICAL STACK

The website is built with:
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS
- MDX for content
- Framer Motion for animations
- Vercel for hosting and deployment

## ADDITIONAL NOTES

- All blog posts include reading time estimates
- Projects may include links to live demos and GitHub repositories
- The site features a custom color theme picker with light/dark mode support
- Content is dynamically managed through MDX files
`;

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");

  console.log(`\n✅ Content extraction complete!`);
  console.log(`📄 Output file: ${OUTPUT_FILE}`);
  console.log(
    `📊 Total size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`
  );
  console.log(
    `\n💡 Next steps:\n   1. Upload this file to your OpenAI Assistant in the dashboard`
  );
  console.log(
    `   2. Enable "File Search" capability for the assistant\n   3. Add the OPENAI_ASSISTANT_ID to your .env file`
  );
}

// Run the script
compileContent().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
