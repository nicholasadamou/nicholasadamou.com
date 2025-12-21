# nicholasadamou.com - v4

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0081C9?style=flat-square&logo=framer&logoColor=white)
![Contentlayer](https://img.shields.io/badge/-Contentlayer-7C3AED?style=flat-square&logo=contentlayer&logoColor=white)

[![Continuous Integration](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/ci.yml)
[![Unit Tests](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/test.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/test.yml)
[![Test Coverage](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/coverage.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/coverage.yml)
[![Shell Script Validation](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/shellcheck.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/shellcheck.yml)

> A modern, clean, and performant personal portfolio website built with Next.js 15, featuring MDX blog posts, dynamic content management, and a beautiful dark mode experience.

Previous iterations: [v1](https://github.com/nicholasadamou/v1), [v2](https://github.com/nicholasadamou/v2), and [v3](https://github.com/nicholasadamou/v3).

## 🌟 Features

- **🚀 Modern Stack**: Built with Next.js 15, TypeScript, and the App Router
- **📝 MDX Blog**: Dynamic article management with Contentlayer and view tracking
- **🎨 Beautiful Design**: Styled with Tailwind CSS and Radix UI primitives
- **✨ Smooth Animations**: Framer Motion for engaging user interactions
- **🌙 Dark Mode**: Seamless theme switching with next-themes
- **📱 Responsive**: Mobile-first design that works on all devices
- **⚡ Performance**: Optimized for Core Web Vitals and SEO
- **🛡️ Type-Safe**: Full TypeScript coverage with strict configuration
- **🔗 API Integrations**: Gumroad products, GitHub repositories, and Unsplash+ images
- **📊 Analytics**: View tracking with Vercel Postgres
- **🎯 Accessibility**: Built with accessibility best practices
- **🖼️ Premium Images**: Support for Unsplash+ premium images with API integration
- **📸 Photography Gallery**: VSCO integration with infinite scroll and local image caching

## 📖 Documentation

For comprehensive developer documentation, visit the **[MkDocs Documentation Site](https://nicholasadamou.github.io/nicholasadamou.com/)**.

The documentation includes:

- Complete installation and setup guides
- Architecture overview and tech stack details
- Feature documentation (image optimization, MDX, gallery, analytics, chatbot, SEO)
- API reference for routes, components, and utilities
- Scripts and build process documentation
- Contributing guidelines and testing guides

To build and serve the docs locally, see [`docs/README.md`](docs/README.md).

## 📋 Quick Start

- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [License](#-license)

## 🛠️ Tech Stack

- **Next.js 15** & **React 19** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** & **Radix UI** for styling
- **Contentlayer** & **MDX** for content management
- **Vercel Postgres** for analytics
- **Framer Motion** for animations

For detailed tech stack information, see the [Architecture documentation](https://nicholasadamou.github.io/nicholasadamou.com/architecture/tech-stack/).

## 📁 Project Structure

The project follows a clean, scalable architecture:

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/       # Reusable UI components (ui, common, mdx, features)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configurations
├── styles/           # Global CSS styles
└── types/            # TypeScript type definitions

content/              # MDX content (notes & projects)
public/               # Static assets
scripts/              # Build and utility scripts
tools/                # Development tools (Playwright downloaders)
docs/                 # MkDocs documentation site
```

For a complete project structure breakdown, see the [Architecture documentation](https://nicholasadamou.github.io/nicholasadamou.com/architecture/structure/).

## 🚀 Getting Started

### Prerequisites

- Node.js v18.17.0 or higher
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nicholasadamou/nicholasadamou.com.git
   cd nicholasadamou.com
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 💻 Development

### Common Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run tests
pnpm lint         # Run linter
pnpm format       # Format code
```

### Adding Content

Create `.mdx` files in `content/notes/` for blog posts or `content/projects/` for projects. See the [MDX Content documentation](https://nicholasadamou.github.io/nicholasadamou.com/features/mdx-content/) for details.

For a complete list of available scripts and development workflows, see the [Development guide](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/development/) and [Scripts documentation](https://nicholasadamou.github.io/nicholasadamou.com/scripts/overview/).

## 🖄️ Database Setup

This project uses Vercel Postgres for tracking blog post views. See the [Analytics documentation](https://nicholasadamou.github.io/nicholasadamou.com/features/analytics/) for database schema and setup instructions.

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure the required variables:

- `POSTGRES_URL` - Vercel Postgres database connection
- `GITHUB_TOKEN` - GitHub API access
- `GUMROAD_ACCESS_TOKEN` - Gumroad product integration
- `UNSPLASH_ACCESS_KEY` - Unsplash image API
- Additional optional variables for VSCO, YouTube, etc.

See the [Environment Variables guide](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/environment/) for complete configuration details.

## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnicholasadamou%2Fnicholasadamou.com)

The easiest way to deploy is using Vercel. Connect your GitHub repository and configure environment variables in the dashboard.

For detailed deployment instructions, see the [Getting Started guide](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/development/).

## 📚 Contributing

Contributions are welcome! Please check out:

- [Contributing Guidelines](CONTRIBUTING.md) - Code of conduct and contribution process
- [Testing Guide](https://nicholasadamou.github.io/nicholasadamou.com/contributing/testing/) - How to write and run tests
- [Code Style Guide](https://nicholasadamou.github.io/nicholasadamou.com/contributing/code-style/) - Coding standards and best practices
- [ACT Setup](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/act-setup/) - Test GitHub Actions locally

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Nicholas Adamou](https://nicholasadamou.com)**

_Previous versions: [v1](https://github.com/nicholasadamou/v1) • [v2](https://github.com/nicholasadamou/v2) • [v3](https://github.com/nicholasadamou/v3)_
