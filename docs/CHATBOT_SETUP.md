# AI Chatbot Setup Guide

This guide will walk you through setting up the AI chatbot assistant for the website.

## Overview

The chatbot is built using:

- **OpenAI Assistant API** with file search capability
- **Next.js API Routes** for backend integration
- **React + Framer Motion** for the UI
- **Session Storage** for chat history persistence

## Prerequisites

- An OpenAI account with API access
- OpenAI API key with sufficient credits
- Access to the OpenAI Platform dashboard

## Step 1: Extract Site Content

First, generate the training data file containing all site content:

```bash
node scripts/prepare-chatbot-content.js
```

This will create a `chatbot-training-data.txt` file in the project root containing:

- All blog posts from `content/notes/`
- All projects from `content/projects/`
- Site structure and contact information
- Technical stack details

The script will output the file size and location when complete.

## Step 2: Create an OpenAI Assistant

1. Go to the [OpenAI Platform](https://platform.openai.com/assistants)
2. Click "Create" to make a new assistant
3. Configure the assistant:

### Basic Settings

- **Name**: "Nicholas Adamou Website Assistant" (or your preference)
- **Model**: Select `gpt-4-turbo-preview` or `gpt-4o` (recommended for best performance)
- **Description**: "AI assistant trained on nicholasadamou.com content"

### Instructions (System Prompt)

```
You are a helpful AI assistant trained on the content from Nicholas Adamou's portfolio website (nicholasadamou.com). Your role is to help visitors learn about Nicholas, his projects, blog posts, skills, and experience.

Key guidelines:
- Answer questions about Nicholas's projects, blog posts, skills, and professional background
- Provide accurate information based on the training data
- Be friendly, professional, and concise
- If you don't know something, admit it rather than making up information
- Encourage users to visit specific pages or contact Nicholas directly when appropriate
- When discussing projects, mention relevant technologies and provide context
- For technical questions about blog posts, reference the specific post if available

Always maintain a helpful and engaging tone while representing Nicholas's professional brand.
```

### Capabilities

- **Enable "File Search"** - This is critical for the assistant to search through the uploaded content
- Optionally enable "Code Interpreter" if you want the assistant to help with code examples

### Files

1. Click "Add Files" or use the file upload section
2. Upload the `chatbot-training-data.txt` file you generated
3. Wait for the file to be processed (this may take a minute)
4. Ensure "File Search" is enabled for this file

### Temperature

- Set to `0.7` for a good balance of creativity and consistency
- Lower (0.3-0.5) for more deterministic responses
- Higher (0.8-1.0) for more creative responses

4. Click "Save" to create the assistant
5. **Copy the Assistant ID** - it will look like `asst_xxxxxxxxxxxxxxxxxxxxx`

## Step 3: Configure Environment Variables

Add the following to your `.env` file:

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: Never commit your `.env` file to version control!

### Where to find your API key:

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key immediately (you won't be able to see it again)

## Step 4: Test the Chatbot

1. Start the development server:

```bash
pnpm dev
```

2. Open your browser to `http://localhost:3000`

3. You should see a floating chat button in the bottom-right corner

4. Click the button to open the chat interface

5. Try asking questions like:
   - "What projects has Nicholas worked on?"
   - "Tell me about the latest blog post"
   - "What technologies does Nicholas use?"
   - "How can I contact Nicholas?"

## Features

### Chat UI

- **Floating Button**: Always visible in the bottom-right corner
- **Chat Window**: Opens above the button with smooth animations
- **Suggested Questions**: Displayed when chat is empty
- **Message History**: Persisted in session storage
- **Loading States**: Shows "Thinking..." while waiting for response
- **Clear Chat**: Button to reset the conversation
- **Dark Mode Support**: Automatically adapts to site theme

### API Integration

- **Thread Management**: Maintains conversation context across messages
- **Error Handling**: Graceful fallbacks for API failures
- **Timeout Protection**: 30-second maximum wait time
- **Rate Limiting**: Consider adding rate limiting for production

## Customization

### Modify Suggested Questions

Edit `src/components/common/Chatbot/ChatbotWidget.tsx`:

```typescript
const SUGGESTED_QUESTIONS = [
  "Your custom question 1",
  "Your custom question 2",
  "Your custom question 3",
  "Your custom question 4",
];
```

### Update System Instructions

Go to your OpenAI Assistant in the dashboard and modify the instructions to change the assistant's behavior and personality.

### Re-train with Updated Content

When you add new blog posts or projects:

1. Run the extraction script again:

```bash
node scripts/prepare-chatbot-content.js
```

2. Go to your OpenAI Assistant dashboard
3. Remove the old training file
4. Upload the new `chatbot-training-data.txt` file
5. The assistant will automatically use the updated content

## Troubleshooting

### "Assistant not configured" error

- Verify `OPENAI_ASSISTANT_ID` is set in `.env`
- Restart your dev server after adding environment variables

### "No response from assistant" error

- Check that File Search is enabled in the assistant settings
- Verify the training file was successfully uploaded
- Check your OpenAI API usage limits

### Slow responses

- OpenAI Assistant API can take 3-10 seconds per response
- This is normal for the file search capability
- Consider showing a loading indicator (already implemented)

### API rate limits

- OpenAI has rate limits based on your account tier
- Consider implementing rate limiting on your API route
- Monitor usage in the OpenAI dashboard

## Cost Considerations

- **Assistant API**: Charged per token used
- **File Search**: Additional cost for vector store usage
- **Monitoring**: Check your OpenAI usage dashboard regularly

Typical costs for a small portfolio site: $5-20/month depending on traffic.

## Production Deployment

Before deploying to production:

1. ✅ Add environment variables to your hosting platform (Vercel, etc.)
2. ✅ Test the chatbot thoroughly
3. ✅ Consider adding rate limiting to the API route
4. ✅ Monitor OpenAI usage and costs
5. ✅ Add error tracking (Sentry, LogRocket, etc.)
6. ⚠️ Consider implementing a fallback for when OpenAI is down

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `OPENAI_API_KEY` and `OPENAI_ASSISTANT_ID`
4. Redeploy your project

## Future Enhancements

Potential improvements to consider:

- Add rate limiting per IP address
- Implement user feedback (thumbs up/down)
- Add conversation analytics
- Support for voice input/output
- Multi-language support
- Integration with site search
- Conversation export functionality

## Support

For issues or questions:

- Check the OpenAI [Assistant API documentation](https://platform.openai.com/docs/assistants/overview)
- Review the [OpenAI Community Forum](https://community.openai.com/)
- File an issue in the project repository

## Security Notes

- Never expose your OpenAI API key in client-side code
- All API calls go through your Next.js API route
- Consider implementing authentication for production use
- Monitor for unusual usage patterns
- Set spending limits in your OpenAI account

---

**Last Updated**: December 2024
