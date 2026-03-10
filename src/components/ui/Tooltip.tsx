"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export default function Tooltip({ label, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { shouldUseDarkText } = useTheme();

  const show = useCallback(() => {
    if (window.matchMedia("(max-width: 639px)").matches) return;
    timeoutRef.current = setTimeout(() => setVisible(true), 400);
  }, []);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  const light = shouldUseDarkText();
  const bg = light
    ? "bg-stone-900 text-stone-50"
    : "bg-stone-50 text-stone-900";

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <div
          className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-lg ${bg}`}
        >
          {label}
        </div>
      )}
    </div>
  );
}
