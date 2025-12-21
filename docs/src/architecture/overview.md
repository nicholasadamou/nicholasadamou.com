# Architecture Overview

High-level overview of the application architecture.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Content**: MDX with Contentlayer
- **State**: React Server Components + Client Components
- **Testing**: Vitest + Testing Library
- **Deployment**: Vercel

## Key Principles

### Server-First

- Default to React Server Components
- Client components only when needed
- API routes for backend logic

### Performance

- Image optimization with Next.js Image
- Local caching for external APIs
- Lazy loading and code splitting
- Core Web Vitals optimization

### Developer Experience

- TypeScript everywhere
- Hot module replacement
- Comprehensive testing
- Well-organized code structure

## Architecture Patterns

### Folder-by-Feature

Code is organized by feature rather than by type:

```
src/
├── app/              # Routes (Next.js App Router)
├── components/       # UI components by feature
├── hooks/           # Custom hooks by domain
└── lib/             # Utilities by feature
```

### Component Patterns

- Server Components by default
- Client Components with "use client"
- Shared UI components in `components/common`
- Feature-specific in `components/features`

### Data Fetching

- Server Components fetch data directly
- API routes for client-side fetching
- Redis caching for external APIs
- Fallback to local manifests

## Next Steps

- [Project Structure →](structure.md)
- [Tech Stack Details →](tech-stack.md)
