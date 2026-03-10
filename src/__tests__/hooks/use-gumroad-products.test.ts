import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useGumroadProducts from "@/hooks/use-gumroad-products";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Product 1",
    description: "Desc",
    formatted_price: "$10",
    short_url: "https://gumroad.com/l/1",
    thumbnail_url: "https://example.com/thumb.jpg",
  },
];

describe("useGumroadProducts", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
  });

  it("fetches products successfully", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ products: MOCK_PRODUCTS }),
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(MOCK_PRODUCTS);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.products).toEqual([]);
  });

  it("handles network error", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useGumroadProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
  });
});
