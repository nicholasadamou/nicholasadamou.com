# Testing Guide

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing. The testing setup is comprehensive and includes unit tests, integration tests, and component tests.

## 🛠️ Testing Stack

- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Component testing utilities
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM implementation for Node.js
- **[MSW](https://mswjs.io/)** - Mock Service Worker for API mocking
- **[Vitest UI](https://vitest.dev/guide/ui.html)** - Visual test runner interface

## 📁 Test Structure

```
src/
├── __tests__/                    # Test files
│   ├── setup.ts                  # Global test setup
│   ├── utils.tsx                 # Test utilities
│   ├── components/               # Component tests
│   │   ├── ui/                   # UI component tests
│   │   └── common/               # Common component tests
│   ├── hooks/                    # Custom hook tests
│   ├── lib/                      # Utility function tests
│   └── app/                      # App-specific tests
```

## 🚀 Running Tests

### Available Commands

```bash
# Run tests in watch mode (default)
pnpm test

# Run tests once and exit
pnpm test:run

# Run tests with UI interface
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Pre-commit Testing

Tests are automatically run on staged files during pre-commit hooks via `lint-staged`. This ensures only passing code is committed:

```bash
# This runs automatically on git commit
pnpm lint-staged
```

## 📝 Test Configuration

### Vitest Config (`vitest.config.ts`)

- **Environment**: jsdom for DOM testing
- **Setup Files**: Global mocks and utilities
- **Coverage**: v8 provider with HTML/JSON reporting
- **Path Aliases**: Same as production for imports

### Global Setup (`src/__tests__/setup.ts`)

Automatically mocks commonly used Next.js and external dependencies:

- **Next.js Router** - Navigation hooks
- **Next.js Image** - Image component
- **Framer Motion** - Animation components
- **next-themes** - Theme management
- **Browser APIs** - IntersectionObserver, ResizeObserver, matchMedia

## ✨ Test Utilities

### Custom Render (`src/__tests__/utils.tsx`)

Provides a custom render function with theme providers and common setup:

```typescript
import { render, screen } from '@/__tests__/utils';

// Renders with ThemeProvider and other context
render(<MyComponent />);
```

### Mock Data Factories

Create consistent test data:

```typescript
import { createMockPost, createMockProject } from "@/__tests__/utils";

const mockPost = createMockPost({
  title: "Custom Title",
  slug: "custom-slug",
});
```

## 📋 Testing Patterns

### 1. Component Testing

```typescript
import { render, screen } from '@/__tests__/utils';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' }))
      .toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Hook Testing

```typescript
import { renderHook } from "@testing-library/react";
import { useMounted } from "@/hooks/usemounted";

describe("useMounted", () => {
  it("should return false initially", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(false);
  });
});
```

### 3. Utility Function Testing

```typescript
import { cn } from "@/lib/utils/utils";

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("px-2 py-1", "px-3")).toBe("py-1 px-3");
  });
});
```

### 4. API Route Testing

```typescript
import { mockFetchResponse } from "@/__tests__/utils";

describe("API Route", () => {
  it("should return data", async () => {
    mockFetchResponse({ success: true });

    const response = await fetch("/api/test");
    const data = await response.json();

    expect(data.success).toBe(true);
  });
});
```

## 🎯 Testing Best Practices

### ✅ Do's

1. **Test Behavior, Not Implementation**
   - Focus on what users see and interact with
   - Test component outputs and side effects

2. **Use Descriptive Test Names**

   ```typescript
   it("should show error message when form validation fails", () => {});
   ```

3. **Follow Arrange-Act-Assert Pattern**

   ```typescript
   it('should increment counter on click', () => {
     // Arrange
     render(<Counter initialValue={0} />);

     // Act
     screen.getByRole('button', { name: 'Increment' }).click();

     // Assert
     expect(screen.getByText('1')).toBeInTheDocument();
   });
   ```

4. **Mock External Dependencies**
   - Use global mocks in setup.ts
   - Mock API calls with MSW
   - Mock heavy third-party libraries

5. **Test Accessibility**
   ```typescript
   expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
   ```

### ❌ Don'ts

1. **Don't Test Implementation Details**
   - Avoid testing internal state directly
   - Don't test CSS classes unless they affect behavior

2. **Don't Over-Mock**
   - Only mock what's necessary
   - Prefer real implementations when possible

3. **Don't Write Tests That Can't Fail**
   - Ensure tests actually validate behavior
   - Avoid tests that always pass

## 🔧 Mocking Strategies

### Global Mocks (setup.ts)

For commonly used dependencies that need consistent mocking:

```typescript
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
```

### Per-Test Mocks

For specific test requirements:

```typescript
const mockSetTheme = vi.fn();
vi.mocked(useTheme).mockReturnValue({
  theme: "dark",
  setTheme: mockSetTheme,
});
```

### API Mocking with MSW

For HTTP requests:

```typescript
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/posts", (req, res, ctx) => {
    return res(ctx.json({ posts: [] }));
  })
);
```

## 📊 Coverage

### Running Coverage

```bash
pnpm test:coverage
```

### Coverage Reports

- **HTML**: `coverage/index.html` - Interactive report
- **JSON**: `coverage/coverage-summary.json` - Machine-readable
- **Text**: Console output

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🚨 Common Issues & Solutions

### 1. "Cannot find module" Errors

**Issue**: Path aliases not working in tests

**Solution**: Check `vitest.config.ts` alias configuration

### 2. "act" Warnings

**Issue**: React state updates outside act()

**Solution**: Use `await waitFor()` for async updates:

```typescript
await waitFor(() => {
  expect(screen.getByText("Updated")).toBeInTheDocument();
});
```

### 3. Timer/Date Issues

**Issue**: Tests failing due to timezone differences

**Solution**: Use consistent dates in tests:

```typescript
beforeAll(() => {
  vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
});
```

### 4. Mock Persistence

**Issue**: Mocks persisting between tests

**Solution**: Clear mocks in setup:

```typescript
afterEach(() => {
  vi.clearAllMocks();
});
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎪 Test UI

Launch the interactive test UI for visual test running:

```bash
pnpm test:ui
```

Features:

- Real-time test results
- Coverage visualization
- Test file explorer
- Watch mode controls
