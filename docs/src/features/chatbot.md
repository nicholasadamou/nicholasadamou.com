# AI Chatbot

AI assistant trained on site content using OpenAI Assistant API.

## Overview

- **OpenAI Assistant API** with file search capability
- **Next.js API Route** (`/api/chatbot`) for backend integration
- **React + Framer Motion** for the UI
- **Dynamic import** for code splitting

## Setup

### Extract Site Content

```bash
pnpm run prepare-chatbot-data
```

This creates training data from all blog posts and site information.

### Create OpenAI Assistant

1. Go to [OpenAI Platform](https://platform.openai.com/assistants)
2. Create a new assistant with File Search enabled
3. Upload the training data file

### Configure Environment Variables

```bash
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_ASSISTANT_ID=asst_xxxxx
```

## Components

- `ChatbotWidget` - Main chat interface with suggested questions and note-aware context
- `DynamicChatbot` - Dynamic import wrapper for code splitting

## Features

- Floating chat button
- Smooth animations
- Suggested questions
- Message history
- Dark mode support
- Error handling
- **Note-aware chat** — context-scoped conversations per note

## Note-Aware Chat

When a user is reading a specific note (`/notes/[slug]`), the chatbot automatically scopes to that note:

- **Header** changes to "Note Assistant" with subtitle "Ask about this note"
- **Suggested questions** switch to note-specific prompts (summarize, key takeaways, simplify)
- **Chat history and thread** are stored separately per note in `sessionStorage`, so each note keeps its own conversation and the global chat remains independent
- **API context** — the note slug is sent to `/api/chatbot`, which loads the note content via `getArticleBySlug` and injects it as `additional_instructions` into the OpenAI run (truncated to 12,000 characters if needed)

Navigating away from a note returns the chatbot to its default global mode. Navigating back restores the note-specific conversation from session storage.

### How It Works

1. `BottomNav` detects the active note slug from the URL pathname
2. The slug is passed through `DynamicChatbot` → `ChatbotWidget` as a `noteSlug` prop
3. `ChatbotWidget` derives a context key (`note-{slug}` or `global`) to scope storage and state
4. On send, the slug is included in the POST body to `/api/chatbot`
5. The API route validates the slug, loads the article, and builds `additional_instructions` containing the note's title, summary, and content for the assistant run
