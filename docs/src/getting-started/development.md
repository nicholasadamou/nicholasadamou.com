# Development

Learn how to develop and work with the codebase.

## Development Workflow

### Starting the Dev Server

```bash
pnpm dev
```

Features in development mode:

- Hot module replacement
- Fast refresh
- Error overlay
- Source maps

### Available Scripts

#### Development

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
```

#### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
```

#### Testing

```bash
pnpm test             # Run tests (watch mode)
pnpm test:run         # Run tests once
pnpm test:watch       # Watch mode
pnpm test:coverage    # Generate coverage report
```

#### Build Scripts

```bash
pnpm download:images:unsplash # Download Unsplash images
pnpm prepare-chatbot-data     # Prepare chatbot training data
```

## Code Organization

### Components

Components are organized by domain:

- `chat/` - Chatbot widget and dynamic loader
- `gallery/` - VSCO and featured gallery
- `home/` - Homepage sections (bio, social, Gumroad)
- `layout/` - BackNav, BottomNav, CommandPalette
- `mdx/` - Table, YouTubeEmbed for MDX content
- `notes/` - Article pages, note list, related articles
- `projects/` - Project list, filter bar, open source
- `ui/` - Shared primitives (ImagePreview, UniversalImage)

### Hooks

Custom hooks in `src/hooks/`:

- `use-views.ts` - Page view tracking
- `use-gumroad-products.ts` - Gumroad product fetching
- `use-vsco-gallery.ts` - VSCO gallery data
- `use-infinite-vsco-gallery.ts` - Paginated VSCO gallery

### Lib

Library code grouped by feature:

- `animation/` - Framer Motion variants and config
- `content/` - MDX parsing with gray-matter
- `image/` - Unsplash image resolution and attribution
- `projects/` - Project config and icon components
- `og.ts` - OG image URL generation
- `vsco-local.ts` - Local VSCO export reader

## Best Practices

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use kebab-case for file names
- Export named functions/components

### Performance

- Use React Server Components where possible
- Implement proper loading states
- Optimize images with Next.js Image
- Use dynamic imports for heavy components

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Test edge cases and error states
- Use Testing Library best practices

## Next Steps

- [Environment Variables →](environment.md)
- [Architecture Overview →](../architecture/overview.md)
- [Contributing Guidelines →](../contributing/guidelines.md)
