# Code Style

## TypeScript

- Use kebab-case for files
- Prefer named exports
- Add JSDoc comments for public APIs

## React

- Functional components only
- Custom hooks for shared logic
- Use Tailwind for styling

## Formatting

- 2-space indentation
- Double quotes for strings
- Semicolons required

## Pre-commit Setup

This project uses **Husky** and **lint-staged** to automatically format and lint code before commits.

### What Happens on Commit

1. **JavaScript/TypeScript files** (`.js`, `.jsx`, `.ts`, `.tsx`):
   - ESLint runs with `--fix`
   - Prettier formats the code

2. **Other files** (`.json`, `.css`, `.md`, `.mdx`):
   - Prettier formats the code

### Manual Commands

```bash
pnpm format           # Format all files
pnpm format:check     # Check formatting
pnpm lint             # Lint JavaScript/TypeScript
```

### Skipping Pre-commit Hooks

```bash
git commit --no-verify -m "your message"
```
