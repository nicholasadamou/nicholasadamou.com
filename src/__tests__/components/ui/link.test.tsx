import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "@/components/ui/link";

describe("UI Link Component", () => {
  it("should render with default variant and size", () => {
    render(<Link href="/test">Default Link</Link>);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("bg-primary");
    expect(link).toHaveClass("h-10");
    expect(link).toHaveClass("px-4");
  });

  it("should apply different variants correctly", () => {
    const variants = [
      { variant: "default" as const, expectedClass: "bg-primary" },
      { variant: "destructive" as const, expectedClass: "bg-destructive" },
      { variant: "outline" as const, expectedClass: "border" },
      { variant: "secondary" as const, expectedClass: "bg-tertiary" },
      { variant: "ghost" as const, expectedClass: "hover:bg-accent" },
      { variant: "link" as const, expectedClass: "underline-offset-4" },
    ];

    variants.forEach(({ variant, expectedClass }) => {
      const { rerender } = render(
        <Link href="/test" variant={variant}>
          {variant} Link
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass(expectedClass);

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it("should apply different sizes correctly", () => {
    const sizes = [
      { size: "default" as const, expectedClass: "h-10" },
      { size: "sm" as const, expectedClass: "h-9" },
      { size: "lg" as const, expectedClass: "h-11" },
      { size: "icon" as const, expectedClass: "h-10 w-10" },
    ];

    sizes.forEach(({ size, expectedClass }) => {
      const { rerender } = render(
        <Link href="/test" size={size}>
          {size} Link
        </Link>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass(expectedClass);

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it("should handle external prop correctly", () => {
    render(
      <Link href="https://example.com" external>
        External Link
      </Link>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should not set target and rel when external is false", () => {
    render(
      <Link href="/internal" external={false}>
        Internal Link
      </Link>
    );

    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("should apply custom className along with variant classes", () => {
    render(
      <Link href="/test" variant="secondary" className="custom-class">
        Custom Link
      </Link>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
    expect(link).toHaveClass("bg-tertiary"); // from secondary variant
  });

  it("should handle asChild prop with Slot", () => {
    render(
      <Link asChild href="/test">
        <button type="button">Button as Link</button>
      </Link>
    );

    // When asChild is true, it should render the child element
    const element = screen.getByRole("button");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("href", "/test");
  });

  it("should render as anchor element by default", () => {
    render(<Link href="/test">Normal Link</Link>);

    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/test");
  });

  it("should forward ref correctly", () => {
    const ref = { current: null };

    render(
      <Link href="/test" ref={ref as any}>
        Ref Link
      </Link>
    );

    expect(ref.current).toBeTruthy();
  });

  it("should have focus-visible styling", () => {
    render(<Link href="/test">Focusable Link</Link>);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("focus-visible:outline-none");
    expect(link).toHaveClass("focus-visible:ring-2");
  });

  it("should handle disabled state", () => {
    render(
      <Link
        href="/test"
        className="disabled:pointer-events-none disabled:opacity-50"
      >
        Potentially Disabled Link
      </Link>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("disabled:pointer-events-none");
    expect(link).toHaveClass("disabled:opacity-50");
  });

  it("should handle combination of props", () => {
    render(
      <Link
        href="https://example.com"
        variant="outline"
        size="lg"
        external
        className="border-red-500"
      >
        Complex Link
      </Link>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("border"); // from outline variant
    expect(link).toHaveClass("h-11"); // from lg size
    expect(link).toHaveClass("border-red-500"); // custom class
    expect(link).toHaveAttribute("target", "_blank"); // from external
    expect(link).toHaveAttribute("rel", "noopener noreferrer"); // from external
  });

  it("should maintain accessibility attributes", () => {
    render(
      <Link href="/test" aria-label="Test accessibility" role="link">
        Accessible Link
      </Link>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Test accessibility");
    expect(link).toBeVisible();
  });
});
