"use client";

import dynamic from "next/dynamic";

const ChatbotWidget = dynamic(
  () =>
    import("@/components/chat/ChatbotWidget").then((mod) => mod.ChatbotWidget),
  { ssr: false }
);

export function DynamicChatbot() {
  return <ChatbotWidget />;
}
