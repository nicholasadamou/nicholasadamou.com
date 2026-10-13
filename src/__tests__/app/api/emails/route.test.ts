import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/emails/route";

const brief = {
  name: "Test Client",
  email: "client@example.com",
  company: "Example",
  website: "https://example.com",
  projectType: "Website redesign",
  budget: "USD 5,000–10,000",
  timeline: "1–3 months",
  message: "A clearer website for our customers, with an updated portfolio.",
  source: "clients",
};
const request = (body: string) =>
  new NextRequest("http://localhost/api/emails", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("project intake", () => {
  it("validates malformed JSON and incomplete briefs before contacting delivery", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect((await POST(request("{"))).status).toBe(400);
    expect(
      (
        await POST(
          request(
            JSON.stringify({
              ...brief,
              email: "invalid",
              projectType: "unknown",
            })
          )
        )
      ).status
    ).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("forwards all validated project details and referral source", async () => {
    vi.stubEnv("FORMCARRY_URL", "https://example.com/form");
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    expect((await POST(request(JSON.stringify(brief)))).status).toBe(200);
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(brief);
  });
  it("returns a recoverable error when delivery is unavailable", async () => {
    vi.stubEnv("FORMCARRY_URL", "https://example.com/form");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Unavailable", { status: 503 }))
    );
    expect((await POST(request(JSON.stringify(brief)))).status).toBe(502);
    vi.stubEnv("FORMCARRY_URL", "");
    expect((await POST(request(JSON.stringify(brief)))).status).toBe(503);
  });
});
