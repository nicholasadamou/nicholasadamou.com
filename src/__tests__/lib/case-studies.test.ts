import { describe, expect, it } from "vitest";
import { clients } from "@/lib/content/clients";
import { getCaseStudy } from "@/lib/content/case-studies";
import { GET } from "@/app/api/markdown/clients/[slug]/route";
import sitemap from "@/app/sitemap";

describe("client case studies", () => {
  it.each(clients)(
    "publishes $name with substantive content and discovery",
    async ({ slug }) => {
      const study = getCaseStudy(slug)!;
      expect(study.content.split(/\s+/).length).toBeGreaterThan(500);
      expect(study.content).toContain("## Brand ideation");
      expect(study.content).toContain("## Codex and agentic use");
      expect(study.content.match(/```mermaid/g)).toHaveLength(1);
      expect(study.stack.length).toBeGreaterThan(3);
      expect(
        sitemap().some(({ url }) => url.endsWith(`/clients/${slug}`))
      ).toBe(true);
      const response = await GET(new Request("https://example.com"), {
        params: Promise.resolve({ slug }),
      });
      expect(response.headers.get("content-type")).toContain("text/markdown");
      expect(await response.text()).toContain(study.content);
    }
  );
  it("rejects unknown slugs and traversal without reading arbitrary files", async () => {
    expect(getCaseStudy("../notes")).toBeNull();
    const response = await GET(new Request("https://example.com"), {
      params: Promise.resolve({ slug: "missing" }),
    });
    expect(response.status).toBe(404);
  });
});
