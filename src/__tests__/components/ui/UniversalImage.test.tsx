import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UniversalImage from "@/components/ui/UniversalImage";

describe("UniversalImage", () => {
  it("renders an img when src is provided", () => {
    render(
      <UniversalImage
        src="/test.jpg"
        alt="Test image"
        width={100}
        height={100}
      />
    );
    const img = screen.getByAltText("Test image");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toBeTruthy();
  });

  it("renders placeholder div when src is empty", () => {
    const { container } = render(
      <UniversalImage src="" alt="empty" width={200} height={200} />
    );
    const placeholder = container.querySelector("div.flex");
    expect(placeholder).toBeTruthy();
  });

  it("applies className prop", () => {
    render(
      <UniversalImage
        src="/test.jpg"
        alt="styled"
        width={100}
        height={100}
        className="custom-class"
      />
    );
    const img = screen.getByAltText("styled");
    expect(img.className).toContain("custom-class");
  });

  it("passes priority prop", () => {
    render(
      <UniversalImage
        src="/test.jpg"
        alt="priority"
        width={100}
        height={100}
        priority
      />
    );
    const img = screen.getByAltText("priority");
    expect(img).toBeDefined();
  });
});
