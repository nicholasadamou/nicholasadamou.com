"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "@/components/ThemeProvider";

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

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotWidget({ isOpen, onClose }: ChatbotWidgetProps) {
  const { shouldUseDarkText, isHydrated } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const light = shouldUseDarkText();

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

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".chat-trigger")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim(), threadId }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let hasError = false;
      let errorMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

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
            } catch {
              // Skip malformed lines during streaming
            }
          }
        }

        if (hasError) break;
      }

      if (hasError) {
        throw new Error(errorMessage);
      }
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const clearChat = () => {
    setMessages([]);
    setThreadId(null);
    sessionStorage.removeItem("chatbot-messages");
    sessionStorage.removeItem("chatbot-thread-id");
  };

  if (!isHydrated) return null;

  // Theme-aware styles
  const windowBg = light ? "bg-white" : "bg-stone-900";
  const windowBorder = light ? "border-stone-200" : "border-white/10";
  const headerBg = light ? "bg-stone-50" : "bg-stone-800";
  const titleColor = light ? "text-stone-900" : "text-white";
  const subtitleColor = light ? "text-stone-500" : "text-white/50";
  const clearBtnStyle = light
    ? "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
    : "text-white/50 hover:text-white hover:bg-white/10";
  const emptyIcon = light ? "bg-stone-100" : "bg-white/10";
  const suggestedBtnStyle = light
    ? "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
    : "border-white/10 bg-white/5 text-white hover:bg-white/10";
  const userBubble = "bg-blue-600 text-white";
  const assistantBubble = light
    ? "bg-stone-50 text-stone-900 border border-stone-200"
    : "bg-white/5 text-white border border-white/10";
  const loadingBubble = light
    ? "bg-stone-50 text-stone-500 border border-stone-200"
    : "bg-white/5 text-white/50 border border-white/10";
  const inputBg = light
    ? "bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-blue-500"
    : "bg-stone-900 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500";
  const footerBg = light ? "bg-stone-50" : "bg-stone-800";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={chatWindowRef}
          className="fixed bottom-[4.5rem] left-1/2 z-50 w-[600px] max-w-[calc(100vw-3rem)] -translate-x-1/2 sm:bottom-20"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className={`flex h-[600px] max-h-[80vh] flex-col overflow-hidden rounded-2xl border shadow-2xl ${windowBg} ${windowBorder}`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between border-b p-4 ${headerBg} ${windowBorder}`}
            >
              <div>
                <h3 className={`font-semibold ${titleColor}`}>
                  Chat Assistant
                </h3>
                <p className={`text-xs ${subtitleColor}`}>Ask me anything!</p>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className={`h-8 cursor-pointer rounded-md px-3 text-xs transition-colors ${clearBtnStyle}`}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Messages */}
            <div className={`flex-1 space-y-4 overflow-y-auto p-4 ${windowBg}`}>
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${emptyIcon}`}
                  >
                    <MessageCircle className={`h-8 w-8 ${subtitleColor}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${titleColor}`}>
                      Hi! I&apos;m here to help you learn more about Nick!
                    </p>
                    <p className={`mt-2 text-xs ${subtitleColor}`}>
                      Try asking:
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        onClick={() => sendMessage(question)}
                        className={`w-full cursor-pointer rounded-lg border px-4 py-2.5 text-xs transition-colors ${suggestedBtnStyle}`}
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
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      message.role === "user" ? userBubble : assistantBubble
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
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
                  <div
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm shadow-sm ${loadingBubble}`}
                  >
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
              className={`border-t p-4 ${footerBg} ${windowBorder}`}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors disabled:opacity-50 ${inputBg}`}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
