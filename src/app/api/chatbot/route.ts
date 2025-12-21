import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.OPENAI_ASSISTANT_ID;

// Simple in-memory cache for thread IDs (in production, use Redis or database)
const threadCache = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message as string;
    const clientThreadId = body.threadId as string | undefined;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!assistantId) {
      return NextResponse.json(
        { error: "Assistant not configured" },
        { status: 500 }
      );
    }

    // Get or create thread
    let threadId: string;
    if (clientThreadId && threadCache.has(clientThreadId)) {
      threadId = clientThreadId;
    } else {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      threadCache.set(threadId, threadId);
    }

    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // Run the assistant and poll for completion
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    });

    console.log("Run completed:", {
      threadId,
      runId: run.id,
      status: run.status,
    });

    if (run.status === "failed") {
      return NextResponse.json(
        { error: "Assistant failed to respond" },
        { status: 500 }
      );
    }

    if (run.status !== "completed") {
      return NextResponse.json(
        { error: "Request timeout or cancelled" },
        { status: 408 }
      );
    }
    // Get the assistant's response
    const messagesResponse = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messagesResponse.data.find(
      (msg) => msg.role === "assistant"
    );

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from assistant" },
        { status: 500 }
      );
    }

    // Extract text content
    const textContent = assistantMessage.content.find(
      (content) => content.type === "text"
    );

    let responseText = "I apologize, but I couldn't generate a response.";

    if (textContent && textContent.type === "text") {
      responseText = textContent.text.value;

      // Remove OpenAI annotations/citations like 【4:0†source】
      if (
        textContent.text.annotations &&
        textContent.text.annotations.length > 0
      ) {
        textContent.text.annotations.forEach((annotation) => {
          responseText = responseText.replace(annotation.text, "");
        });
      }
    }

    return NextResponse.json({
      response: responseText,
      threadId,
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
