import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useVscoGallery } from "@/hooks/use-vsco-gallery";

const MOCK_RESPONSE = {
  images: [{ id: "1", url: "/img.jpg" }],
  hasMore: false,
  totalCount: 1,
};

describe("useVscoGallery", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
  });

  it("fetches gallery data", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_RESPONSE),
    } as Response);

    const { result } = renderHook(() => useVscoGallery());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(MOCK_RESPONSE);
    expect(result.current.error).toBeNull();
  });

  it("passes limit as query param", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_RESPONSE),
    } as Response);

    renderHook(() => useVscoGallery({ limit: 10 }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("limit=10")
      );
    });
  });

  it("handles error response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Server error" }),
    } as Response);

    const { result } = renderHook(() => useVscoGallery());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual({
      message: "Server error",
      status: 500,
    });
  });

  it("provides refetch function", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_RESPONSE),
    } as Response);

    const { result } = renderHook(() => useVscoGallery());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe("function");
  });
});
