import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImageElement } from "@/app/api/og/components/ImageElement";

describe("ImageElement", () => {
  it("renders image when imageSrc is provided", () => {
    render(
      <ImageElement imageSrc="data:image/png;base64,abc" altText="Test" />
    );
    const img = screen.getByAltText("Test");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toBe("data:image/png;base64,abc");
  });

  it("renders fallback emoji when no imageSrc", () => {
    render(<ImageElement />);
    expect(screen.getByText("📸")).toBeDefined();
  });

  it("renders with dark theme by default", () => {
    const { container } = render(<ImageElement imageSrc="/img.jpg" />);
    expect(container.querySelector("img")).toBeTruthy();
  });

  it("renders with light theme", () => {
    const { container } = render(<ImageElement theme="light" />);
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("uses empty string alt when altText is undefined", () => {
    render(<ImageElement imageSrc="/img.jpg" />);
    const img = screen.getByAltText("");
    expect(img).toBeDefined();
  });
});
