# Contributing Guidelines

Thank you for your interest in contributing to nicholasadamou.com! This guide will help you get started.

## Code of Conduct

Be respectful, constructive, and professional in all interactions. We're here to build great software together.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone --recursive https://github.com/YOUR_USERNAME/nicholasadamou.com.git
cd nicholasadamou.com
```

**Important**: Use `--recursive` to initialize submodules (Playwright downloaders).

### 2. Install Dependencies

```bash
# Install pnpm if needed
npm install -g pnpm

# Install project dependencies
pnpm install
```

This will:

- Install all npm packages
- Run setup scripts (submodule checks)
- Configure git hooks (Husky)

### 3. Set Up Environment

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Required for full functionality:

- `UNSPLASH_ACCESS_KEY` - For image features
- `OPENAI_API_KEY` - For chatbot (optional)
- See [Environment Variables](../getting-started/environment.md) for full list

### 4. Create a Branch

```bash
# Create a descriptive branch name
git checkout -b feature/add-dark-mode
git checkout -b fix/navigation-bug
git checkout -b docs/update-readme
```

**Branch naming conventions**:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/fixes

## Development Workflow

### Running Locally

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Making Changes

**1. Write your code**

- Follow existing patterns and conventions
- Keep changes focused and atomic
- Write clear, descriptive comments

**2. Test your changes**

```bash
# Run tests
pnpm test

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

**3. Add tests** for new features

- Unit tests in `src/__tests__/`
- Follow existing test patterns
- Aim for >80% coverage

**4. Update documentation**

- Update relevant docs in `docs/src/`
- Add JSDoc comments for functions
- Update README if needed

### Code Quality

Pre-commit hooks will automatically:

- Format code with Prettier
- Lint with ESLint
- Run type checking
- Run tests on changed files

Manual checks:

```bash
# Format all files
pnpm format

# Lint and fix
pnpm lint:fix

# Full test suite
pnpm test:run

# Build check
pnpm build
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main

### Commit Messages

Follow conventional commits:

```bash
feat: add dark mode toggle
fix: resolve navigation bug on mobile
docs: update installation guide
refactor: simplify image loading logic
test: add tests for theme hook
```

**Format**: `type: description`

**Types**:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding missing tests
- `chore` - Maintain, tooling, dependencies

### Creating the Pull Request

1. **Push your branch**

   ```bash
   git push origin feature/your-feature
   ```

2. **Open PR on GitHub**
   - Provide a clear title and description
   - Link related issues (`Fixes #123`)
   - Add screenshots for UI changes
   - Request review from maintainers

3. **PR Template**:

   ```text
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests

   ## Screenshots (if applicable)

   ## Related Issues
   Fixes #123
   ```

### Review Process

**1. Automated checks must pass:**

- CI/CD build
- Test suite
- Linting
- Type checking

**2. Code review by maintainers:**

- Code quality and style
- Test coverage
- Documentation completeness
- Performance considerations

**3. Address feedback:**

- Make requested changes
- Push updates to same branch
- Respond to comments

**4. Approval and merge:**

- Requires 1 maintainer approval
- Squash and merge preferred
- Delete branch after merge

## Types of Contributions

### Bug Fixes

1. Check if issue already exists
2. Create issue if not (include reproduction steps)
3. Fork and fix
4. Add test that verifies the fix
5. Submit PR

### New Features

1. Open an issue to discuss the feature first
2. Get feedback from maintainers
3. Implement once approved
4. Add comprehensive tests
5. Update documentation
6. Submit PR

### Documentation

- Fix typos, improve clarity
- Add examples and use cases
- Update for new features
- Located in `docs/src/`

### Tests

- Improve test coverage
- Add missing test cases
- Fix flaky tests
- Located in `src/__tests__/`

## Project Structure

Key directories for contributors:

```
src/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   └── (pages)/     # Page components
├── components/       # React components
│   ├── common/      # Shared components
│   ├── features/    # Feature-specific
│   └── ui/          # UI primitives
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
└── __tests__/       # Test files

docs/                # Documentation
├── src/             # Markdown files
└── mkdocs.yml       # Docs configuration

scripts/             # Build and setup scripts
content/             # MDX blog posts and projects
```

## Getting Help

### Resources

- [Architecture Overview](../architecture/overview.md)
- [Development Guide](../getting-started/development.md)
- [Testing Guide](testing.md)
- [Code Style Guide](code-style.md)

### Questions?

- Check existing issues and discussions
- Open a new discussion for questions
- Tag maintainers if urgent

## Recognition

Contributors are recognized in:

- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments (major features)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

Thank you for contributing! 🚀
