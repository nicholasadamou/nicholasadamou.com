# Testing Guide

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing. The testing setup is comprehensive and includes unit tests, integration tests, and component tests.

## Testing Stack

- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Component testing utilities
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM implementation for Node.js
- **[MSW](https://mswjs.io/)** - Mock Service Worker for API mocking
- **[Vitest UI](https://vitest.dev/guide/ui.html)** - Visual test runner interface

## Running Tests

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

Tests are automatically run on staged files during pre-commit hooks via `lint-staged`.

## Test Configuration

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

## Testing Patterns

### Component Testing

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

### Hook Testing

```typescript
import { renderHook } from "@testing-library/react";
import { useMounted } from "@/hooks/useMounted";

describe("useMounted", () => {
  it("should return false initially", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(false);
  });
});
```

### Utility Function Testing

```typescript
import { cn } from "@/lib/utils/utils";

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("px-2 py-1", "px-3")).toBe("py-1 px-3");
  });
});
```

## Best Practices

### Do's

**1. Test Behavior, Not Implementation**

- Focus on what users see and interact with
- Test component outputs and side effects

**2. Use Descriptive Test Names**

```typescript
it("should show error message when form validation fails", () => {});
```

**3. Follow Arrange-Act-Assert Pattern**

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

**4. Mock External Dependencies**

- Use global mocks in setup.ts
- Mock API calls with MSW
- Mock heavy third-party libraries

**5. Test Accessibility**

```typescript
expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
```

### Don'ts

**1. Don't Test Implementation Details**

- Avoid testing internal state directly
- Don't test CSS classes unless they affect behavior

**2. Don't Over-Mock**

- Only mock what's necessary
- Prefer real implementations when possible

**3. Don't Write Tests That Can't Fail**

- Ensure tests actually validate behavior
- Avoid tests that always pass

## Coverage

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

## Common Issues

### "Cannot find module" Errors

**Issue**: Path aliases not working in tests

**Solution**: Check `vitest.config.ts` alias configuration

### "act" Warnings

**Issue**: React state updates outside act()

**Solution**: Use `await waitFor()` for async updates:

```typescript
await waitFor(() => {
  expect(screen.getByText("Updated")).toBeInTheDocument();
});
```

### Timer/Date Issues

**Issue**: Tests failing due to timezone differences

**Solution**: Use consistent dates in tests:

```typescript
beforeAll(() => {
  vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [MSW Documentation](https://mswjs.io/)
