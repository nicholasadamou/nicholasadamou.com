# Contributing to nicholasadamou.com

Thank you for your interest in contributing to this project! This guide will help you get started with contributing to the codebase.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js v18.17.0 or higher
- pnpm (recommended) or npm
- Git
- A GitHub account

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nicholasadamou.com.git
   cd nicholasadamou.com
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
5. **Start the development server**:
   ```bash
   pnpm dev
   ```

## 📂 Understanding the Project Structure

Please familiarize yourself with our organized folder structure:

```
src/
├── app/           # Next.js App Router (pages & API routes)
├── components/    # Reusable component library
│   ├── ui/        # Base UI components
│   ├── common/    # Shared business components
│   ├── mdx/       # MDX-specific components
│   └── features/  # Feature-specific components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── styles/        # Global styles
└── types/         # TypeScript definitions
```

### Component Organization Guidelines

- **ui/**: Base, reusable UI components (buttons, cards, inputs)
- **common/**: Business logic components used across multiple pages
- **features/**: Domain-specific components organized by feature area
- **mdx/**: Components specifically for MDX content rendering

## 🛠️ Development Guidelines

### Code Style

We use ESLint and Prettier to maintain consistent code style. Please ensure your code passes all checks:

```bash
# Check linting
pnpm lint

# Auto-fix linting issues
pnpm lint --fix
```

### TypeScript

- All new code should be written in TypeScript
- Use strict type checking
- Add proper type definitions for new interfaces
- Avoid `any` types when possible

### Component Guidelines

1. **Functional Components**: Use functional components with hooks
2. **Props Interface**: Define proper TypeScript interfaces for props
3. **Default Props**: Use default parameter values instead of defaultProps
4. **Component Structure**:

   ```typescript
   interface ComponentProps {
     // Define props here
   }

   export default function Component({ prop1, prop2 }: ComponentProps) {
     // Component logic here

     return (
       // JSX here
     );
   }
   ```

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow mobile-first responsive design
- Use semantic HTML elements
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test with dark/light mode themes

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase starting with "use" (`useMyHook.ts`)
- **Utilities**: camelCase (`myUtilFunction.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`MY_CONSTANT`)
- **Files**: kebab-case for non-components (`my-utility.ts`)

## 📝 Content Guidelines

### Adding Blog Posts

1. Create a new `.mdx` file in `content/notes/`
2. Use the required frontmatter format:
   ```yaml
   ---
   title: "Your Post Title"
   summary: "Brief description of the post"
   date: "2024-01-01"
   pinned: false # optional
   image_author: "Author Name" # optional
   image_author_url: "https://..." # optional
   image_url: "https://..." # optional
   ---
   ```
3. Write content using MDX syntax
4. Test locally before submitting

### Adding Projects

1. Create a new `.mdx` file in `content/projects/`
2. Use the required frontmatter format:
   ```yaml
   ---
   title: "Project Name"
   summary: "Brief description"
   longSummary: "Detailed description" # optional
   date: "2024-01-01"
   url: "https://github.com/username/repo" # optional
   demoUrl: "https://demo.com" # optional
   technologies: ["Next.js", "TypeScript"] # optional
   pinned: false # optional
   ---
   ```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Browser, OS, Node.js version
6. **Screenshots**: If applicable

Use our bug report template when creating issues.

## 💡 Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** in detail
3. **Explain the use case** and why it would be beneficial
4. **Provide examples** or mockups if applicable

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run the linter**: `pnpm lint`
3. **Build the project**: `pnpm build`
4. **Check for TypeScript errors**
5. **Test in both light and dark modes**
6. **Ensure responsive design works**

### Pull Request Guidelines

1. **Create a feature branch** from main:

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** following the guidelines above

3. **Commit your changes** with clear, semantic commit messages:

   ```bash
   git commit -m "feat: add amazing new feature"
   git commit -m "fix: resolve navigation bug"
   git commit -m "docs: update README"
   ```

4. **Push to your fork**:

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create a Pull Request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - List of changes made

### Commit Message Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

## 🧪 Testing

While we don't have automated tests yet, please manually test:

- **All pages render correctly**
- **Navigation works properly**
- **Forms submit successfully**
- **Dark/light mode toggle**
- **Responsive design**
- **MDX content renders properly**

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤔 Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Reach out via [contact form](https://nicholasadamou.com/contact)

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
