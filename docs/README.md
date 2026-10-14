# Documentation

- [Visitor guide](src/using-the-site/overview.md)
- [Brand resources](src/using-the-site/brand.md)
- [Client portfolio](src/using-the-site/client-work.md)
- [Installation](src/getting-started/installation.md)
- [Environment variables](src/getting-started/environment.md)
- [Architecture](src/architecture/overview.md)
- [SEO and agent access](src/features/seo.md)
- [Quality and releases](src/contributing/quality-and-releases.md)

## Preview

```sh
flox activate
python -m venv docs/venv
docs/venv/bin/pip install -r docs/requirements.txt
docs/venv/bin/mkdocs serve -f docs/mkdocs.yml
```

Run `docs/venv/bin/mkdocs build --strict -f docs/mkdocs.yml` to validate the
published documentation. Mermaid diagrams are parsed separately by
`bun run lint:mermaid` and rendered by the Material theme.
