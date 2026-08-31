import { describe, it, expect } from "vitest";
import { GET as searchGet } from "@/app/api/v1/search/route";
import { GET as notesGet } from "@/app/api/v1/notes/route";
import { GET as noteGet } from "@/app/api/v1/notes/[slug]/route";
import { GET as projectsGet } from "@/app/api/v1/projects/route";
import {
  GET as catchAllGet,
  POST as catchAllPost,
} from "@/app/api/v1/[...path]/route";
import { NextRequest } from "next/server";

function req(path: string) {
  return new NextRequest(`http://localhost${path}`);
}

describe("/api/v1 routes", () => {
  it("search requires q and returns typed JSON", async () => {
    const missing = await searchGet(req("/api/v1/search"));
    expect(missing.status).toBe(400);
    expect(missing.headers.get("Content-Type")).toContain(
      "application/problem+json"
    );

    const ok = await searchGet(req("/api/v1/search?q=a"));
    expect(ok.status).toBe(200);
    const body = await ok.json();
    expect(body).toHaveProperty("results");
    expect(body).toHaveProperty("count");
    expect(body).toHaveProperty("query", "a");
  });

  it("lists notes and projects", async () => {
    const notes = await notesGet();
    expect(notes.status).toBe(200);
    const notesBody = await notes.json();
    expect(notesBody.notes.length).toBeGreaterThan(0);

    const projects = await projectsGet();
    expect(projects.status).toBe(200);
    const projectsBody = await projects.json();
    expect(projectsBody.projects.length).toBeGreaterThan(0);
  });

  it("returns problem+json for unknown note slugs", async () => {
    const response = await noteGet(req("/api/v1/notes/missing-slug-xyz"), {
      params: Promise.resolve({ slug: "missing-slug-xyz" }),
    });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.code).toBe("note_not_found");
  });

  it("returns problem+json for unknown v1 paths and wrong methods", async () => {
    const missing = await catchAllGet(req("/api/v1/does-not-exist"));
    expect(missing.status).toBe(404);
    expect((await missing.json()).code).toBe("api_route_not_found");

    const post = await catchAllPost(req("/api/v1/does-not-exist"));
    expect(post.status).toBe(405);
    expect((await post.json()).code).toBe("method_not_allowed");
  });
});
