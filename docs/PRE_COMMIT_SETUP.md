# Pre-commit Setup

This project uses **Husky** and **lint-staged** to automatically format and lint code before commits.

## What's Included

- **Husky**: Git hooks management
- **lint-staged**: Run linters on staged files only
- **Prettier**: Code formatting
- **ESLint**: Code linting with Prettier integration

## Automatic Formatting

When you run `git commit`, the following happens automatically:

1. **JavaScript/TypeScript files** (`.js`, `.jsx`, `.ts`, `.tsx`):
   - ESLint runs with `--fix` to automatically fix linting issues
   - Prettier formats the code

2. **Other files** (`.json`, `.css`, `.md`, `.mdx`):
   - Prettier formats the code

## Manual Commands

You can also run these commands manually:

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

## Configuration Files

- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore when formatting
- `.eslintrc.json` - ESLint configuration with Prettier integration
- `.husky/pre-commit` - Pre-commit hook script
- `package.json` - lint-staged configuration

## Prettier Configuration

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

## Troubleshooting

If pre-commit hooks fail:

1. Review the error message
2. Fix the issues manually
3. Stage the files again: `git add .`
4. Commit again: `git commit -m "your message"`

If you need to skip pre-commit hooks (not recommended):

```bash
git commit --no-verify -m "your message"
```
