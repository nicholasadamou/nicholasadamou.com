# Content Scripts

Scripts for processing and preparing site content for various features.

## prepare-chatbot.js

Extracts and prepares site content for AI chatbot training.

**Purpose**: Creates a comprehensive training data file from all blog posts, projects, and site content for the OpenAI Assistant.

**Usage**:

```bash
node scripts/content/prepare-chatbot.js
```

**Output**: `chatbot-training-data.txt` in the project root

**What it includes**:

- All blog posts from `content/notes/`
- All projects from `content/projects/`
- Site structure and navigation
- Contact information
- Technical stack details
- About/bio information

**Content extraction**:

- Parses MDX frontmatter
- Extracts markdown content
- Formats for AI training
- Removes code blocks and images
- Preserves headings and structure

**File structure**:

```
=== SITE INFORMATION ===
Name: nicholasadamou.com
Owner: Nicholas Adamou
...

=== BLOG POSTS ===
Title: Post Title
Date: 2024-01-01
Summary: Post summary
Content: Full post content...

=== PROJECTS ===
Title: Project Name
Technologies: React, TypeScript
Description: Project details...
```

**Usage in chatbot setup**:

1. Run this script to generate training data
2. Upload `chatbot-training-data.txt` to OpenAI Assistant
3. Enable File Search capability
4. Configure assistant with instructions

**Re-training**:
Run this script whenever you:

- Publish new blog posts
- Add new projects
- Update site content
- Change technical details

Then upload the updated file to your OpenAI Assistant dashboard.

## Troubleshooting

### Script Fails to Find Content

Check content directory structure:

```bash
ls -la content/notes
ls -la content/projects
```

### File Too Large for OpenAI

OpenAI has file size limits. If needed:

- Split into multiple files
- Remove older posts
- Summarize lengthy content
- Use selective extraction

### Invalid MDX Syntax

Fix any MDX parsing errors in content files:

```bash
# Check for syntax errors
pnpm run lint:mdx
```
