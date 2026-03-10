"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface ThemeState {
  mode: "light" | "dark" | "custom";
  color: string;
}

interface ThemeContextType {
  themeState: ThemeState;
  updateTheme: (state: Partial<ThemeState>) => void;
  shouldUseDarkText: () => boolean;
  getTextColorClass: () => string;
  getOpacityClass: () => string;
  getLinkColorClass: () => string;
  getHrColorClass: () => string;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const { r, g, b } = rgb;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getSystemTheme(): ThemeState {
  if (typeof window === "undefined") return { mode: "light", color: "#fafaf9" };
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark
    ? { mode: "dark", color: "#0c0a09" }
    : { mode: "light", color: "#fafaf9" };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: "light",
    color: "#fafaf9",
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount, apply system preference
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(getSystemTheme());
    setIsHydrated(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // Only follow system changes if not on a custom color
      setThemeState((prev) => {
        if (prev.mode === "custom") return prev;
        return getSystemTheme();
      });
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const updateTheme = useCallback((partial: Partial<ThemeState>) => {
    setThemeState((prev) => {
      const next = { ...prev, ...partial };
      if (next.mode === "light") next.color = "#fafaf9";
      if (next.mode === "dark") next.color = "#0c0a09";
      return next;
    });
  }, []);

  // Apply background color to body & toggle .dark class
  useEffect(() => {
    if (!isHydrated) return;
    document.body.style.backgroundColor = themeState.color;
    document.body.style.transition =
      "background-color 0.8s ease, color 0.8s ease";
    const isDark = getLuminance(themeState.color) <= 0.5;
    document.documentElement.classList.toggle("dark", isDark);
  }, [themeState.color, isHydrated]);

  const shouldUseDarkText = useCallback(() => {
    return getLuminance(themeState.color) > 0.5;
  }, [themeState.color]);

  const getTextColorClass = useCallback(() => {
    return shouldUseDarkText() ? "text-stone-950" : "text-white";
  }, [shouldUseDarkText]);

  const getOpacityClass = useCallback(() => {
    return shouldUseDarkText() ? "opacity-60" : "opacity-60";
  }, [shouldUseDarkText]);

  const getLinkColorClass = useCallback(() => {
    return shouldUseDarkText() ? "text-stone-950" : "text-white";
  }, [shouldUseDarkText]);

  const getHrColorClass = useCallback(() => {
    return shouldUseDarkText() ? "border-stone-950/10" : "border-white/10";
  }, [shouldUseDarkText]);

  return (
    <ThemeContext.Provider
      value={{
        themeState,
        updateTheme,
        shouldUseDarkText,
        getTextColorClass,
        getOpacityClass,
        getLinkColorClass,
        getHrColorClass,
        isHydrated,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
