"use client";

import dynamic from "next/dynamic";

const ChatbotWidget = dynamic(
  () =>
    import("@/components/chat/ChatbotWidget").then((mod) => mod.ChatbotWidget),
  { ssr: false }
);

interface DynamicChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DynamicChatbot({ isOpen, onClose }: DynamicChatbotProps) {
  return <ChatbotWidget isOpen={isOpen} onClose={onClose} />;
}
