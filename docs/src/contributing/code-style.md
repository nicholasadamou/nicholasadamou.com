# Code Style

## TypeScript

- Use kebab-case for files
- Prefer named exports
- Add JSDoc comments

## React

- Functional components only
- Custom hooks for logic
- Use Tailwind for styling

## Formatting

- 2-space indentation
- Single quotes for strings
- Semicolons required

## Pre-commit Setup

This project uses **Husky** and **lint-staged** to automatically format and lint code before commits.

### What's Included

- **Husky**: Git hooks management
- **lint-staged**: Run linters on staged files only
- **Prettier**: Code formatting
- **ESLint**: Code linting with Prettier integration

### Automatic Formatting

When you run `git commit`, the following happens automatically:

1. **JavaScript/TypeScript files** (`.js`, `.jsx`, `.ts`, `.tsx`):
   - ESLint runs with `--fix` to automatically fix linting issues
   - Prettier formats the code

2. **Other files** (`.json`, `.css`, `.md`, `.mdx`):
   - Prettier formats the code

### Manual Commands

```bash
# Format all files
pnpm format

# Check if files are formatted correctly
pnpm format:check

# Lint and fix JavaScript/TypeScript files
pnpm lint:fix

# Run lint-staged manually
pnpm lint-staged
```

### Prettier Configuration

The project uses these Prettier settings:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Skipping Pre-commit Hooks

If you need to skip pre-commit hooks (not recommended):

```bash
git commit --no-verify -m "your message"
```
