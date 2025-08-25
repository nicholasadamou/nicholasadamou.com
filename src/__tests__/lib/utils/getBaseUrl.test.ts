import { describe, it, expect, beforeEach, vi } from "vitest";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

describe("getBaseUrl", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  it("should return localhost URL in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });

  it("should return production URL in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });

  it("should return production URL in test environment", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });

  it("should return production URL for undefined NODE_ENV", () => {
    vi.stubEnv("NODE_ENV", undefined);
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });
});
