# Architecture Overview

High-level overview of the application architecture.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Content**: MDX with gray-matter and reading-time
- **State**: React Server Components + Client Components
- **Testing**: Vitest + Testing Library
- **Deployment**: Vercel

## Key Principles

### Server-First

- Default to React Server Components
- Client components only when needed ("use client")
- API routes for backend logic

### Performance

- Image optimization with Next.js Image
- Local images for Unsplash and VSCO
- Lazy loading and code splitting
- Core Web Vitals optimization

### Developer Experience

- TypeScript everywhere
- Hot module replacement
- Comprehensive testing (>80% coverage)
- Well-organized code structure

## Architecture Patterns

### Folder-by-Domain

Code is organized by domain rather than by type:

```
src/
├── app/              # Routes (Next.js App Router)
├── components/       # UI components by domain
├── hooks/            # Custom hooks
└── lib/              # Utilities by feature
```

### Component Patterns

- Server Components by default
- Client Components with "use client"
- Domain-specific components in `components/{domain}/`
- Shared UI primitives in `components/ui/`

### Data Fetching

- Server Components fetch data directly
- API routes for client-side fetching
- Unsplash images resolved to local paths at parse time
- VSCO images served from local data export

## Next Steps

- [Project Structure →](structure.md)
- [Tech Stack Details →](tech-stack.md)
