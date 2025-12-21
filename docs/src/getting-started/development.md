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
pnpm lint:fix         # Fix linting issues
pnpm type-check       # Run TypeScript check
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
```

#### Testing

```bash
pnpm test             # Run tests
pnpm test:run         # Run tests once
pnpm test:watch       # Watch mode
pnpm test:coverage    # Generate coverage report
```

#### Build Scripts

```bash
pnpm build:cache-images       # Build image manifest
pnpm download:images:unsplash # Download Unsplash images
pnpm download:images:vsco     # Download VSCO images
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   │   ├── animation/   # Animation hooks
│   │   ├── data/        # Data fetching hooks
│   │   ├── observers/   # Observer hooks
│   │   ├── ui/          # UI hooks
│   │   └── utilities/   # Utility hooks
│   ├── lib/             # Utilities and helpers
│   │   ├── animation/   # Animation utilities
│   │   ├── content/     # Content processing
│   │   ├── image/       # Image utilities
│   │   └── utils/       # General utilities
│   └── types/           # TypeScript types
├── content/             # MDX content
│   ├── notes/          # Blog posts
│   └── projects/       # Project pages
├── public/              # Static assets
├── scripts/             # Build scripts
│   ├── build/          # Build-time scripts
│   ├── setup/          # Setup scripts
│   └── content/        # Content scripts
└── tools/               # Git submodules
```

## Code Organization

### Hooks

Hooks are organized by domain:

- `animation/` - Performance-aware animation hooks
- `data/` - Data fetching (Gumroad, VSCO)
- `observers/` - Intersection observers
- `ui/` - UI interactions (search, pagination)
- `utilities/` - Generic utilities (mounted, interval)

### Lib

Library code is grouped by feature:

- `animation/` - Framer Motion variants and config
- `content/` - MDX, Git, Contentlayer utilities
- `image/` - Image fallback and optimization
- `utils/` - Categorized utilities (api, formatting, theme, positioning)

## Adding New Features

### 1. Create Component

```typescript
// src/components/features/my-feature/MyComponent.tsx
import { FC } from 'react';

export const MyComponent: FC = () => {
  return <div>My Feature</div>;
};
```

### 2. Add Custom Hook (if needed)

```typescript
// src/hooks/utilities/use-my-hook.ts
export function useMyHook() {
  // Hook logic
  return {};
}
```

### 3. Add Tests

```typescript
// src/__tests__/my-component.test.tsx
import { render } from '@testing-library/react';
import { MyComponent } from '@/components/features/my-feature/MyComponent';

describe('MyComponent', () => {
  it('renders', () => {
    render(<MyComponent />);
  });
});
```

## Best Practices

### Code Style

- Use TypeScript for all new code
- Follow the existing patterns in the codebase
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

## Debugging

### VS Code

Launch configuration is provided in `.vscode/launch.json`:

1. Set breakpoints in your code
2. Press F5 or Run → Start Debugging
3. Debug in your browser or VS Code

### Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Find your file in the file tree
4. Set breakpoints and debug

### React DevTools

Install the [React DevTools](https://react.dev/learn/react-developer-tools) extension for component inspection.

## Next Steps

- [Environment Variables →](environment.md)
- [Architecture Overview →](../architecture/overview.md)
- [Contributing Guidelines →](../contributing/guidelines.md)
