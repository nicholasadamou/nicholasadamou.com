# Documentation

Developer documentation for nicholasadamou.com built with MkDocs Material.

## Setup

### Install MkDocs

Using a virtual environment (recommended):

```bash
# Create virtual environment
python3 -m venv venv

# Activate it (bash/zsh)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Or install globally:

```bash
pip install -r requirements.txt
```

### Local Development

```bash
# Serve docs locally (standard way)
mkdocs serve

# Open http://127.0.0.1:8000
```

#### Auto Port Selection

If port 8000 is already in use, use the provided scripts that automatically find an available port:

**For Bash/Zsh:**

```bash
./serve.sh
```

**For Fish shell:**

```fish
./serve.fish
```

These scripts will:

- Try ports 8000, 8001, 8002, 8003, 8004, 8005, 8080, 8888 in order
- If all are taken, scan ports 8000-9000 for an available one
- Display the URL with the selected port
- Pass any additional arguments to `mkdocs serve` (e.g., `./serve.sh --dirty`)

### Build

```bash
# Build static site
mkdocs build

# Output in docs/build/
```

## Structure

- `src/` - Markdown documentation source files
- `build/` - Generated static site (gitignored)
- `mkdocs.yml` - Configuration (in project root)

## Writing Docs

### Creating New Pages

1. Create a new `.md` file in `docs/src/`
2. Add it to the nav in `mkdocs.yml`
3. Link from other pages

### Markdown Extensions

Supported features:

- Admonitions (`!!! note`)
- Code blocks with syntax highlighting
- Tabs (`=== "Tab 1"`)
- Mermaid diagrams
- Math (KaTeX)
- Task lists
- And more!

### Example Admonition

```markdown
!!! tip "Pro Tip"
This is a tip admonition.
```

### Example Code Block

```markdown
\`\`\`typescript
const greeting = "Hello, World!";
\`\`\`
```

## Deployment

The docs can be deployed to GitHub Pages:

```bash
mkdocs gh-deploy
```

Or build and deploy the `docs/build/` directory to any static host.

## Links

- [MkDocs](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Writing your docs](https://www.mkdocs.org/user-guide/writing-your-docs/)
# 
