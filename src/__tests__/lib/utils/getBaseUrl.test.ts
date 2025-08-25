import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

describe("getBaseUrl", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    Object.defineProperty(process.env, "NODE_ENV", {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  it("should return localhost URL in development", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      writable: true,
      configurable: true,
    });
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });

  it("should return production URL in production", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      writable: true,
      configurable: true,
    });
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });

  it("should return production URL in test environment", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "test",
      writable: true,
      configurable: true,
    });
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });

  it("should return production URL for undefined NODE_ENV", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });
});
