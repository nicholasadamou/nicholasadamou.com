import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OGLayout } from "@/app/api/og/components/OGLayout";

describe("OGLayout", () => {
  it("renders title", () => {
    render(
      <OGLayout title="Test Title" type="note" theme="dark" headerText="Note" />
    );
    expect(screen.getByText("Test Title")).toBeDefined();
  });

  it("renders header text", () => {
    render(
      <OGLayout title="Title" type="note" theme="dark" headerText="Note" />
    );
    expect(screen.getByText("Note")).toBeDefined();
  });

  it("renders description when provided", () => {
    render(
      <OGLayout
        title="Title"
        description="A description"
        type="note"
        theme="dark"
        headerText="Note"
      />
    );
    expect(screen.getByText("A description")).toBeDefined();
  });

  it("does not render description when not provided", () => {
    render(
      <OGLayout title="Title" type="note" theme="dark" headerText="Note" />
    );
    // Title and header should render, but no extra text for description
    expect(screen.getByText("Title")).toBeDefined();
    expect(screen.queryByText("A description")).toBeNull();
  });

  it("renders image when processedImage is provided", () => {
    render(
      <OGLayout
        title="Title"
        type="homepage"
        theme="dark"
        headerText="Software Engineer"
        processedImage="data:image/png;base64,abc"
      />
    );
    const img = screen.getByRole("img");
    expect(img).toBeDefined();
  });

  it("does not render image section when no processedImage", () => {
    const { container } = render(
      <OGLayout title="Title" type="note" theme="dark" headerText="Note" />
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders brand accent for homepage", () => {
    const { container } = render(
      <OGLayout
        title="Nicholas Adamou"
        type="homepage"
        theme="dark"
        headerText="Software Engineer"
      />
    );
    // Homepage layout should have more divs (brand accent)
    const divs = container.querySelectorAll("div");
    expect(divs.length).toBeGreaterThan(3);
  });
});
