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

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Content Management](#-content-management)
- [License](#-license)

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **next-themes** - Theme management

### Content & Data

- **Contentlayer** - Type-safe content SDK
- **MDX** - Markdown with React components
- **Vercel Postgres** - Database for view tracking
- **Reading Time** - Estimated reading time calculation

### Development & Deployment

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel** - Deployment platform

## 📁 Project Structure

This project follows a clean, scalable architecture with organized separation of concerns:

```
nicholasadamou.com/
├── 📂 src/                          # Source code root
│   ├── 📂 app/                      # Next.js App Router
│   │   ├── 📂 about/                # About page & components
│   │   │   ├── 📂 components/       # Page-specific components
│   │   │   ├── 📂 data/            # Static data exports
│   │   │   └── 📂 types/           # Local type definitions
│   │   ├── 📂 api/                 # API routes
│   │   │   ├── 📂 cache/           # Cache management
│   │   │   ├── 📂 commit/          # Git commit info
│   │   │   ├── 📂 emails/          # Contact form handler
│   │   │   ├── 📂 github/          # GitHub API proxy
│   │   │   ├── 📂 gumroad/         # Gumroad API integration
│   │   │   ├── 📂 notes/           # Blog post views tracking
│   │   │   ├── 📂 og/              # Open Graph image generation
│   │   │   ├── 📂 unsplash/        # Unsplash API integration
│   │   │   └── 📂 youtube/         # YouTube API integration
│   │   ├── 📂 contact/             # Contact page
│   │   ├── 📂 notes/               # Blog posts
│   │   │   ├── 📂 components/      # Blog-specific components
│   │   │   ├── 📂 hooks/           # Blog-specific hooks
│   │   │   └── 📂 [slug]/          # Dynamic blog post pages
│   │   ├── 📂 privacy/             # Privacy policy page
│   │   ├── 📂 projects/            # Projects showcase
│   │   │   ├── 📂 components/      # Project-specific components
│   │   │   └── 📂 [slug]/          # Dynamic project pages
│   │   ├── favicon.ico             # Site favicon
│   │   ├── layout.tsx              # Root layout
│   │   ├── not-found.tsx           # 404 page
│   │   └── page.tsx                # Homepage
│   │
│   ├── 📂 __tests__/               # Test files
│   │   ├── 📂 components/          # Component tests
│   │   │   ├── 📂 common/          # Common component tests
│   │   │   └── 📂 ui/              # UI component tests
│   │   ├── 📂 hooks/               # Hook tests
│   │   ├── 📂 lib/                 # Library tests
│   │   │   └── 📂 utils/           # Utility function tests
│   │   ├── setup.ts                # Test setup configuration
│   │   └── ...
│   │
│   ├── 📂 components/              # Reusable component library
│   │   ├── 📂 ui/                  # Base UI components (shadcn-style)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── link.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── tooltip.tsx
│   │   ├── 📂 common/              # Shared business components
│   │   │   ├── Avatar.tsx
│   │   │   ├── CalButton.tsx
│   │   │   ├── CardItem.tsx
│   │   │   ├── ContentHeader.tsx
│   │   │   ├── ContentPage.tsx
│   │   │   ├── FlipNumber.tsx
│   │   │   ├── Footer/
│   │   │   ├── Halo.tsx
│   │   │   ├── Link.tsx
│   │   │   ├── ListPage.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── NavLink.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Parallax.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── RelatedContentList.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   ├── SparkleText.tsx
│   │   │   ├── TabButton.tsx
│   │   │   ├── TabThemeChanger.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── ThemeSwitcher.tsx
│   │   │   └── UniversalImage.tsx
│   │   ├── 📂 mdx/                 # MDX-specific components
│   │   │   ├── Alert.tsx
│   │   │   ├── CustomLink.tsx
│   │   │   ├── GitHub/
│   │   │   ├── HeaderImage.tsx
│   │   │   ├── Image.tsx
│   │   │   ├── ImageFromContent.tsx
│   │   │   ├── Latex.tsx
│   │   │   ├── LinkButton.tsx
│   │   │   ├── LinkPreview.tsx
│   │   │   ├── MdxWrapper.tsx
│   │   │   ├── PlantUML.tsx
│   │   │   ├── ProjectLink.tsx
│   │   │   └── YouTube/
│   │   └── 📂 features/            # Feature-specific components
│   │       ├── 📂 about/           # About page components
│   │       ├── 📂 notes/           # Blog-related components
│   │       └── 📂 projects/        # Project-related components
│   │
│   ├── 📂 hooks/                   # Custom React hooks
│   │   ├── useGumroadProducts.ts   # Gumroad API integration
│   │   ├── useinterval.js          # Interval hook
│   │   ├── useismount.js           # Mount detection hook
│   │   ├── usemounted.ts           # Client-side mounting
│   │   └── usemouseposition.js     # Mouse position tracking
│   │
│   ├── 📂 lib/                     # Utility libraries & config
│   │   ├── 📂 cache/               # Caching utilities
│   │   │   └── unsplash-cache.ts   # Unsplash image caching
│   │   ├── 📂 utils/               # Utility functions
│   │   │   ├── fetcher.js
│   │   │   ├── formatShortDate.tsx
│   │   │   ├── getBaseUrl.ts
│   │   │   ├── getRelativeCoordinates.ts
│   │   │   ├── postFormatting.tsx
│   │   │   ├── unsplash.ts
│   │   │   └── utils.ts
│   │   ├── contentlayer-data.ts    # Contentlayer exports
│   │   ├── image-fallback.ts       # Image fallback handling
│   │   └── image-fallback-server.ts # Server-side image fallback
│   │
│   ├── 📂 styles/                  # Global styles
│   │   ├── base.css                # Base styles
│   │   ├── globals.css             # Main stylesheet
│   │   ├── prose.css               # Typography styles
│   │   ├── syntax.css              # Code highlighting
│   │   └── utilities.css           # Utility classes
│   │
│   └── 📂 types/                   # TypeScript definitions
│       ├── assets.d.ts             # Asset type definitions
│       ├── canvas-confetti.d.ts    # Canvas confetti types
│       ├── global.d.ts             # Global type definitions
│       ├── remark-simple-plantuml.d.ts # PlantUML plugin types
│       └── unified.d.ts            # Unified processor types
│
├── 📂 content/                     # MDX content files
│   ├── 📂 notes/                   # Blog posts in MDX
│   └── 📂 projects/                # Project case studies
│
├── 📂 public/                      # Static assets
│   ├── 📂 gallery/                 # Photo gallery images
│   ├── 📂 images/                  # General images
│   │   └── 📂 unsplash/            # Cached Unsplash images
│   ├── 📂 logos/                   # Brand logos
│   ├── 📂 og/                      # Open Graph images
│   ├── 📂 prism/                   # Prism.js themes
│   ├── 📂 work/                    # Work experience logos
│   ├── avatar.jpeg                 # Profile avatar
│   ├── friendly-avatar.png         # Alternative avatar
│   ├── nicholas-adamou.jpeg        # Author photo
│   ├── photopaper.png              # Background texture
│   ├── robots.txt                  # Search engine directives
│   ├── rss.xml                     # RSS feed
│   ├── sitemap.xml                 # Site map
│   ├── ticketing.woff2             # Custom font
│   └── unsplash-manifest.json      # Unsplash image manifest
│
├── 📂 scripts/                     # Build & utility scripts
│   ├── 📂 unsplash/                # Unsplash-related scripts
│   │   ├── cache-unsplash-images.js
│   │   ├── unsplash-lib.js
│   │   ├── unsplash-url-to-download.js
│   │   └── verify-unsplash-account.js
│   ├── build-cache-images.js       # Image caching for build
│   ├── clean-images.js             # Image cleanup utility
│   ├── download-images.js          # Image download utility
│   ├── generate-rss.mjs            # RSS feed generation
│   ├── generate-sitemap.mjs        # Sitemap generation
│   ├── test-fallback.js            # Fallback testing
│   └── test-integration.js         # Integration testing
│
├── 📂 tools/                       # Development tools
│   └── 📂 playwright-image-downloader/ # Custom image downloader tool
│       ├── 📂 src/                 # Tool source code
│       │   ├── 📂 auth/            # Authentication modules
│       │   ├── 📂 browser/         # Browser automation
│       │   ├── 📂 cli/             # Command-line interface
│       │   ├── 📂 config/          # Configuration management
│       │   ├── 📂 download/        # Download functionality
│       │   ├── 📂 fs/              # File system utilities
│       │   ├── 📂 manifest/        # Manifest handling
│       │   ├── 📂 stats/           # Statistics tracking
│       │   └── 📂 types/           # Type definitions
│       ├── package.json            # Tool dependencies
│       ├── playwright.config.js    # Playwright configuration
│       ├── README.md               # Tool documentation
│       └── tsconfig.json           # TypeScript config
│
├── 📂 docs/                        # Project documentation
│   ├── ACT_SETUP.md                # Local GitHub Actions testing guide
│   ├── PRE_COMMIT_SETUP.md         # Pre-commit hooks guide
│   ├── TESTING.md                  # Testing guide
│   └── UNSPLASH.md                 # Unsplash integration guide
│
├── 📂 coverage/                    # Test coverage reports
│   ├── 📂 app/                     # App coverage
│   ├── 📂 components/              # Component coverage
│   ├── 📂 hooks/                   # Hook coverage
│   ├── 📂 lib/                     # Library coverage
│   ├── coverage-final.json         # Final coverage report
│   └── index.html                  # Coverage HTML report
│
└── 📄 Configuration Files
    ├── .actrc.sample               # ACT configuration sample
    ├── .env.example                # Environment variables template
    ├── .eslintrc.json              # ESLint configuration
    ├── .gitignore                  # Git ignore patterns
    ├── .prettierrc                 # Prettier configuration
    ├── components.json             # shadcn/ui configuration
    ├── contentlayer.config.ts      # Content processing
    ├── next.config.js              # Next.js configuration
    ├── package.json                # Project dependencies
    ├── postcss.config.js           # PostCSS configuration
    ├── prettier.config.js          # Prettier config file
    ├── tailwind.config.js          # Tailwind CSS config
    ├── tsconfig.json               # TypeScript config
    └── vitest.config.ts            # Vitest testing config
```

### 🏗️ Architecture Principles

- **📦 Component Organization**: Components are organized by usage pattern (ui → common → features)
- **🎯 Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **🔄 Reusability**: Shared components and utilities to reduce duplication
- **📱 Route Co-location**: Page-specific components live near their routes
- **🎨 Design System**: Consistent UI components following design system principles
- **🔧 Developer Experience**: Intuitive file organization and TypeScript support

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

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues automatically

# Code Formatting
pnpm format       # Format all files with Prettier
pnpm format:check # Check if files are formatted correctly

# Content Generation
pnpm generate:rss      # Generate RSS feed
pnpm generate:sitemap  # Generate sitemap

# Local GitHub Actions Testing
pnpm act:list       # List all available workflows
pnpm act:ci         # Run CI pipeline locally
pnpm act:test       # Run test workflow locally
pnpm act:coverage   # Run coverage workflow locally
pnpm act:shellcheck # Run shellcheck workflow locally
pnpm act:dryrun     # Preview what would be executed
```

### Adding New Content

#### Blog Posts

1. Create a new `.mdx` file in `content/notes/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Your Post Title"
   summary: "Brief description"
   date: "2024-01-01"
   ---
   ```

#### Projects

1. Create a new `.mdx` file in `content/projects/`
2. Add frontmatter with project details:
   ```yaml
   ---
   title: "Project Name"
   summary: "Brief description"
   date: "2024-01-01"
   url: "https://github.com/username/repo"
   technologies: ["Next.js", "TypeScript"]
   ---
   ```

## 🗄️ Database Setup

This project uses Vercel Postgres for tracking blog post views. Follow the [Vercel Postgres quickstart guide](https://vercel.com/docs/storage/vercel-postgres/quickstart).

### Required Tables

```sql
-- Track total views per post
CREATE TABLE IF NOT EXISTS notes_views (
    slug VARCHAR(255) PRIMARY KEY,
    count INT DEFAULT 0
);

-- Track individual user views (for unique view counting)
CREATE TABLE user_views (
    user_id     VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL,
    last_viewed TIMESTAMP    NOT NULL,
    PRIMARY KEY (user_id, slug)
);
```

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database (Vercel Postgres)
POSTGRES_URL="postgres://..."

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="..."

# Email (for contact form)
FORMCARRY_URL=https://formcarry.com/s/...

# External APIs (optional)
GITHUB_TOKEN="..."
GUMROAD_ACCESS_TOKEN="..."
YOUTUBE_API_KEY="..."
UNSPLASH_ACCESS_KEY="..."
UNSPLASH_SECRET_KEY="..."
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnicholasadamou%2Fnicholasadamou.com)

1. Connect your GitHub repository to Vercel
2. Add your environment variables in Vercel dashboard
3. Deploy automatically on each push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📚 Content Management

### Writing Blog Posts

- Use MDX for rich content with React components
- Add custom components in `src/components/mdx/`
- Include code blocks with syntax highlighting
- Embed images, videos, and interactive elements

### Managing Projects

- Showcase projects with detailed case studies
- Include live demos and GitHub links
- Add technology tags and descriptions
- Feature images and project galleries

### Testing GitHub Workflows Locally

This project includes comprehensive GitHub Actions workflows for CI/CD. You can test these workflows locally using ACT before pushing changes:

- **Setup Guide**: See [`docs/ACT_SETUP.md`](docs/ACT_SETUP.md) for complete installation and configuration instructions
- **Quick Start**: Install ACT with `brew install act` and run `pnpm act:ci` to test the full CI pipeline
- **Available Commands**: Use `pnpm act:list` to see all available workflows and jobs

### Code Style

- Use TypeScript for all new code
- Follow the existing component patterns
- **Pre-commit hooks** automatically format and lint code (see [`docs/PRE_COMMIT_SETUP.md`](docs/PRE_COMMIT_SETUP.md))
- **Test workflows locally** with ACT before pushing (see [`docs/ACT_SETUP.md`](docs/ACT_SETUP.md))
- Run `pnpm lint` and `pnpm format` manually when needed
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Nicholas Adamou](https://nicholasadamou.com)**

_Previous versions: [v1](https://github.com/nicholasadamou/v1) • [v2](https://github.com/nicholasadamou/v2) • [v3](https://github.com/nicholasadamou/v3)_
