# nicholasadamou.com - v5

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0081C9?style=flat-square&logo=framer&logoColor=white)
![MDX](https://img.shields.io/badge/-MDX-FCB32C?style=flat-square&logo=mdx&logoColor=black)

[![Continuous Integration](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/ci.yml)
[![Unit Tests](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/test.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/test.yml)
[![Test Coverage](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/coverage.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/coverage.yml)
[![Shell Script Validation](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/shellcheck.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/shellcheck.yml)

> A modern clean, and performant personal portfolio website built with Next.js 16, featuring MDX blog posts, AI chatbot, VSCO gallery integration, and a custom luminance-based theme system.

Previous iterations: [v1](https://github.com/nicholasadamou/v1), [v2](https://github.com/nicholasadamou/v2), [v3](https://github.com/nicholasadamou/v3), and [v4](https://github.com/nicholasadamou/v4).

## 🌟 Features

- **🚀 Modern Stack**: Built with Next.js 16, React 19, TypeScript, and the App Router
- **📝 MDX Blog**: Dynamic article management with gray-matter, reading-time, and view tracking
- **🎨 Custom Theming**: Luminance-based theme system supporting light, dark, and custom color modes
- **✨ Smooth Animations**: Framer Motion for engaging user interactions
- **📱 Responsive**: Mobile-first design that works on all devices
- **⚡ Performance**: Optimized for Core Web Vitals and SEO
- **🛡️ Type-Safe**: Full TypeScript coverage with strict configuration
- **🤖 AI Chatbot**: OpenAI Assistant-powered chatbot trained on site content
- **📸 Photography Gallery**: VSCO gallery with infinite scroll, powered by local data export
- **🔗 API Integrations**: Gumroad products, GitHub repositories, and Unsplash images
- **📊 Analytics**: View tracking with Vercel Postgres
- **🖼️ OG Images**: Dynamic Open Graph image generation with customizable layouts
- **🔍 Search**: Full-text content search across blog posts
- **⌨️ Command Palette**: Keyboard shortcut navigation

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

## 🛠️ Tech Stack

- **Next.js 16** & **React 19** with App Router
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **gray-matter** & **MDX** for content management
- **Vercel Postgres** for analytics
- **Framer Motion** for animations
- **OpenAI Assistant API** for AI chatbot

For detailed tech stack information, see the [Architecture documentation](https://nicholasadamou.github.io/nicholasadamou.com/architecture/tech-stack/).

## 📁 Project Structure

The project follows a clean, scalable architecture:

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/       # UI components by domain (chat, gallery, home, layout, mdx, notes, projects, ui)
├── hooks/            # Custom React hooks
└── lib/              # Utilities by feature (animation, content, image, projects)

content/              # MDX content (notes)
data/                 # Static data files (VSCO export)
public/               # Static assets
scripts/              # Build and utility scripts
docs/                 # MkDocs documentation site
```

For a complete project structure breakdown, see the [Architecture documentation](https://nicholasadamou.github.io/nicholasadamou.com/architecture/structure/).

## 🚀 Getting Started

### Prerequisites

- Node.js v18.17.0 or higher
- pnpm (recommended)
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
pnpm dev                       # Start development server
pnpm build                     # Build for production
pnpm test                      # Run tests (watch mode)
pnpm test:run                  # Run tests once
pnpm test:coverage             # Generate coverage report
pnpm lint                      # Run linter
pnpm format                    # Format code
pnpm download:images:unsplash  # Download Unsplash images
pnpm prepare-chatbot-data      # Prepare AI chatbot training data
```

### Adding Content

Create `.mdx` files in `content/notes/` for blog posts. See the [MDX Content documentation](https://nicholasadamou.github.io/nicholasadamou.com/features/mdx-content/) for details.

For a complete list of available scripts and development workflows, see the [Development guide](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/development/) and [Scripts documentation](https://nicholasadamou.github.io/nicholasadamou.com/scripts/overview/).

## 🗄️ Database Setup

This project uses Vercel Postgres for tracking blog post views. See the [Analytics documentation](https://nicholasadamou.github.io/nicholasadamou.com/features/analytics/) for setup instructions.

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure the required variables:

- `POSTGRES_URL` - Vercel Postgres database connection
- `GITHUB_TOKEN` - GitHub API access
- `GUMROAD_API_KEY` - Gumroad product integration
- `UNSPLASH_ACCESS_KEY` - Unsplash image API
- `OPENAI_API_KEY` / `OPENAI_ASSISTANT_ID` - AI chatbot
- Additional optional variables for email, etc.

See the [Environment Variables guide](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/environment/) for complete configuration details.

## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnicholasadamou%2Fnicholasadamou.com)

The easiest way to deploy is using Vercel. Connect your GitHub repository and configure environment variables in the dashboard.

For detailed deployment instructions, see the [Getting Started guide](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/development/).

## 📚 Contributing

Contributions are welcome! Please check out:

- [Testing Guide](https://nicholasadamou.github.io/nicholasadamou.com/contributing/testing/) - How to write and run tests
- [Code Style Guide](https://nicholasadamou.github.io/nicholasadamou.com/contributing/code-style/) - Coding standards and best practices
- [Contributing Guidelines](https://nicholasadamou.github.io/nicholasadamou.com/contributing/guidelines/) - Contribution process
- [ACT Setup](https://nicholasadamou.github.io/nicholasadamou.com/getting-started/act-setup/) - Test GitHub Actions locally

---

**Built with ❤️ by [Nicholas Adamou](https://nicholasadamou.com)**

_Previous versions: [v1](https://github.com/nicholasadamou/v1) • [v2](https://github.com/nicholasadamou/v2) • [v3](https://github.com/nicholasadamou/v3) • [v4](https://github.com/nicholasadamou/v4)_
