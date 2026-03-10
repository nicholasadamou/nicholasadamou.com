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

- `ChatbotWidget` - Main chat interface with suggested questions
- `DynamicChatbot` - Dynamic import wrapper for code splitting

## Features

- Floating chat button
- Smooth animations
- Suggested questions
- Message history
- Dark mode support
- Error handling
