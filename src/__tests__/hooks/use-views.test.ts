import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useViews } from "@/hooks/use-views";

describe("useViews", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
  });

  it("fetches and returns view count", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ count: 42 }),
      } as Response)
      .mockResolvedValueOnce({ ok: true } as Response);

    const { result } = renderHook(() => useViews("test-slug"));

    await waitFor(() => {
      expect(result.current).toBeGreaterThanOrEqual(42);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/notes/test-slug/views");
    expect(global.fetch).toHaveBeenCalledWith("/api/notes/test-slug/views", {
      method: "POST",
    });
  });

  it("does not POST when increment is false", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ count: 10 }),
    } as Response);

    const { result } = renderHook(() => useViews("test-slug", false));

    await waitFor(() => {
      expect(result.current).toBe(10);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns 0 on fetch error", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useViews("test-slug"));

    // Should not throw; count stays at 0
    expect(result.current).toBe(0);
  });
});
