import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextElement } from "@/app/api/og/components/TextElement";

describe("TextElement", () => {
  it("renders text content", () => {
    render(
      <TextElement
        text="Hello World"
        styles={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}
      />
    );
    expect(screen.getByText("Hello World")).toBeDefined();
  });

  it("applies styles", () => {
    const { container } = render(
      <TextElement
        text="Styled"
        styles={{ fontSize: "48px", fontWeight: "800", color: "#fafaf9" }}
      />
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.fontSize).toBe("48px");
    expect(div.style.fontWeight).toBe("800");
    expect(div.style.color).toBeTruthy();
  });

  it("renders null/undefined gracefully", () => {
    const { container } = render(
      <TextElement
        text={null}
        styles={{ fontSize: "16px", fontWeight: "400", color: "#000" }}
      />
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it("renders numbers", () => {
    render(
      <TextElement
        text={42}
        styles={{ fontSize: "16px", fontWeight: "400", color: "#000" }}
      />
    );
    expect(screen.getByText("42")).toBeDefined();
  });
});
