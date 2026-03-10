import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { YouTubeEmbed } from "@/components/mdx/YouTubeEmbed";

describe("YouTubeEmbed", () => {
  it("renders iframe with correct src", () => {
    const { container } = render(
      <YouTubeEmbed url="https://www.youtube.com/embed/test123" />
    );
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute("src")).toBe(
      "https://www.youtube.com/embed/test123"
    );
  });

  it("has correct title", () => {
    const { container } = render(
      <YouTubeEmbed url="https://www.youtube.com/embed/test123" />
    );
    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("title")).toBe("YouTube video");
  });

  it("allows fullscreen", () => {
    const { container } = render(
      <YouTubeEmbed url="https://www.youtube.com/embed/test123" />
    );
    const iframe = container.querySelector("iframe");
    expect(iframe?.hasAttribute("allowfullscreen")).toBe(true);
  });

  it("applies inline class when inline prop is true", () => {
    const { container } = render(
      <YouTubeEmbed url="https://www.youtube.com/embed/test123" inline />
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("my-4");
  });

  it("applies default class when inline is not set", () => {
    const { container } = render(
      <YouTubeEmbed url="https://www.youtube.com/embed/test123" />
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("my-8");
  });
});
