import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectIcon } from "@/lib/projects/icons";

describe("ProjectIcon", () => {
  it("renders image icon", () => {
    render(
      <ProjectIcon icon={{ kind: "image", src: "/icon.png" }} name="Test" />
    );
    const img = screen.getByAltText("Test");
    expect(img).toBeDefined();
  });

  it("renders emoji icon", () => {
    render(<ProjectIcon icon={{ kind: "emoji", emoji: "🔥" }} name="Fire" />);
    expect(screen.getByText("🔥")).toBeDefined();
  });

  it("renders component icon for known IDs", () => {
    const { container } = render(
      <ProjectIcon icon={{ kind: "component", id: "youbuildit" }} name="YBI" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders null for unknown component ID", () => {
    const { container } = render(
      <ProjectIcon icon={{ kind: "component", id: "unknown" }} name="Unknown" />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders learn-git component icon", () => {
    const { container } = render(
      <ProjectIcon icon={{ kind: "component", id: "learn-git" }} name="LG" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders nextjs component icon", () => {
    const { container } = render(
      <ProjectIcon icon={{ kind: "component", id: "nextjs" }} name="Next" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });
});
