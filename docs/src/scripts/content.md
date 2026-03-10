# Content Scripts

Scripts for processing site content.

## prepare-chatbot.js

Extracts and prepares site content for AI chatbot training.

**Usage**:

```bash
pnpm run prepare-chatbot-data
```

**Output**: Training data in `scripts/training-data/`

**What it includes**:

- All blog posts from `content/notes/`
- Site structure and navigation
- Contact information
- Technical stack details

**Re-training**: Run whenever you publish new blog posts or update site content, then upload to your OpenAI Assistant dashboard.
