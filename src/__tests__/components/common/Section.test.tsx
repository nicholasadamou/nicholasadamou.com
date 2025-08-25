import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Section from "@/components/common/Section";

describe("Section", () => {
  it("should render heading and children correctly", () => {
    render(
      <Section heading="Test Section">
        <p>Test content</p>
      </Section>
    );

    expect(screen.getByText("Test Section")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should generate correct ID from heading", () => {
    render(
      <Section heading="My Test Section">
        <div>Content</div>
      </Section>
    );

    const section = document.querySelector("section");
    expect(section).toHaveAttribute("id", "my-test-section");
  });

  it("should handle headings with special characters", () => {
    render(
      <Section heading="Test & Validate Section">
        <div>Content</div>
      </Section>
    );

    const section = document.querySelector("section");
    expect(section).toHaveAttribute("id", "test-&-validate-section");
  });

  it("should apply right alignment when specified", () => {
    render(
      <Section heading="Right Aligned" headingAlignment="right">
        <div>Content</div>
      </Section>
    );

    const heading = screen.getByText("Right Aligned");
    expect(heading).toHaveClass("md:text-right");
  });

  it("should not apply right alignment by default", () => {
    render(
      <Section heading="Default Aligned">
        <div>Content</div>
      </Section>
    );

    const heading = screen.getByText("Default Aligned");
    expect(heading).not.toHaveClass("md:text-right");
  });

  it("should show pin icon when showPin is true and isPinned is true", () => {
    render(
      <Section heading="Pinned Section" showPin={true} isPinned={true}>
        <div>Content</div>
      </Section>
    );

    expect(screen.getByText("(Pinned)")).toBeInTheDocument();
    // The (Pinned) text is inside a div with inline-flex class
    const pinnedDiv = screen.getByText("(Pinned)").closest("div");
    expect(pinnedDiv).toHaveClass("inline-flex");
  });

  it("should not show pin icon when showPin is false", () => {
    render(
      <Section heading="Section" showPin={false} isPinned={true}>
        <div>Content</div>
      </Section>
    );

    expect(screen.queryByText("(Pinned)")).not.toBeInTheDocument();
  });

  it("should not show pin icon when isPinned is false", () => {
    render(
      <Section heading="Section" showPin={true} isPinned={false}>
        <div>Content</div>
      </Section>
    );

    expect(screen.queryByText("(Pinned)")).not.toBeInTheDocument();
  });

  it("should hide pin icon by default when showPin is default", () => {
    render(
      <Section heading="Section" isPinned={true}>
        <div>Content</div>
      </Section>
    );

    // showPin defaults to true, so pin should show
    expect(screen.getByText("(Pinned)")).toBeInTheDocument();
  });

  it("should apply inverted styles when invert is true", () => {
    render(
      <Section heading="Inverted Section" invert={true}>
        <div>Content</div>
      </Section>
    );

    const heading = screen.getByText("Inverted Section");
    expect(heading).toHaveClass("font-medium");
    expect(heading).toHaveClass("text-primary");
  });

  it("should apply normal styles when invert is false", () => {
    render(
      <Section heading="Normal Section" invert={false}>
        <div>Content</div>
      </Section>
    );

    const heading = screen.getByText("Normal Section");
    expect(heading).not.toHaveClass("font-medium");
    expect(heading).toHaveClass("text-secondary");
  });

  it("should apply normal styles by default", () => {
    render(
      <Section heading="Default Section">
        <div>Content</div>
      </Section>
    );

    const heading = screen.getByText("Default Section");
    expect(heading).toHaveClass("text-secondary");
    expect(heading).not.toHaveClass("font-medium");
  });

  it("should have correct base classes", () => {
    render(
      <Section heading="Test">
        <div>Content</div>
      </Section>
    );

    const section = document.querySelector("section");
    expect(section).toHaveClass("col-reverse");
    expect(section).toHaveClass("flex");
    expect(section).toHaveClass("flex-col");
    expect(section).toHaveClass("gap-0");
    expect(section).toHaveClass("md:flex-row");
    expect(section).toHaveClass("md:gap-2");
  });

  it("should render multiple children correctly", () => {
    render(
      <Section heading="Multi-child Section">
        <div>First child</div>
        <div>Second child</div>
        <p>Third child</p>
      </Section>
    );

    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
    expect(screen.getByText("Third child")).toBeInTheDocument();
  });

  it("should handle combination of props correctly", () => {
    render(
      <Section
        heading="Complex Section"
        headingAlignment="right"
        showPin={true}
        isPinned={true}
        invert={true}
      >
        <div>Complex content</div>
      </Section>
    );

    const heading = screen.getByText("Complex Section");
    expect(heading).toHaveClass("md:text-right");
    expect(heading).toHaveClass("font-medium");
    expect(heading).toHaveClass("text-primary");

    expect(screen.getByText("(Pinned)")).toBeInTheDocument();

    const section = document.querySelector("section");
    expect(section).toHaveAttribute("id", "complex-section");
  });

  it("should handle empty heading correctly", () => {
    render(
      <Section heading="">
        <div>Content with empty heading</div>
      </Section>
    );

    const section = document.querySelector("section");
    expect(section).toHaveAttribute("id", "");
    expect(screen.getByText("Content with empty heading")).toBeInTheDocument();
  });

  it("should maintain accessibility with proper heading structure", () => {
    render(
      <Section heading="Accessible Section">
        <div>Accessible content</div>
      </Section>
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Accessible Section");

    const section = document.querySelector("section");
    expect(section).toBeVisible();
  });
});
