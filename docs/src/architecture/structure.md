# Project Structure

Detailed breakdown of the project's directory structure.

## Root Directory

```
├── .github/          # GitHub Actions workflows
├── .vscode/          # VS Code configuration
├── content/          # MDX content files
├── docs/            # MkDocs documentation
├── public/          # Static assets
├── scripts/         # Build and utility scripts
├── src/             # Application source code
├── tools/           # Git submodules
└── training-data/   # AI chatbot training data
```

## Source Directory (`src/`)

### `app/`

Next.js 16 App Router pages and API routes.

```
app/
├── (routes)/        # Page routes
├── api/            # API endpoints
├── fonts/          # Font files
├── globals.css     # Global styles
├── layout.tsx      # Root layout
└── page.tsx        # Homepage
```

### `components/`

React components organized by purpose.

```
components/
├── common/         # Shared components
│   ├── effects/   # Visual effects
│   ├── layout/    # Layout components
│   ├── media/     # Media components
│   ├── sections/  # Page sections
│   └── ui/        # UI primitives
├── features/      # Feature-specific
│   ├── gallery/   # Gallery components
│   ├── notes/     # Blog components
│   └── projects/  # Project components
└── mdx/           # MDX components
```

### `hooks/`

Custom React hooks by domain.

```
hooks/
├── animation/     # Animation hooks
├── data/          # Data fetching
├── observers/     # Observers
├── ui/            # UI interactions
└── utilities/     # Generic utilities
```

### `lib/`

Utilities and helper functions.

```
lib/
├── animation/     # Animation config
├── cache/         # Caching utilities
├── content/       # Content processing
├── image/         # Image optimization
├── utils/         # General utilities
│   ├── api/      # API utilities
│   ├── formatting/ # Formatters
│   ├── positioning/ # Layout
│   └── theme/    # Theme utilities
├── logger.ts      # Logging utility
└── performance.ts # Performance utils
```

## Content Directory

```
content/
├── notes/         # Blog posts (.mdx)
└── projects/      # Project pages (.mdx)
```

## Scripts Directory

```
scripts/
├── build/         # Build-time scripts
├── setup/         # Environment setup
└── content/       # Content processing
```

## Public Directory

```
public/
├── images/        # Image assets
│   ├── unsplash/ # Cached Unsplash images
│   └── vsco/     # Cached VSCO images
├── fonts/        # Font files
└── *.json        # Manifests
```

## Configuration Files

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS config
- `next.config.js` - Next.js configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier formatting
- `vitest.config.ts` - Test configuration

## Next Steps

- [Tech Stack →](tech-stack.md)
- [Development Guide →](../getting-started/development.md)
