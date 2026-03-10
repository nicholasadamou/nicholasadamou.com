import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHomeLayout, useIsDesktop } from "@/hooks/use-home-layout";

describe("useHomeLayout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to two-column layout", () => {
    const { result } = renderHook(() => useHomeLayout());
    expect(result.current.layout).toBe("two-column");
  });

  it("reads stored layout from localStorage", () => {
    localStorage.setItem("home-layout", "two-column");
    const { result } = renderHook(() => useHomeLayout());
    expect(result.current.layout).toBe("two-column");
  });

  it("ignores invalid localStorage values", () => {
    localStorage.setItem("home-layout", "garbage");
    const { result } = renderHook(() => useHomeLayout());
    expect(result.current.layout).toBe("two-column");
  });

  it("toggles from two-column to single", () => {
    const { result } = renderHook(() => useHomeLayout());

    act(() => result.current.toggleLayout());

    expect(result.current.layout).toBe("single");
    expect(localStorage.getItem("home-layout")).toBe("single");
  });

  it("toggles from single back to two-column", () => {
    localStorage.setItem("home-layout", "single");
    const { result } = renderHook(() => useHomeLayout());

    act(() => result.current.toggleLayout());

    expect(result.current.layout).toBe("two-column");
    expect(localStorage.getItem("home-layout")).toBe("two-column");
  });

  it("syncs across instances via custom event", () => {
    const { result: a } = renderHook(() => useHomeLayout());
    const { result: b } = renderHook(() => useHomeLayout());

    act(() => a.current.toggleLayout());

    expect(b.current.layout).toBe("single");
  });
});

describe("useIsDesktop", () => {
  it("returns false when matchMedia does not match", () => {
    const { result } = renderHook(() => useIsDesktop());
    // Default mock returns matches: false
    expect(result.current).toBe(false);
  });
});
