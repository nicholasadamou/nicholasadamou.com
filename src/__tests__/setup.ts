import "@testing-library/jest-dom";
import React from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement("img", { ...props, alt: props.alt });
  },
}));

// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    section: "section",
    article: "article",
    span: "span",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    p: "p",
    a: "a",
    button: "button",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useMotionValue: () => ({ set: vi.fn(), get: vi.fn() }),
  useTransform: () => 0,
  useSpring: () => 0,
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
    themes: ["light", "dark"],
    systemTheme: "light",
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock global fetch
global.fetch = vi.fn();

// Mock environment variables
beforeAll(() => {
  // Set NODE_ENV for test environment
  process.env.NODE_ENV = "test";

  // Suppress expected React act warnings for async effects and timers
  // These warnings are expected when testing components with setTimeout, fetch, etc.
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      message.includes("An update to") &&
      message.includes("was not wrapped in act(...)")
    ) {
      // Skip this specific warning as it's expected for async components
      return;
    }
    originalError.apply(console, args);
  };
});
