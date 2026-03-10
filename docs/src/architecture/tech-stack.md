# Tech Stack

Complete list of technologies and their purposes.

## Core Framework

### Next.js 16

- App Router for file-based routing
- React Server Components
- API Routes
- Image Optimization
- Dynamic OG image generation

### React 19

- Server Components
- Client Components
- Hooks
- Suspense

### TypeScript 5

- Type safety
- Better DX
- Catch errors early

## Styling

### Tailwind CSS 4

- Utility-first CSS
- Custom design system
- Dark mode support
- Responsive design

### Framer Motion

- Declarative animations
- Gesture support
- Layout animations
- Stagger effects

## Content Management

### MDX

- Markdown with JSX
- Custom components (Table, YouTubeEmbed)
- Code highlighting with rehype-prism

### gray-matter + reading-time

- Frontmatter parsing
- Reading time estimation
- No Contentlayer dependency

## Data & Storage

### Vercel Postgres

- View counts
- Analytics data

## Image Services

### Unsplash

- High-quality photos for articles
- Local manifest-based resolution
- Attribution tracking

### VSCO

- Personal photography gallery
- Local data export for metadata (no API/scraping needed)
- Images served directly from VSCO's CDN

## Development Tools

### ESLint + Prettier

- Code linting and formatting
- Tailwind CSS class sorting
- Pre-commit hooks via Husky + lint-staged

### Vitest + Testing Library

- Unit testing
- Component testing
- > 80% code coverage
- jsdom environment

## Deployment

### Vercel

- Zero-config deployment
- Edge network
- Analytics + Speed Insights

## Package Management

### pnpm

- Fast installation
- Disk efficient
- Strict dependencies

## Next Steps

- [Architecture Overview →](overview.md)
- [Project Structure →](structure.md)
