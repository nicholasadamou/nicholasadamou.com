const fs = require("fs");
const path = require("path");

/**
 * Script to extract and compile all site content for AI chatbot training.
 * This creates a comprehensive text file containing all blog posts, projects,
 * and other relevant site information.
 */

const OUTPUT_FILE = path.join(__dirname, "..", "chatbot-training-data.txt");
const CONTENT_DIR = path.join(__dirname, "..", "content");

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

async function compileContent() {
  console.log("🚀 Starting content extraction for chatbot training...\n");

  let output = `# Nicholas Adamou - Website Content for AI Training
# Generated: ${new Date().toISOString()}
# This file contains all the content from nicholasadamou.com for AI assistant training.

## About Nicholas Adamou
Nicholas Adamou is a Full Stack Software Engineer passionate about making the world better through software.
He specializes in React, Next.js, TypeScript, Node.js, Cloud Architecture, and DevOps.
His portfolio website showcases his projects, blog posts, and professional experience.

---

`;

  // Process blog posts (notes)
  const notesDir = path.join(CONTENT_DIR, "notes");
  if (fs.existsSync(notesDir)) {
    console.log("📝 Processing blog posts...");
    const noteFiles = findMdxFiles(notesDir);

    output += `## BLOG POSTS (${noteFiles.length} posts)\n\n`;

    for (const file of noteFiles) {
      const { title, body } = extractContent(file);
      output += `### ${title}\n\n${body}\n\n---\n\n`;
      console.log(`  ✅ Processed: ${title}`);
    }
  }

  // Process projects
  const projectsDir = path.join(CONTENT_DIR, "projects");
  if (fs.existsSync(projectsDir)) {
    console.log("\n🛠️  Processing projects...");
    const projectFiles = findMdxFiles(projectsDir);

    output += `## PROJECTS (${projectFiles.length} projects)\n\n`;

    for (const file of projectFiles) {
      const { title, body } = extractContent(file);
      output += `### ${title}\n\n${body}\n\n---\n\n`;
      console.log(`  ✅ Processed: ${title}`);
    }
  }

  // Add additional context
  output += `## CONTACT INFORMATION

Nicholas Adamou can be contacted through:
- Email: contact form on the website at /contact
- GitHub: https://github.com/nicholasadamou
- Twitter/X: @nicholasadamou
- LinkedIn: Available on request through the contact form

## WEBSITE STRUCTURE

The website is organized into the following main sections:
- Home (/) - Landing page with introduction
- About (/about) - Detailed information about Nicholas, skills, and experience
- Notes (/notes) - Blog posts and technical articles
- Projects (/projects) - Portfolio of work and open-source contributions
- Gallery (/gallery) - Photography and VSCO integration
- Contact (/contact) - Contact form for reaching out

## TECHNICAL STACK

The website is built with:
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- MDX for content
- Framer Motion for animations
- Vercel for hosting and deployment

## ADDITIONAL NOTES

- All blog posts include view tracking and reading time estimates
- Projects may include links to live demos and GitHub repositories
- The site features dark mode support
- Photography gallery integrates with VSCO and Unsplash+
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
