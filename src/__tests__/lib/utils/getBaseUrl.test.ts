import { describe, it, expect, beforeEach, vi } from "vitest";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

describe("getBaseUrl", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("should return localhost URL in development", () => {
    process.env.NODE_ENV = "development";
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });

  it("should return production URL in production", () => {
    process.env.NODE_ENV = "production";
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });

  it("should return production URL in test environment", () => {
    process.env.NODE_ENV = "test";
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });

  it("should return production URL for undefined NODE_ENV", () => {
    delete process.env.NODE_ENV;
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });
});
