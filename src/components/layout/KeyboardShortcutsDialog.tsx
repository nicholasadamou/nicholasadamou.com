"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Command } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface Shortcut {
  keys: string[];
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: ["⌘", "K"], description: "Open search" },
  { keys: ["⌘", "J"], description: "Open chat assistant" },
  { keys: ["⌘", "E"], description: "Toggle theme picker" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
];

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsDialog({
  isOpen,
  onClose,
}: KeyboardShortcutsDialogProps) {
  const { shouldUseDarkText } = useTheme();
  const [isMac, setIsMac] = useState(true);

  const light = shouldUseDarkText();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

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

  const modifierKey = isMac ? "⌘" : "Ctrl";

  const displayShortcuts = shortcuts.map((shortcut) => ({
    ...shortcut,
    keys: shortcut.keys.map((key) => (key === "⌘" ? modifierKey : key)),
  }));

  // Theme-aware styles
  const panelBg = light ? "bg-white" : "bg-stone-900";
  const panelBorder = light ? "border-stone-200" : "border-white/10";
  const textPrimary = light ? "text-stone-900" : "text-white";
  const textMuted = light ? "text-stone-500" : "text-white/50";
  const iconMuted = light ? "text-stone-400" : "text-white/30";
  const closeBtnHover = light
    ? "hover:text-stone-900 hover:bg-stone-100"
    : "hover:text-white hover:bg-white/10";
  const kbdStyle = light
    ? "bg-stone-100 text-stone-900 border-stone-200"
    : "bg-white/10 text-white border-white/10";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div
              className={`overflow-hidden rounded-2xl border shadow-2xl ${panelBg} ${panelBorder}`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between border-b p-6 ${panelBorder}`}
              >
                <div className="flex items-center gap-2">
                  <Command className={`h-5 w-5 ${iconMuted}`} />
                  <h2 className={`text-lg font-semibold ${textPrimary}`}>
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={`cursor-pointer rounded-lg p-2 transition-colors ${iconMuted} ${closeBtnHover}`}
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Shortcuts List */}
              <div className="p-6">
                <div className="space-y-3">
                  {displayShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className={`text-sm ${textPrimary}`}>
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd
                              className={`rounded border px-2.5 py-1.5 text-xs font-semibold shadow-sm ${kbdStyle}`}
                            >
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className={`text-xs ${textMuted}`}>+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer hint */}
                <div
                  className={`mt-6 border-t pt-4 text-center text-xs ${textMuted} ${panelBorder}`}
                >
                  Press{" "}
                  <kbd
                    className={`rounded border px-1.5 py-0.5 text-xs font-semibold ${kbdStyle}`}
                  >
                    Esc
                  </kbd>{" "}
                  to close
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
