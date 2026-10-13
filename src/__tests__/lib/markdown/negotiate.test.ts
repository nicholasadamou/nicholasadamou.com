import { describe, it, expect } from "vitest";
import {
  prefersMarkdown,
  prefersMarkdownRecovery,
} from "@/lib/markdown/negotiate";
import { isRscRequest } from "@/lib/markdown/is-rsc-request";
import { markdownResponse } from "@/lib/markdown/response";

describe("prefersMarkdown", () => {
  it("returns false when Accept is missing", () => {
    expect(prefersMarkdown(null)).toBe(false);
  });

  it("returns true for bare text/markdown", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
  });

  it("returns true when markdown q is at least html q", () => {
    expect(prefersMarkdown("text/markdown, text/html")).toBe(true);
    expect(prefersMarkdown("text/html;q=0.8, text/markdown;q=0.9")).toBe(true);
    expect(prefersMarkdown("text/markdown;q=0.5, text/html;q=0.5")).toBe(true);
  });

  it("returns false when html is preferred", () => {
    expect(prefersMarkdown("text/html, text/markdown;q=0.1")).toBe(false);
  });

  it("returns false when markdown is explicitly rejected", () => {
    expect(prefersMarkdown("text/markdown;q=0, text/html")).toBe(false);
  });
});

describe("prefersMarkdownRecovery", () => {
  it("returns true when Accept is missing or */*", () => {
    expect(prefersMarkdownRecovery(null)).toBe(true);
    expect(prefersMarkdownRecovery("*/*")).toBe(true);
  });

  it("returns true for bare text/markdown", () => {
    expect(prefersMarkdownRecovery("text/markdown")).toBe(true);
  });

  it("returns false when text/html is explicitly accepted", () => {
    expect(
      prefersMarkdownRecovery(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      )
    ).toBe(false);
  });

  it("returns true when html is rejected", () => {
    expect(prefersMarkdownRecovery("text/html;q=0, application/json")).toBe(
      true
    );
  });
});

describe("isRscRequest", () => {
  it("detects Next.js RSC / soft-navigation headers", () => {
    expect(isRscRequest(new Headers({ rsc: "1" }))).toBe(true);
    expect(
      isRscRequest(new Headers({ "next-router-state-tree": "%5B%5D" }))
    ).toBe(true);
    expect(isRscRequest(new Headers({ "next-router-prefetch": "1" }))).toBe(
      true
    );
    expect(isRscRequest(new Headers({ accept: "text/markdown" }))).toBe(false);
  });
});

describe("markdownResponse", () => {
  it("defaults to 200 with text/markdown and Vary: Accept", async () => {
    const res = markdownResponse("# Hi\n");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8"
    );
    expect(res.headers.get("Vary")).toBe("Accept");
    expect(await res.text()).toBe("# Hi\n");
  });

  it("can return a 404 markdown body for agent recovery", async () => {
    const res = markdownResponse("# Page not found\n", { status: 404 });
    expect(res.status).toBe(404);
    expect(res.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8"
    );
  });
});
