"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HexColorPicker } from "react-colorful";
import { useTheme } from "@/components/ThemeProvider";
import CommandPalette from "@/components/layout/CommandPalette";
import KeyboardShortcutsDialog from "@/components/layout/KeyboardShortcutsDialog";
import { DynamicChatbot } from "@/components/chat/DynamicChatbot";

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 1 0 -4 0" />
      <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828a4 4 0 0 1 -2.682 1.172h-1.5a2 2 0 0 0 -1.5 3.333c.667 .889 .167 2.667 -2 2.667z" />
      <circle cx="7.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="12" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="16.5" cy="10.5" r=".5" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-5 sm:w-5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export default function BottomNav() {
  const [showPicker, setShowPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const {
    themeState,
    updateTheme,
    shouldUseDarkText,
    getOpacityClass,
    getLinkColorClass,
  } = useTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".color-picker-container") &&
        !target.closest(".color-picker-trigger")
      ) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [showPicker]);

  // Cmd+K / Cmd+J shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setShowChat((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ? shortcut for help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (
        e.shiftKey &&
        e.key === "?" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !isTyping
      ) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navBg = shouldUseDarkText()
    ? "bg-stone-950/[4%] backdrop-blur-md"
    : "bg-white/[8%] backdrop-blur-md";

  const pickerBg = shouldUseDarkText() ? "bg-stone-950/[4%]" : "bg-white/10";

  const btnClass = shouldUseDarkText()
    ? "bg-stone-950/[6%] focus-visible:outline-none focus-visible:bg-stone-950/10"
    : "bg-white/10 focus-visible:outline-none focus-visible:bg-white/20";

  return (
    <>
      <div
        className={`animate-fadeInNav fixed inset-x-6 bottom-5 mx-auto flex max-w-xs items-center justify-between gap-4 rounded-full px-5 py-2.5 text-sm sm:bottom-6 sm:left-6 sm:right-auto sm:mx-0 sm:max-w-none sm:gap-6 ${navBg}`}
      >
        <Link
          href="/"
          className={`font-semibold transition-opacity hover:opacity-100 ${getOpacityClass()} ${getLinkColorClass()}`}
        >
          <HomeIcon />
        </Link>
        <Link
          href="https://github.com/nicholasadamou"
          target="_blank"
          className={`transition-opacity hover:opacity-100 ${getOpacityClass()} ${getLinkColorClass()}`}
        >
          <GitHubIcon />
        </Link>
        <Link
          href="https://linkedin.com/in/nicholas-adamou"
          target="_blank"
          className={`transition-opacity hover:opacity-100 ${getOpacityClass()} ${getLinkColorClass()}`}
        >
          <LinkedInIcon />
        </Link>
        <Link
          href="/contact"
          className={`transition-opacity hover:opacity-100 ${getOpacityClass()} ${getLinkColorClass()}`}
        >
          <MailIcon />
        </Link>
        <button
          className={`color-picker-trigger cursor-pointer transition-opacity hover:opacity-100 ${getOpacityClass()} ${getLinkColorClass()}`}
          onClick={() => setShowPicker(!showPicker)}
        >
          <PaletteIcon />
        </button>
        <button
          className={`cursor-pointer transition-opacity hover:opacity-100 ${getOpacityClass()} ${getLinkColorClass()}`}
          onClick={() => setShowSearch(true)}
        >
          <SearchIcon />
        </button>
        <button
          className={`chat-trigger cursor-pointer transition-opacity hover:opacity-100 ${getOpacityClass()} ${getLinkColorClass()}`}
          onClick={() => setShowChat((prev) => !prev)}
        >
          <ChatIcon />
        </button>
        <button
          className={`hidden cursor-pointer transition-opacity hover:opacity-100 sm:block ${getOpacityClass()} ${getLinkColorClass()}`}
          onClick={() => setShowShortcuts(true)}
        >
          <HelpIcon />
        </button>
      </div>

      <CommandPalette
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
      <KeyboardShortcutsDialog
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <DynamicChatbot isOpen={showChat} onClose={() => setShowChat(false)} />

      {showPicker && (
        <div
          className={`fixed inset-x-6 bottom-[4.5rem] mx-auto max-w-xs p-4 sm:inset-x-auto sm:bottom-20 sm:left-6 sm:mx-0 sm:w-60 sm:max-w-none sm:p-3 ${pickerBg} color-picker-container z-50 rounded-xl backdrop-blur-md`}
        >
          <HexColorPicker
            color={themeState.color}
            onChange={(color) => updateTheme({ mode: "custom", color })}
            className="!w-full"
          />
          <div className="mt-2.5 flex gap-1.5">
            <button
              onClick={() => updateTheme({ mode: "light", color: "#fafaf9" })}
              className={`flex h-8 flex-1 items-center justify-center rounded-lg px-3 pb-0.5 text-sm transition-all ${btnClass} cursor-pointer hover:opacity-60`}
            >
              Light
            </button>
            <button
              onClick={() => updateTheme({ mode: "dark", color: "#0c0a09" })}
              className={`flex h-8 flex-1 items-center justify-center rounded-lg px-3 pb-0.5 text-sm transition-all ${btnClass} cursor-pointer hover:opacity-60`}
            >
              Dark
            </button>
          </div>
        </div>
      )}
    </>
  );
}
