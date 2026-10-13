# Installation

Install [Flox](https://flox.dev/docs/install-flox/), then clone the repository:

```sh
git clone https://github.com/nicholasadamou/nicholasadamou.com.git
cd nicholasadamou.com
flox activate
bun install --frozen-lockfile
bun run dev
```

Visit <http://localhost:3000>. Flox provides the locked Node, Bun, Python,
pre-commit, and ShellCheck toolchain. `bun install` activates Husky hooks.

Public portfolio content works without credentials. See
[environment variables](environment.md) for optional chat, contact, music,
and database integrations. Never commit credentials or local environment files.

Run `bun run check` before committing and `bun run build` before pushing.
See [quality and releases](../contributing/quality-and-releases.md) for CI details.
