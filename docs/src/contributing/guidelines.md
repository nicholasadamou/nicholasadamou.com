# Contributing Guidelines

Thank you for your interest in contributing to nicholasadamou.com!

## Getting Started

### 1. Fork and Clone

```bash
git clone --recursive https://github.com/YOUR_USERNAME/nicholasadamou.com.git
cd nicholasadamou.com
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment

```bash
cp .env.example .env.local
```

### 4. Create a Branch

```bash
git checkout -b feature/add-dark-mode
git checkout -b fix/navigation-bug
```

## Development Workflow

```bash
bun run dev       # Start dev server
bun run test      # Run tests
bun run lint      # Run linting
bun run build     # Build check
```

## Pull Request Process

### Before Submitting

- Code follows project style guidelines
- Tests pass locally (`bun run test:run`)
- Build succeeds (`bun run build`)
- Documentation is updated if needed

### Commit Messages

Follow conventional commits:

```text
feat: add dark mode toggle
fix: resolve navigation bug on mobile
docs: update installation guide
test: add tests for theme hook
```

## Types of Contributions

- **Bug Fixes** - Check existing issues, add reproduction test
- **New Features** - Open issue to discuss first
- **Documentation** - Located in `docs/src/`
- **Tests** - Located in `src/__tests__/`
