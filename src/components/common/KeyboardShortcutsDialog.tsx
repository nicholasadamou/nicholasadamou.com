"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Command } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: ["⌘", "K"], description: "Open search" },
  { keys: ["⌘", "J"], description: "Open chat assistant" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
];

export function KeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // Detect if user is on Mac
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Just ? key (Shift+/)
      if (e.shiftKey && e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleOpenShortcuts = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-keyboard-shortcuts", handleOpenShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(
        "open-keyboard-shortcuts",
        handleOpenShortcuts
      );
    };
  }, [isOpen]);

  const modifierKey = isMac ? "⌘" : "Ctrl";

  // Replace ⌘ with Ctrl for non-Mac users
  const displayShortcuts = shortcuts.map((shortcut) => ({
    ...shortcut,
    keys: shortcut.keys.map((key) => (key === "⌘" ? modifierKey : key)),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="bg-primary border-primary rounded-2xl border shadow-2xl">
              {/* Header */}
              <div className="border-primary flex items-center justify-between border-b p-6">
                <div className="flex items-center gap-2">
                  <Command className="text-secondary h-5 w-5" />
                  <h2 className="text-primary text-lg font-semibold">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-secondary hover:text-primary hover:bg-secondary rounded-lg p-2 transition-colors"
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
                      <span className="text-primary text-sm">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="bg-secondary text-primary border-primary rounded border px-2.5 py-1.5 text-xs font-semibold shadow-sm">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-tertiary text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer hint */}
                <div className="text-tertiary border-primary mt-6 border-t pt-4 text-center text-xs">
                  Press{" "}
                  <kbd className="bg-secondary text-primary border-primary rounded border px-1.5 py-0.5 text-xs font-semibold">
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
