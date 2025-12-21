# MDX Content

Write content using MDX (Markdown + JSX components).

## Structure

```
content/
├── notes/      # Blog posts
└── projects/   # Project pages
```

## Frontmatter

```yaml
---
title: "Post Title"
date: "2024-12-21"
summary: "Brief description"
image: "https://unsplash.com/photos/..."
pinned: false
tags: ["tag1", "tag2"]
---
```

## Custom Components

Use React components in MDX:

```mdx
<Alert type="info">Important information here</Alert>

<Image src="/image.jpg" alt="Description" />

<YouTubeEmbed videoId="..." />
```

## Available Components

- `Alert` - Styled alert boxes
- `Image` - Optimized images
- `ImageFromContent` - Content images
- `LinkPreview` - Link cards
- `PlantUML` - Diagrams
- `YouTubeEmbed` - Videos
- `SourceCodeAccess` - GitHub code
- `Latex` - Math equations
- `Table` - Enhanced tables

## Code Highlighting

Syntax highlighting with Prism:

\`\`\`typescript
const example: string = "code";
\`\`\`

## Creating Content

1. Create `.mdx` file in `content/notes/` or `content/projects/`
2. Add frontmatter
3. Write content with Markdown/JSX
4. Run dev server to preview
