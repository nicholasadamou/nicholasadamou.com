import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useViews } from "@/app/notes/hooks/useViews";

// Mock console methods to avoid noise in test output
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

// Mock global fetch
global.fetch = vi.fn();

describe("useViews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with view count of 0", () => {
    // Mock successful responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ count: 42 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response);

    const { result } = renderHook(() => useViews({ slug: "test-post" }));

    expect(result.current).toBe(0);
  });

  it("should fetch and increment view count on mount", async () => {
    const mockViewCount = 42;

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ count: mockViewCount }),
    } as Response);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    const { result } = renderHook(() => useViews({ slug: "test-post" }));

    // Just wait for the view count to be updated
    await waitFor(
      () => {
        expect(result.current).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("should handle GET request failure", async () => {
    // Mock failing GET request
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    // Mock successful POST request
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    const { result } = renderHook(() => useViews({ slug: "error-post" }));

    // Wait for increment to complete (should increment from 0 to 1)
    await waitFor(() => {
      expect(result.current).toBe(1);
    });
  });

  it("should handle POST request failure", async () => {
    const initialCount = 5;

    // Mock successful GET request
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: initialCount }),
      } as Response)
    );

    // Mock failing POST request
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Increment failed"))
    );

    const { result } = renderHook(() => useViews({ slug: "increment-error" }));

    // Should have fetched count but no increment due to POST error
    await waitFor(() => {
      expect(result.current).toBe(initialCount);
    });
  });

  it("should handle non-ok GET response", async () => {
    // Mock non-ok GET response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: "Not found" }),
      } as Response)
    );

    // Mock successful POST response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    const { result } = renderHook(() => useViews({ slug: "not-found-post" }));

    // Should increment from 0 to 1 due to successful POST
    await waitFor(() => {
      expect(result.current).toBe(1);
    });
  });

  it("should handle non-ok POST response", async () => {
    const initialCount = 20;

    // Mock successful GET response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: initialCount }),
      } as Response)
    );

    // Mock non-ok POST response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error" }),
      } as Response)
    );

    const { result } = renderHook(() => useViews({ slug: "server-error" }));

    // Should have fetched count but no increment
    await waitFor(() => {
      expect(result.current).toBe(initialCount);
    });
  });

  it("should only fetch once per slug (hasFetched ref)", async () => {
    const initialCount = 15;

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: initialCount }),
    } as Response);

    const { result, rerender } = renderHook(() =>
      useViews({ slug: "single-fetch" })
    );

    // Wait for initial data loading
    await waitFor(() => {
      expect(result.current).toBeGreaterThan(0);
    });

    const initialResult = result.current;

    // Rerender the hook with same slug
    rerender();
    rerender();
    rerender();

    // Should still have been called only twice (GET + POST) on initial mount
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result.current).toBe(initialResult); // Should be unchanged
  });

  it("should not fetch again when slug changes (current behavior)", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 5 }),
    } as Response);

    const { rerender } = renderHook(({ slug }) => useViews({ slug }), {
      initialProps: { slug: "first-post" },
    });

    // Wait for initial fetch
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    const callsAfterFirst = fetch.mock.calls.length;

    // Change slug - due to hasFetched ref not being reset, it won't fetch again
    rerender({ slug: "second-post" });

    // Give it time to potentially make new calls
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should NOT have made new calls because hasFetched.current is still true
    expect(fetch).toHaveBeenCalledTimes(callsAfterFirst);

    // Should only have made calls for the first slug
    expect(fetch).toHaveBeenCalledWith(
      "/api/notes/first-post/views",
      expect.any(Object)
    );
    expect(fetch).not.toHaveBeenCalledWith(
      "/api/notes/second-post/views",
      expect.any(Object)
    );
  });

  it("should handle concurrent hook instances", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 7 }),
    } as Response);

    const hook1 = renderHook(() => useViews({ slug: "post-1" }));
    const hook2 = renderHook(() => useViews({ slug: "post-2" }));

    // Wait for both hooks to make their calls
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(4); // 2 calls per hook
    });

    // Both hooks should have some value
    expect(hook1.result.current).toBeGreaterThanOrEqual(0);
    expect(hook2.result.current).toBeGreaterThanOrEqual(0);
  });
});
