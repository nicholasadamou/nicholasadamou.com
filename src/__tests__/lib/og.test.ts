import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBaseUrl, generateOGUrl } from "@/lib/og";

describe("getBaseUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns localhost in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });

  it("returns production URL in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });

  it("returns production URL in test", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(getBaseUrl()).toBe("https://nicholasadamou.com");
  });
});

describe("generateOGUrl", () => {
  it("generates URL with all params", () => {
    const url = generateOGUrl({
      title: "Hello",
      description: "World",
      type: "note",
      image: "/img.jpg",
    });
    expect(url).toContain("/api/og?");
    expect(url).toContain("title=Hello");
    expect(url).toContain("description=World");
    expect(url).toContain("type=note");
    expect(url).toContain("image=%2Fimg.jpg");
    expect(url).toContain("theme=dark");
  });

  it("includes dark theme by default", () => {
    const url = generateOGUrl({ title: "Test" });
    expect(url).toContain("theme=dark");
  });

  it("handles empty params", () => {
    const url = generateOGUrl({});
    expect(url).toContain("/api/og?");
    expect(url).toContain("theme=dark");
  });
});
