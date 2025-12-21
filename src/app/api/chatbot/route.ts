import { NextRequest } from "next/server";
import OpenAI from "openai";
import { logger } from "@/lib/logger";

// Simple in-memory cache for thread IDs (in production, use Redis or database)
const threadCache = new Map<string, string>();

// Lazy-initialize OpenAI client to avoid build-time errors
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Set max duration for the function (60s for Pro plan, 10s for Hobby)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const body = await req.json();
    const message = body.message as string;
    const clientThreadId = body.threadId as string | undefined;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!assistantId) {
      return new Response(
        JSON.stringify({ error: "Assistant not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const openai = getOpenAIClient();

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

    logger.debug("Thread ID before stream:", { threadId });

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          logger.debug("Thread ID inside stream:", { threadId });
          // Start the assistant run with streaming
          const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
            stream: false, // We'll poll instead to handle timeouts better
          });
          logger.debug("Run created:", { runId: run.id });

          // Poll for completion with shorter intervals
          let runStatus = await openai.beta.threads.runs.retrieve(run.id, {
            thread_id: threadId,
          });
          let attempts = 0;
          const maxAttempts = 50; // 50 attempts * 1s = 50s max

          while (
            runStatus.status === "queued" ||
            runStatus.status === "in_progress"
          ) {
            if (attempts >= maxAttempts) {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    error: "Request timeout - please try again",
                  }) + "\n"
                )
              );
              controller.close();
              return;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(run.id, {
              thread_id: threadId,
            });
            attempts++;
          }

          if (runStatus.status === "failed") {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ error: "Assistant failed to respond" }) + "\n"
              )
            );
            controller.close();
            return;
          }

          if (runStatus.status !== "completed") {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ error: "Request was cancelled" }) + "\n"
              )
            );
            controller.close();
            return;
          }

          // Get the assistant's response
          const messagesResponse =
            await openai.beta.threads.messages.list(threadId);
          const assistantMessage = messagesResponse.data.find(
            (msg) => msg.role === "assistant"
          );

          if (!assistantMessage) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ error: "No response from assistant" }) + "\n"
              )
            );
            controller.close();
            return;
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

          // Send the complete response
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                response: responseText,
                threadId,
              }) + "\n"
            )
          );
          controller.close();
        } catch (error) {
          logger.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ error: "Internal server error" }) + "\n"
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/json",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    logger.error("Chatbot API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
