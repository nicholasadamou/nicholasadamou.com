"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What projects have you worked on?",
  "Tell me about your experience",
  "How can I contact you?",
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from session storage
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("chatbot-messages");
    const savedThreadId = sessionStorage.getItem("chatbot-thread-id");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(
        parsed.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    }
    if (savedThreadId) {
      setThreadId(savedThreadId);
    }
  }, []);

  // Save chat history to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chatbot-messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (threadId) {
      sessionStorage.setItem("chatbot-thread-id", threadId);
    }
  }, [threadId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+J or Ctrl+J to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.trim(),
          threadId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      // Read the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let hasError = false;
      let errorMessage = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Try to parse complete JSON objects from the buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);

              if (data.error) {
                hasError = true;
                errorMessage = data.error;
                break;
              }

              if (data.threadId) {
                setThreadId(data.threadId);
              }

              if (data.response) {
                const assistantMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: data.response,
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
              }
            } catch (parseError) {
              console.error("Failed to parse response line:", line, parseError);
            }
          }
        }

        if (hasError) break;
      }

      if (hasError) {
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    setThreadId(null);
    sessionStorage.removeItem("chatbot-messages");
    sessionStorage.removeItem("chatbot-thread-id");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
            "bg-tertiary border-primary hover:bg-secondary border",
            isOpen && "bg-secondary"
          )}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="text-primary h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="text-primary h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[600px] max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="border-primary bg-primary flex h-[600px] max-h-[80vh] flex-col overflow-hidden rounded-2xl border shadow-2xl">
              {/* Header */}
              <div className="border-primary bg-secondary flex items-center justify-between border-b p-4">
                <div>
                  <h3 className="text-primary font-semibold">Chat Assistant</h3>
                  <p className="text-secondary text-xs">Ask me anything!</p>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="text-secondary hover:text-primary hover:bg-tertiary h-8 cursor-pointer rounded-md px-3 text-xs transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="bg-primary flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
                    <div className="bg-tertiary flex h-16 w-16 items-center justify-center rounded-full">
                      <MessageCircle className="text-secondary h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-primary text-sm font-medium">
                        Hi! I&apos;m here to help you learn more about Nick!
                      </p>
                      <p className="text-secondary mt-2 text-xs">Try asking:</p>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      {SUGGESTED_QUESTIONS.map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="border-primary bg-secondary text-primary hover:bg-tertiary w-full cursor-pointer rounded-lg border px-4 py-2.5 text-xs transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        message.role === "user"
                          ? "bg-link text-white"
                          : "bg-secondary text-primary border-primary border"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert prose-headings:text-primary prose-p:text-primary prose-a:text-link prose-strong:text-primary prose-code:text-primary prose-pre:bg-tertiary max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary text-secondary border-primary flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-primary bg-secondary border-t p-4"
              >
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="placeholder:text-tertiary border-primary bg-primary text-primary focus:border-link flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-link hover:bg-blue-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
