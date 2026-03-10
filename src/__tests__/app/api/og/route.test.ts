import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock ImageResponse since it's from next/og and won't work in test env
vi.mock("next/og", () => {
  class MockImageResponse {
    element: unknown;
    options: unknown;
    headers: Headers;
    constructor(element: unknown, options?: unknown) {
      this.element = element;
      this.options = options;
      this.headers = new Headers({ "content-type": "image/png" });
    }
  }
  return { ImageResponse: MockImageResponse };
});

vi.mock("fs", () => ({
  default: { readFileSync: vi.fn() },
  readFileSync: vi.fn(),
}));

vi.mock("path", () => ({
  default: { join: (...args: string[]) => args.join("/") },
  join: (...args: string[]) => args.join("/"),
}));

vi.mock("@/app/api/og/avatar-data", () => ({
  AVATAR_BASE64: "data:image/png;base64,avatar",
}));

import { GET } from "@/app/api/og/route";

function makeRequest(
  params: Record<string, string> = {}
): Parameters<typeof GET>[0] {
  const url = new URL("http://localhost:3000/api/og");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return {
    nextUrl: url,
    headers: new Headers({
      host: "localhost:3000",
      "x-forwarded-proto": "http",
    }),
  } as unknown as Parameters<typeof GET>[0];
}

describe("GET /api/og", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an ImageResponse", async () => {
    const response = await GET(makeRequest({ title: "Test" }));
    expect(response).toBeDefined();
  });

  it("uses provided title param", async () => {
    const response = await GET(makeRequest({ title: "Custom Title" }));
    expect(response).toBeDefined();
  });

  it("handles homepage type", async () => {
    const response = await GET(makeRequest({ type: "homepage" }));
    expect(response).toBeDefined();
  });

  it("cleans amp; prefixed params", async () => {
    const url = new URL("http://localhost:3000/api/og");
    url.searchParams.set("amp;title", "Amp Test");

    const req = {
      nextUrl: url,
      headers: new Headers({
        host: "localhost:3000",
        "x-forwarded-proto": "http",
      }),
    } as unknown as Parameters<typeof GET>[0];

    const response = await GET(req);
    expect(response).toBeDefined();
  });

  it("uses nicholasadamou.com as base URL when host matches", async () => {
    const url = new URL("https://nicholasadamou.com/api/og");
    url.searchParams.set("title", "Prod");

    const req = {
      nextUrl: url,
      headers: new Headers({
        host: "nicholasadamou.com",
        "x-forwarded-proto": "https",
      }),
    } as unknown as Parameters<typeof GET>[0];

    const response = await GET(req);
    expect(response).toBeDefined();
  });
});
