# Project Structure

Detailed breakdown of the project's directory structure.

## Root Directory

```
├── .github/          # GitHub Actions workflows
├── content/          # MDX content files
├── docs/             # MkDocs documentation
├── public/           # Static assets
├── scripts/          # Build and utility scripts
└── src/              # Application source code
```

## Source Directory (`src/`)

### `app/`

Next.js 16 App Router pages and API routes.

```
app/
├── api/             # API endpoints
│   ├── chatbot/     # AI chatbot
│   ├── emails/      # Contact form
│   ├── github/repos/# GitHub integration
│   ├── gumroad/products/ # Gumroad products
│   ├── notes/[slug]/views/ # View tracking
│   ├── og/          # OG image generation
│   ├── search/      # Content search
│   └── vsco/        # VSCO gallery
├── globals.css      # Global styles
├── layout.tsx       # Root layout
└── page.tsx         # Homepage
```

### `components/`

React components organized by domain.

```
components/
├── chat/            # Chatbot widget
├── gallery/         # VSCO gallery, featured gallery
├── home/            # Bio, social links, Gumroad
├── layout/          # BackNav, BottomNav, CommandPalette
├── mdx/             # Table, YouTubeEmbed
├── notes/           # ArticlePage, NoteList, RelatedArticles
├── projects/        # ProjectList, FilterBar, OpenSource
├── ui/              # ImagePreview, UniversalImage
└── ThemeProvider.tsx # Custom theme context
```

### `hooks/`

Custom React hooks.

```
hooks/
├── use-views.ts                 # Page view tracking
├── use-gumroad-products.ts      # Gumroad products
├── use-vsco-gallery.ts          # VSCO gallery data
└── use-infinite-vsco-gallery.ts # Paginated VSCO
```

### `lib/`

Utilities and helper functions.

```
lib/
├── animation/     # Framer Motion variants
├── content/       # MDX parsing (gray-matter)
├── image/         # Unsplash resolution
├── projects/      # Project config and icons
├── og.ts          # OG image URL generation
└── vsco-local.ts  # Local VSCO export reader
```

## Content Directory

```
content/
└── notes/         # Blog posts (.mdx)
```

## Data Directory

```
data/
└── vsco-export.json  # VSCO data export metadata
```

## Scripts Directory

```
scripts/
├── build/         # Image download scripts
├── content/       # Chatbot training data
└── training-data/ # Generated training data
```

## Public Directory

```
public/
└── images/        # Image assets
    ├── unsplash/  # Downloaded Unsplash images
    └── vsco/      # Downloaded VSCO images
```

## Configuration Files

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint rules
- `postcss.config.mjs` - PostCSS config
- `vitest.config.ts` - Test configuration

## Next Steps

- [Tech Stack →](tech-stack.md)
- [Development Guide →](../getting-started/development.md)
