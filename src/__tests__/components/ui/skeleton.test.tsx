import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  describe("Default behavior", () => {
    it("should render with default classes", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass(
        "bg-primary/10",
        "animate-pulse",
        "rounded-md"
      );
    });

    it("should render as a div element", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton.tagName).toBe("DIV");
    });

    it("should be empty by default", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toBeEmptyDOMElement();
    });
  });

  describe("Customization", () => {
    it("should apply custom className", () => {
      render(<Skeleton className="h-6 w-24" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("w-24", "h-6");
      expect(skeleton).toHaveClass("bg-primary/10"); // should still have default classes
    });

    it("should override default classes with custom classes", () => {
      render(<Skeleton className="bg-gray-300" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("bg-gray-300");
    });

    it("should support multiple custom classes", () => {
      render(
        <Skeleton
          className="h-4 w-full rounded-full bg-slate-200"
          data-testid="skeleton"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass(
        "w-full",
        "h-4",
        "bg-slate-200",
        "rounded-full"
      );
    });

    it("should combine default and custom classes correctly", () => {
      render(<Skeleton className="my-custom-class" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass(
        "bg-primary/10",
        "animate-pulse",
        "rounded-md",
        "my-custom-class"
      );
    });
  });

  describe("HTML attributes", () => {
    it("should pass through HTML attributes", () => {
      render(
        <Skeleton
          id="skeleton-id"
          data-testid="skeleton"
          role="status"
          aria-label="Loading content"
          title="Content is loading"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("id", "skeleton-id");
      expect(skeleton).toHaveAttribute("role", "status");
      expect(skeleton).toHaveAttribute("aria-label", "Loading content");
      expect(skeleton).toHaveAttribute("title", "Content is loading");
    });

    it("should handle style attribute", () => {
      render(
        <Skeleton
          style={{ width: "200px", height: "20px" }}
          data-testid="skeleton"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveStyle({ width: "200px", height: "20px" });
    });

    it("should handle data attributes", () => {
      render(
        <Skeleton
          data-testid="skeleton"
          data-component="skeleton"
          data-loading="true"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("data-component", "skeleton");
      expect(skeleton).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Content and children", () => {
    it("should render children when provided", () => {
      render(
        <Skeleton data-testid="skeleton">
          <span data-testid="child">Loading...</span>
        </Skeleton>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render text content", () => {
      render(<Skeleton data-testid="skeleton">Loading...</Skeleton>);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render complex children", () => {
      render(
        <Skeleton data-testid="skeleton">
          <div className="space-y-2">
            <div className="h-4 rounded bg-gray-300"></div>
            <div className="h-4 w-3/4 rounded bg-gray-300"></div>
          </div>
        </Skeleton>
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton.querySelector(".space-y-2")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should support role='status' for loading states", () => {
      render(
        <Skeleton
          role="status"
          aria-label="Content loading"
          data-testid="skeleton"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("role", "status");
      expect(skeleton).toHaveAttribute("aria-label", "Content loading");
    });

    it("should support aria-busy attribute", () => {
      render(
        <Skeleton aria-busy="true" aria-live="polite" data-testid="skeleton" />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("aria-busy", "true");
      expect(skeleton).toHaveAttribute("aria-live", "polite");
    });

    it("should support screen reader text", () => {
      render(
        <Skeleton data-testid="skeleton">
          <span className="sr-only">Loading content, please wait</span>
        </Skeleton>
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toContainHTML(
        '<span class="sr-only">Loading content, please wait</span>'
      );
    });

    it("should be accessible with proper ARIA attributes", () => {
      render(
        <Skeleton
          role="status"
          aria-label="Loading user profile"
          aria-busy="true"
          data-testid="skeleton"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAccessibleName("Loading user profile");
    });
  });

  describe("Animation classes", () => {
    it("should have pulse animation by default", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("animate-pulse");
    });

    it("should allow custom animation override", () => {
      render(<Skeleton className="animate-bounce" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("animate-bounce");
    });

    it("should allow removing animation", () => {
      render(<Skeleton className="animate-none" data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("animate-none");
    });
  });

  describe("Common skeleton patterns", () => {
    it("should work as a text line skeleton", () => {
      render(<Skeleton className="h-4 w-full" data-testid="text-skeleton" />);

      const skeleton = screen.getByTestId("text-skeleton");
      expect(skeleton).toHaveClass("h-4", "w-full");
    });

    it("should work as a circular skeleton (avatar)", () => {
      render(
        <Skeleton
          className="h-12 w-12 rounded-full"
          data-testid="avatar-skeleton"
        />
      );

      const skeleton = screen.getByTestId("avatar-skeleton");
      expect(skeleton).toHaveClass("h-12", "w-12", "rounded-full");
    });

    it("should work as a card skeleton", () => {
      render(
        <Skeleton
          className="h-48 w-full rounded-lg"
          data-testid="card-skeleton"
        />
      );

      const skeleton = screen.getByTestId("card-skeleton");
      expect(skeleton).toHaveClass("h-48", "w-full", "rounded-lg");
    });

    it("should work as a button skeleton", () => {
      render(
        <Skeleton
          className="h-10 w-24 rounded-md"
          data-testid="button-skeleton"
        />
      );

      const skeleton = screen.getByTestId("button-skeleton");
      expect(skeleton).toHaveClass("h-10", "w-24", "rounded-md");
    });
  });

  describe("Multiple skeleton composition", () => {
    it("should work with multiple skeletons", () => {
      render(
        <div data-testid="skeleton-group">
          <Skeleton className="mb-2 h-4 w-full" data-testid="skeleton-1" />
          <Skeleton className="mb-2 h-4 w-3/4" data-testid="skeleton-2" />
          <Skeleton className="h-4 w-1/2" data-testid="skeleton-3" />
        </div>
      );

      expect(screen.getByTestId("skeleton-1")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-2")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-3")).toBeInTheDocument();

      // Each should have their own styling
      expect(screen.getByTestId("skeleton-1")).toHaveClass("w-full");
      expect(screen.getByTestId("skeleton-2")).toHaveClass("w-3/4");
      expect(screen.getByTestId("skeleton-3")).toHaveClass("w-1/2");
    });

    it("should work in complex layouts", () => {
      render(
        <div className="space-y-4" data-testid="complex-skeleton">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" data-testid="avatar" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" data-testid="name" />
              <Skeleton className="h-4 w-24" data-testid="email" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" data-testid="content-1" />
            <Skeleton className="h-4 w-full" data-testid="content-2" />
            <Skeleton className="h-4 w-2/3" data-testid="content-3" />
          </div>
        </div>
      );

      expect(screen.getByTestId("avatar")).toHaveClass("rounded-full");
      expect(screen.getByTestId("name")).toHaveClass("w-40");
      expect(screen.getByTestId("content-3")).toHaveClass("w-2/3");
    });
  });

  describe("Event handling", () => {
    it("should handle click events when clickable", () => {
      const handleClick = vi.fn();

      render(
        <Skeleton
          onClick={handleClick}
          className="cursor-pointer"
          data-testid="skeleton"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      skeleton.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle other event handlers", async () => {
      const handleMouseEnter = vi.fn();
      const handleMouseLeave = vi.fn();

      render(
        <Skeleton
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-testid="skeleton"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      const user = (await import("@testing-library/user-event")).default;

      await user.hover(skeleton);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      await user.unhover(skeleton);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe("Responsive behavior", () => {
    it("should support responsive classes", () => {
      render(
        <Skeleton
          className="h-4 w-full sm:h-6 md:h-8 lg:h-10"
          data-testid="skeleton"
        />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass(
        "w-full",
        "h-4",
        "sm:h-6",
        "md:h-8",
        "lg:h-10"
      );
    });
  });
});
