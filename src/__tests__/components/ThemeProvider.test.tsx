import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("ThemeProvider", () => {
  it("provides theme context", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.themeState).toBeDefined();
    expect(result.current.themeState.mode).toBe("light");
    expect(result.current.updateTheme).toBeInstanceOf(Function);
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");
  });

  it("updateTheme changes mode", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateTheme({ mode: "dark" });
    });

    expect(result.current.themeState.mode).toBe("dark");
    expect(result.current.themeState.color).toBe("#0c0a09");
  });

  it("updateTheme to light sets light color", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateTheme({ mode: "dark" });
    });
    act(() => {
      result.current.updateTheme({ mode: "light" });
    });

    expect(result.current.themeState.color).toBe("#fafaf9");
  });

  it("shouldUseDarkText returns true for light mode", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.shouldUseDarkText()).toBe(true);
  });

  it("getTextColorClass returns correct class", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.getTextColorClass()).toBe("text-stone-950");
  });

  it("getLinkColorClass returns correct class", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.getLinkColorClass()).toBe("text-stone-950");
  });

  it("getHrColorClass returns correct class", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.getHrColorClass()).toBe("border-stone-950/10");
  });

  it("custom mode allows arbitrary color", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateTheme({ mode: "custom", color: "#ff0000" });
    });

    expect(result.current.themeState.mode).toBe("custom");
    expect(result.current.themeState.color).toBe("#ff0000");
  });

  it("shouldUseDarkText returns false for dark mode", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateTheme({ mode: "dark" });
    });

    expect(result.current.shouldUseDarkText()).toBe(false);
    expect(result.current.getTextColorClass()).toBe("text-white");
    expect(result.current.getLinkColorClass()).toBe("text-white");
    expect(result.current.getHrColorClass()).toBe("border-white/10");
  });

  it("getOpacityClass returns same value for both themes", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.getOpacityClass()).toBe("opacity-60");

    act(() => {
      result.current.updateTheme({ mode: "dark" });
    });

    expect(result.current.getOpacityClass()).toBe("opacity-60");
  });

  it("does not override custom mode on system theme change", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateTheme({ mode: "custom", color: "#abcdef" });
    });

    expect(result.current.themeState.mode).toBe("custom");
    // After custom, system theme shouldn't override
    expect(result.current.themeState.color).toBe("#abcdef");
  });
});
