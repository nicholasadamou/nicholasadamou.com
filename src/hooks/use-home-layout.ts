"use client";

import { useCallback, useSyncExternalStore } from "react";

export type HomeLayout = "single" | "two-column";

const STORAGE_KEY = "home-layout";
const DEFAULT_LAYOUT: HomeLayout = "two-column";
const EVENT_NAME = "home-layout-change";

function getLayoutSnapshot(): HomeLayout {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "single" || stored === "two-column"
    ? stored
    : DEFAULT_LAYOUT;
}

function getLayoutServerSnapshot(): HomeLayout {
  return DEFAULT_LAYOUT;
}

function subscribeLayout(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}

export function useHomeLayout() {
  const layout = useSyncExternalStore(
    subscribeLayout,
    getLayoutSnapshot,
    getLayoutServerSnapshot
  );

  const toggleLayout = useCallback(() => {
    const next = getLayoutSnapshot() === "single" ? "two-column" : "single";
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return { layout, toggleLayout };
}

/* ── useIsDesktop (viewport ≥ 640px / sm breakpoint) ── */

const MQ = "(min-width: 640px)";

function getDesktopSnapshot() {
  return window.matchMedia(MQ).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );
}
