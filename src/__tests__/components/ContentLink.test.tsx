import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentLink } from "@/components/ui/ContentLink";

describe("content link navigation", () => {
  it.each([
    "https://example.com",
    "//example.com",
    "https://nicholasadamou.com.evil.test",
  ])("opens %s safely in a new tab", (href) => {
    render(<ContentLink href={href}>Read more</ContentLink>);
    const link = screen.getByRole("link");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
  it.each([
    "/notes",
    "#heading",
    "https://nicholasadamou.com/about",
    "mailto:test@example.com",
  ])("preserves normal navigation for %s", (href) => {
    render(<ContentLink href={href}>Read more</ContentLink>);
    expect(screen.getByRole("link").getAttribute("target")).toBeNull();
  });
});
