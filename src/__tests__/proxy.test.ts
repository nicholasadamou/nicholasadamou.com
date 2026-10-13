import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

function makeRequest(
  pathname: string,
  init?: { accept?: string; rsc?: string }
) {
  const url = new URL(pathname, "https://nicholasadamou.com");
  const headers = new Headers();
  if (init?.accept !== undefined) {
    headers.set("accept", init.accept);
  }
  if (init?.rsc) {
    headers.set("rsc", init.rsc);
  }
  return new NextRequest(url, { headers });
}

describe("proxy markdown negotiation", () => {
  it("rewrites unknown paths to markdown 404 when Accept is missing", () => {
    const res = proxy(makeRequest("/does-not-exist"));
    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-rewrite")).toMatch(
      /\/api\/markdown\/not-found$/
    );
    expect(res.headers.get("vary")).toMatch(/Accept/i);
  });

  it("rewrites unknown paths to markdown 404 for Accept: */*", () => {
    const res = proxy(makeRequest("/does-not-exist", { accept: "*/*" }));
    expect(res.headers.get("x-middleware-rewrite")).toMatch(
      /\/api\/markdown\/not-found$/
    );
  });

  it("passes through unknown paths as HTML when text/html is accepted", () => {
    const res = proxy(
      makeRequest("/does-not-exist", {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      })
    );
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.headers.get("vary")).toMatch(/Accept/i);
  });

  it("rewrites known pages to markdown when Accept prefers markdown", () => {
    const res = proxy(makeRequest("/developers", { accept: "text/markdown" }));
    expect(res.headers.get("x-middleware-rewrite")).toMatch(
      /\/api\/markdown\/developers$/
    );
  });

  it("does not rewrite known pages to markdown 404 without Accept", () => {
    const res = proxy(makeRequest("/developers"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("skips negotiation for RSC requests", () => {
    const res = proxy(
      makeRequest("/does-not-exist", { accept: "text/markdown", rsc: "1" })
    );
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });
});
