# MDX Content

Write content using MDX (Markdown + JSX components).

## Structure

```
content/
└── notes/      # Blog posts
```

## Frontmatter

```yaml
---
title: "Post Title"
date: "2024-12-21"
summary: "Brief description"
image: "https://unsplash.com/photos/..."
pinned: false
---
```

Fields:

- `title` - Post title (required)
- `date` - Publication date (required)
- `summary` - Short description (required)
- `image` / `image_url` - Hero image (optional, Unsplash URL or local path)
- `pinned` - Pin to top of list (optional)

## Parsing Pipeline

Content is parsed in `src/lib/content/mdx.ts` using:

1. `gray-matter` - Frontmatter extraction with YAML engine
2. `reading-time` - Estimated read time
3. Custom slug generation from filename

## Custom Components

Available in MDX:

- `Table` - Enhanced tables with column definitions
- `YouTubeEmbed` - Responsive YouTube embeds

## Creating Content

1. Create `.mdx` file in `content/notes/`
2. Add frontmatter with required fields
3. Write content with Markdown
4. Run dev server to preview
