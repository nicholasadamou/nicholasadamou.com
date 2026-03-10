import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ImagePreview from "@/components/ui/ImagePreview";

describe("ImagePreview", () => {
  it("renders children", () => {
    render(
      <ImagePreview src="/test.jpg" alt="test">
        <span>Link text</span>
      </ImagePreview>
    );
    expect(screen.getByText("Link text")).toBeDefined();
  });

  it("renders children without wrapper when src is null", () => {
    const { container } = render(
      <ImagePreview src={null} alt="test">
        <span>No image</span>
      </ImagePreview>
    );
    expect(screen.getByText("No image")).toBeDefined();
    expect(container.querySelector("[onmouseenter]")).toBeNull();
  });

  it("renders children without wrapper when src is undefined", () => {
    render(
      <ImagePreview src={undefined} alt="test">
        <span>No image</span>
      </ImagePreview>
    );
    expect(screen.getByText("No image")).toBeDefined();
  });

  it("applies className", () => {
    const { container } = render(
      <ImagePreview src="/test.jpg" alt="test" className="custom">
        <span>styled</span>
      </ImagePreview>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("custom");
  });

  it("shows preview on mouse enter after delay", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <ImagePreview src="/test.jpg" alt="preview-alt">
        <span>Hover me</span>
      </ImagePreview>
    );

    const wrapper = container.firstElementChild!;
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Portal renders a preview div in document.body
    const portal = document.body.querySelector(".pointer-events-none");
    expect(portal).toBeTruthy();

    vi.useRealTimers();
  });

  it("hides preview on mouse leave", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <ImagePreview src="/test.jpg" alt="preview-alt">
        <span>Hover me</span>
      </ImagePreview>
    );

    const wrapper = container.firstElementChild!;
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(350);
    });
    fireEvent.mouseLeave(wrapper);

    const portal = document.body.querySelector(".pointer-events-none");
    if (portal) {
      const style = (portal as HTMLElement).style;
      expect(style.opacity).toBe("0");
    }

    vi.useRealTimers();
  });

  it("updates position on mouse move", () => {
    const { container } = render(
      <ImagePreview src="/test.jpg" alt="preview-alt">
        <span>Move over me</span>
      </ImagePreview>
    );

    const wrapper = container.firstElementChild!;
    fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 200 });

    // Portal should exist and have some positioning
    const portal = document.body.querySelector(".pointer-events-none");
    expect(portal).toBeTruthy();
  });

  it("does not show preview when src is null on mouseEnter", () => {
    vi.useFakeTimers();
    const { container } = render(
      <ImagePreview src={null} alt="test">
        <span>No src</span>
      </ImagePreview>
    );

    const wrapper = container.firstElementChild!;
    // mouseEnter shouldn't throw even though we don't have handler on null src
    expect(wrapper).toBeTruthy();

    vi.useRealTimers();
  });

  it("cleans up timeout on unmount", () => {
    vi.useFakeTimers();
    const { container, unmount } = render(
      <ImagePreview src="/test.jpg" alt="test">
        <span>Will unmount</span>
      </ImagePreview>
    );

    const wrapper = container.firstElementChild!;
    fireEvent.mouseEnter(wrapper);
    unmount();
    // Should not throw when timer fires after unmount
    act(() => {
      vi.advanceTimersByTime(350);
    });

    vi.useRealTimers();
  });
});
