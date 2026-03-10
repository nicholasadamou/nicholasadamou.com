# Testing Guide

This project uses **Vitest** with **React Testing Library** for comprehensive unit testing.

## Testing Stack

- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/)** - Component testing
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM implementation for Node.js
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage)** - Code coverage

## Running Tests

```bash
pnpm test             # Watch mode
pnpm test:run         # Run once
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report
```

## Test Configuration

### Vitest Config (`vitest.config.ts`)

- **Environment**: jsdom
- **Setup Files**: Global mocks and utilities in `src/__tests__/setup.ts`
- **Coverage**: v8 provider
- **Path Aliases**: Same as production (`@/` → `src/`)

### Global Setup (`src/__tests__/setup.ts`)

Automatically mocks:

- **Next.js Router** - Navigation hooks
- **Next.js Image** - Renders as `<img>`
- **Framer Motion** - Renders as plain elements
- **Browser APIs** - IntersectionObserver, ResizeObserver, matchMedia
- **fetch** - Global mock
- **localStorage** - In-memory mock

### Custom Render (`src/__tests__/utils.tsx`)

Wraps components in `ThemeProvider`:

```typescript
import { render } from "@/__tests__/utils";
render(<MyComponent />); // Wrapped in ThemeProvider
```

## Test Structure

```
src/__tests__/
├── setup.ts           # Global mocks
├── utils.tsx          # Custom render
├── lib/               # Utility tests
├── hooks/             # Hook tests
├── components/        # Component tests
└── app/api/og/        # OG API tests
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 80%
- **Functions**: > 80%
- **Lines**: > 80%

Current coverage: 93% statements, 81% branches, 98% functions, 96% lines.

## Common Patterns

### Component Test

```typescript
import { render, screen } from "@/__tests__/utils";
import MyComponent from "@/components/MyComponent";

it("renders", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeDefined();
});
```

### Hook Test

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useMyHook } from "@/hooks/use-my-hook";

it("fetches data", async () => {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  } as Response);
  const { result } = renderHook(() => useMyHook());
  await waitFor(() => expect(result.current.loading).toBe(false));
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
