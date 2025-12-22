import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Fetcher from "@/lib/utils/api/fetcher.js";

// Mock the global fetch function
global.fetch = vi.fn();

describe("Fetcher", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch data and return JSON response", async () => {
    const mockData = { message: "success", data: [1, 2, 3] };
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockData),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    const result = await Fetcher("/api/test");

    expect(fetch).toHaveBeenCalledWith("/api/test");
    expect(result).toEqual(mockData);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it("should handle multiple arguments passed to fetch", async () => {
    const mockData = { success: true };
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockData),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "data" }),
    };

    const result = await Fetcher("/api/post", fetchOptions);

    expect(fetch).toHaveBeenCalledWith("/api/post", fetchOptions);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch with custom headers", async () => {
    const mockData = { authenticated: true };
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockData),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    const options = {
      headers: {
        Authorization: "Bearer token123",
        "Content-Type": "application/json",
      },
    };

    await Fetcher("/api/protected", options);

    expect(fetch).toHaveBeenCalledWith("/api/protected", options);
  });

  it("should handle different HTTP methods", async () => {
    const mockData = { method: "DELETE", deleted: true };
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockData),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    await Fetcher("/api/resource/123", { method: "DELETE" });

    expect(fetch).toHaveBeenCalledWith("/api/resource/123", {
      method: "DELETE",
    });
  });

  it("should handle network errors", async () => {
    const networkError = new Error("Network error");
    fetch.mockRejectedValue(networkError);

    await expect(Fetcher("/api/test")).rejects.toThrow("Network error");
    expect(fetch).toHaveBeenCalledWith("/api/test");
  });

  it("should handle JSON parsing errors", async () => {
    const mockResponse = {
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    await expect(Fetcher("/api/invalid-json")).rejects.toThrow("Invalid JSON");
  });

  it("should handle empty response", async () => {
    const mockResponse = {
      json: vi.fn().mockResolvedValue(null),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    const result = await Fetcher("/api/empty");

    expect(result).toBe(null);
  });

  it("should handle responses with different status codes", async () => {
    const mockData = { error: "Not found" };
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockData),
      ok: false,
      status: 404,
    };

    fetch.mockResolvedValue(mockResponse);

    // Fetcher doesn't check response.ok, it just calls .json()
    const result = await Fetcher("/api/not-found");

    expect(result).toEqual(mockData);
  });

  it("should pass through all fetch options", async () => {
    const mockData = { success: true };
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockData),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    const complexOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "custom-value",
      },
      body: JSON.stringify({ update: "data" }),
      cache: "no-cache",
      credentials: "include",
    };

    await Fetcher("/api/complex", complexOptions);

    expect(fetch).toHaveBeenCalledWith("/api/complex", complexOptions);
  });

  it("should handle URL-only calls", async () => {
    const mockData = { data: "simple get" };
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockData),
      ok: true,
      status: 200,
    };

    fetch.mockResolvedValue(mockResponse);

    const result = await Fetcher("https://api.example.com/data");

    expect(fetch).toHaveBeenCalledWith("https://api.example.com/data");
    expect(result).toEqual(mockData);
  });

  it("should handle concurrent requests", async () => {
    const mockData1 = { id: 1, name: "First" };
    const mockData2 = { id: 2, name: "Second" };

    const mockResponse1 = {
      json: vi.fn().mockResolvedValue(mockData1),
      ok: true,
      status: 200,
    };

    const mockResponse2 = {
      json: vi.fn().mockResolvedValue(mockData2),
      ok: true,
      status: 200,
    };

    fetch
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const [result1, result2] = await Promise.all([
      Fetcher("/api/resource/1"),
      Fetcher("/api/resource/2"),
    ]);

    expect(result1).toEqual(mockData1);
    expect(result2).toEqual(mockData2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
