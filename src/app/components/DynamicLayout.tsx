"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import heavy components to reduce initial bundle size
const ChatbotWidget = dynamic(
  () =>
    import("@/components/common/dialogs/Chatbot/ChatbotWidget").then((mod) => ({
      default: mod.ChatbotWidget,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const KeyboardShortcutsDialog = dynamic(
  () =>
    import("@/components/common/dialogs/KeyboardShortcutsDialog").then(
      (mod) => ({ default: mod.KeyboardShortcutsDialog })
    ),
  {
    ssr: false,
    loading: () => null,
  }
);

export function DynamicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
      <Suspense fallback={null}>
        <KeyboardShortcutsDialog />
      </Suspense>
      {children}
    </>
  );
}
