import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMounted } from "@/hooks/usemounted";

describe("useMounted", () => {
  it("should return true after mounting (useEffect runs in test env)", () => {
    const { result } = renderHook(() => useMounted());

    // In test environment, useEffect runs synchronously, so it will be true
    expect(result.current).toBe(true);
  });

  it("should remain true after multiple rerenders", () => {
    const { result, rerender } = renderHook(() => useMounted());

    // Should be true after initial mount
    expect(result.current).toBe(true);

    // Rerender multiple times
    rerender();
    rerender();
    rerender();

    // Should still be true
    expect(result.current).toBe(true);
  });

  it("should maintain consistent behavior", () => {
    const { result } = renderHook(() => useMounted());
    const initialValue = result.current;

    // The hook should return a boolean value
    expect(typeof result.current).toBe("boolean");

    // In test environment, it should be true (mounted)
    expect(initialValue).toBe(true);
  });
});
