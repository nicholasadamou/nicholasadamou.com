# AI Chatbot

AI assistant trained on site content using OpenAI Assistant API.

## Overview

- **OpenAI Assistant API** with file search capability
- **Next.js API Routes** for backend integration
- **React + Framer Motion** for the UI
- **Session Storage** for chat history persistence

## Setup

### Extract Site Content

```bash
node scripts/prepare-chatbot-content.js
```

This creates `chatbot-training-data.txt` containing all blog posts, projects, and site information.

### Create OpenAI Assistant

1. Go to [OpenAI Platform](https://platform.openai.com/assistants)
2. Click "Create" to make a new assistant
3. Configure:
   - **Name**: "Website Assistant"
   - **Model**: `gpt-4-turbo-preview` or `gpt-4o`
   - **Enable "File Search"**
   - Upload the `chatbot-training-data.txt` file

### Configure Environment Variables

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Features

- Floating chat button
- Smooth animations
- Suggested questions
- Message history persistence
- Dark mode support
- Error handling

## Customization

### Update Suggested Questions

Edit `src/components/common/Chatbot/ChatbotWidget.tsx`:

```typescript
const SUGGESTED_QUESTIONS = [
  "Your custom question 1",
  "Your custom question 2",
];
```

### Re-train with Updated Content

```bash
node scripts/prepare-chatbot-content.js
```

Then upload the new training file to your OpenAI Assistant dashboard.

## Cost Considerations

- **Assistant API**: Charged per token used
- **File Search**: Additional cost for vector store usage
- Typical costs: $5-20/month for small portfolio sites

For detailed setup instructions, see the original CHATBOT_SETUP.md file.
