# nicholasadamou.com

[![CI](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholasadamou/nicholasadamou.com/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-1.3-fbf0df?logo=bun)](https://bun.sh)
[![Flox](https://img.shields.io/badge/Environment-Flox-835dff)](https://flox.dev)
[![License](https://img.shields.io/badge/License-PolyForm_Shield_1.0.0-blue)](LICENSE)

My personal website: client work, open-source projects, technical notes, and photography.
Built with the Next.js App Router, React, TypeScript, and Tailwind CSS. Public
content is server-rendered, with canonical metadata, structured data, and Markdown
representations for readers and agents.

## Develop

```sh
flox activate
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:3000>. Flox locks the development tools across macOS and
Linux; Bun locks JavaScript dependencies. Optional integrations use local
credentials described in [environment setup](docs/src/getting-started/environment.md).

## Quality

```sh
bun run check   # all quality gates and tests
bun run build  # production build
```

Husky runs `check` before commits and the build before pushes. CI runs the same checks with coverage. Dependency auditing, ShellCheck, and a
strict documentation build are included locally and in CI.
Successful CI on `main` creates a patch release for the tested commit.

## Documentation

Start with [docs/](docs/README.md) for the visitor guide, client portfolio,
architecture, content editing, SEO, development, and release process.

[Visit the site](https://nicholasadamou.com) · [Client work](https://nicholasadamou.com/clients) · [License](LICENSE)
