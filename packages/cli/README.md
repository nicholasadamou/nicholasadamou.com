# nicholasadamou CLI

Official command-line client for [Nicholas Adamou developer resources](https://nicholasadamou.com/developers).

```bash
npx nicholasadamou search nextjs
npx nicholasadamou notes --json
npx nicholasadamou note <slug>
npx nicholasadamou projects
npx nicholasadamou docs
```

Talks to the public read-only `/api/v1` API on https://nicholasadamou.com. Errors are RFC 9457 problem details; pass `--json` to print structured responses and errors.
