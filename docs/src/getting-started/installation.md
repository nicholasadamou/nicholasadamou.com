# Installation

This guide will help you set up the project locally for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Git**

## Clone the Repository

```bash
git clone https://github.com/nicholasadamou/nicholasadamou.com.git
cd nicholasadamou.com
```

## Install Dependencies

```bash
pnpm install
```

## Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your environment variables:

```env
# Unsplash (optional)
UNSPLASH_ACCESS_KEY=your_access_key
UNSPLASH_SECRET_KEY=your_secret_key

# VSCO (optional)
VSCO_EMAIL=your_email
VSCO_PASSWORD=your_password

# Database (optional)
POSTGRES_URL=your_postgres_url

# Redis (optional)
REDIS_URL=your_redis_url
```

## Initialize Submodules

```bash
git submodule update --init --recursive
```

## Build Image Cache (Optional)

```bash
pnpm run build:cache-images
```

## Start Development Server

```bash
pnpm dev
```

The site will be available at [http://localhost:3000](http://localhost:3000)

## Verification

To verify your installation:

1. Open [http://localhost:3000](http://localhost:3000)
2. Check that the page loads without errors
3. Navigate through different sections
4. Test dark mode toggle

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically use the next available port (e.g., 3001, 3005).

### Submodule Issues

If you encounter submodule errors:

```bash
git submodule update --init --recursive --remote
```

### Build Errors

Clear the build cache:

```bash
rm -rf .next
pnpm install
pnpm dev
```

## Next Steps

- [Development Workflow →](development.md)
- [Environment Variables →](environment.md)
- [Project Structure →](../architecture/structure.md)
