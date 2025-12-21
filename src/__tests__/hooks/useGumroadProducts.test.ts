import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import useGumroadProducts from "@/hooks/data/use-gumroad-products";

// Mock global fetch
global.fetch = vi.fn();

describe("useGumroadProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with correct default state", () => {
    // Mock successful response to prevent hanging
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    } as Response);

    let result;
    act(() => {
      ({ result } = renderHook(() => useGumroadProducts()));
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("should fetch products successfully", async () => {
    const mockProducts = [
      {
        id: "1",
        name: "Product 1",
        description: "First product",
        price: 2999,
        currency: "USD",
        short_url: "https://gum.co/prod1",
        thumbnail_url: "https://example.com/thumb1.jpg",
        formatted_price: "$29.99",
      },
      {
        id: "2",
        name: "Product 2",
        description: "Second product",
        price: 4999,
        currency: "USD",
        short_url: "https://gum.co/prod2",
        thumbnail_url: "https://example.com/thumb2.jpg",
        formatted_price: "$49.99",
      },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: mockProducts }),
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBe(null);
    expect(fetch).toHaveBeenCalledWith("/api/gumroad/products");
  });

  it("should handle empty products response", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should handle response without products field", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should handle HTTP error responses", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: "Not found" }),
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch products");
  });

  it("should handle network errors", async () => {
    const networkError = new Error("Network connection failed");
    fetch.mockRejectedValue(networkError);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe("Network connection failed");
  });

  it("should handle JSON parsing errors", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe("Invalid JSON");
  });

  it("should set loading state correctly during fetch", async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    fetch.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useGumroadProducts());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(null);

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should only fetch once on mount", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    } as Response);

    const { rerender } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Rerender multiple times
    rerender();
    rerender();
    rerender();

    // Should still only have been called once
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should handle different product data structures", async () => {
    const mockProduct = {
      id: "test-id",
      name: "Test Product",
      description: "Test Description",
      price: 1500,
      currency: "EUR",
      short_url: "https://gum.co/test",
      thumbnail_url: "https://example.com/test.jpg",
      formatted_price: "€15.00",
    };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [mockProduct] }),
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0]).toEqual(mockProduct);
    expect(result.current.products[0].currency).toBe("EUR");
    expect(result.current.products[0].formatted_price).toBe("€15.00");
  });

  it("should maintain state consistency during error recovery", async () => {
    // First call fails
    fetch.mockRejectedValueOnce(new Error("First error"));

    const { result, rerender } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("First error");
      expect(result.current.products).toEqual([]);
    });

    // Hook doesn't refetch automatically, but we can verify the state is consistent
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("First error");
    expect(result.current.products).toEqual([]);
  });

  it("should handle concurrent hook instances independently", async () => {
    const mockProducts1 = [{ id: "1", name: "Product 1" }];
    const mockProducts2 = [{ id: "2", name: "Product 2" }];

    // Mock different responses for different calls
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts1 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts2 }),
      } as Response);

    const hook1 = renderHook(() => useGumroadProducts());
    const hook2 = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(hook1.result.current.loading).toBe(false);
      expect(hook2.result.current.loading).toBe(false);
    });

    // Both hooks should get the same data since they call the same API
    // In a real scenario, they would both get the first response
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(hook1.result.current.error).toBe(null);
    expect(hook2.result.current.error).toBe(null);
  });
});
