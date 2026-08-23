import { describe, it, expect } from "vitest";
import { getAboutMarkdown } from "@/lib/markdown/pages";

describe("getAboutMarkdown", () => {
  it("includes a Developer Resources section with absolute links", () => {
    const markdown = getAboutMarkdown();

    expect(markdown).toContain("## Developer Resources");
    expect(markdown).toMatch(/\[Projects\]\(https?:\/\/[^)]+\/projects\)/);
    expect(markdown).toMatch(/\[Notes\]\(https?:\/\/[^)]+\/notes\)/);
    expect(markdown).toContain("[GitHub](https://github.com/nicholasadamou)");
  });
});
