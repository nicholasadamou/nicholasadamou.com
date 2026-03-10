import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useInfiniteVscoGallery } from "@/hooks/use-infinite-vsco-gallery";

function makePage(offset: number, hasMore: boolean) {
  return {
    images: [{ id: `img-${offset}`, url: `/img-${offset}.jpg` }],
    hasMore,
    totalCount: 3,
  };
}

describe("useInfiniteVscoGallery", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
  });

  it("loads initial page", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makePage(0, true)),
    } as Response);

    const { result } = renderHook(() =>
      useInfiniteVscoGallery({ pageSize: 1 })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.totalCount).toBe(3);
  });

  it("appends images on loadMore", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makePage(0, true)),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(makePage(1, false)),
      } as Response);

    const { result } = renderHook(() =>
      useInfiniteVscoGallery({ pageSize: 1 })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.images).toHaveLength(2);
    });
  });

  it("handles error", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Error" }),
    } as Response);

    const { result } = renderHook(() => useInfiniteVscoGallery());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it("does not load more when hasMore is false", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makePage(0, false)),
    } as Response);

    const { result } = renderHook(() =>
      useInfiniteVscoGallery({ pageSize: 1 })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.loadMore();
    });

    // fetch should only be called once (initial load)
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
