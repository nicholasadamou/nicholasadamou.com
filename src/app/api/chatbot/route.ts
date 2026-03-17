import { NextRequest } from "next/server";
import OpenAI from "openai";
import { sql } from "@vercel/postgres";
import { getArticleBySlug, type Article } from "@/lib/content/mdx";

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
const MAX_NOTE_CONTEXT_CHARACTERS = 12000;

function isValidNoteSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/i.test(slug);
}

function buildNoteInstructions(note: Article): string {
  const isTruncated = note.body.raw.length > MAX_NOTE_CONTEXT_CHARACTERS;
  const noteBody = isTruncated
    ? `${note.body.raw.slice(0, MAX_NOTE_CONTEXT_CHARACTERS)}\n\n[Note content truncated for context window]`
    : note.body.raw;

  return `The user is currently reading a specific note on the website. Prioritize answering using this note when relevant.

Current note metadata:
- Title: ${note.title}
- Slug: ${note.slug}
- Summary: ${note.summary}

Current note content:
${noteBody}`;
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const body = await req.json();
    const message = body.message as string;
    const clientThreadId = body.threadId as string | undefined;
    const rawNoteSlug = body.noteSlug as string | undefined;
    const noteSlug =
      rawNoteSlug && isValidNoteSlug(rawNoteSlug.trim())
        ? rawNoteSlug.trim()
        : null;
    const activeNote = noteSlug ? getArticleBySlug(noteSlug) : null;
    const noteInstructions = activeNote
      ? buildNoteInstructions(activeNote)
      : undefined;

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

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
            ...(noteInstructions
              ? { additional_instructions: noteInstructions }
              : {}),
            stream: false,
          });

          // Poll for completion
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

          // Log the query to Postgres (fire-and-forget)
          if (process.env.POSTGRES_URL) {
            const ip =
              req.headers.get("x-forwarded-for")?.split(",")[0] ||
              req.headers.get("remote-addr") ||
              "unknown";
            sql`
              INSERT INTO chatbot_logs (message, response, thread_id, ip_address)
              VALUES (${message}, ${responseText}, ${threadId}, ${ip})
            `.catch((err) =>
              console.error("Failed to log chatbot query:", err)
            );
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
          console.error("Stream error:", error);
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
    console.error("Chatbot API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
