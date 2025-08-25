import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  describe("Default behavior", () => {
    it("should render with default classes", () => {
      render(<Badge data-testid="badge">Default Badge</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass(
        "inline-flex",
        "items-center",
        "rounded-md",
        "border",
        "px-2.5",
        "py-0.5",
        "text-xs",
        "font-semibold",
        "transition-colors",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-ring",
        "focus:ring-offset-2"
      );
    });

    it("should render children content", () => {
      render(<Badge>Test Badge</Badge>);

      expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("should use default variant when none specified", () => {
      render(<Badge data-testid="badge">Default</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass(
        "border-transparent",
        "bg-tertiary",
        "dark:bg-secondary",
        "text-primary-foreground",
        "shadow",
        "hover:bg-primary/80"
      );
    });
  });

  describe("Variants", () => {
    it("should render default variant correctly", () => {
      render(
        <Badge variant="default" data-testid="badge">
          Default
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass(
        "border-transparent",
        "bg-tertiary",
        "dark:bg-secondary",
        "text-primary-foreground",
        "shadow",
        "hover:bg-primary/80"
      );
    });

    it("should render secondary variant correctly", () => {
      render(
        <Badge variant="secondary" data-testid="badge">
          Secondary
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass(
        "border-transparent",
        "bg-tertiary",
        "dark:bg-secondary",
        "text-secondary-foreground",
        "hover:bg-secondary/80"
      );
    });

    it("should render destructive variant correctly", () => {
      render(
        <Badge variant="destructive" data-testid="badge">
          Destructive
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass(
        "border-transparent",
        "bg-destructive",
        "text-destructive-foreground",
        "shadow",
        "hover:bg-destructive/80"
      );
    });

    it("should render outline variant correctly", () => {
      render(
        <Badge variant="outline" data-testid="badge">
          Outline
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("text-foreground");
      // Outline variant only adds the text-foreground class
      expect(badge).not.toHaveClass("border-transparent");
    });
  });

  describe("Customization", () => {
    it("should apply custom className", () => {
      render(
        <Badge className="custom-class" data-testid="badge">
          Custom
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("custom-class");
      expect(badge).toHaveClass("inline-flex"); // should still have base classes
    });

    it("should override classes with custom className", () => {
      render(
        <Badge className="bg-red-500" data-testid="badge">
          Custom Background
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("bg-red-500");
    });

    it("should support multiple custom classes", () => {
      render(
        <Badge className="border-2 text-lg font-bold" data-testid="badge">
          Multiple Classes
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("text-lg", "font-bold", "border-2");
    });
  });

  describe("HTML attributes", () => {
    it("should pass through HTML attributes", () => {
      render(
        <Badge
          id="badge-id"
          data-testid="badge"
          aria-label="Status badge"
          role="status"
          title="Badge title"
        >
          Badge
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("id", "badge-id");
      expect(badge).toHaveAttribute("aria-label", "Status badge");
      expect(badge).toHaveAttribute("role", "status");
      expect(badge).toHaveAttribute("title", "Badge title");
    });

    it("should handle event handlers", async () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Badge
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          data-testid="badge"
        >
          Clickable
        </Badge>
      );

      const badge = screen.getByTestId("badge");

      // Use userEvent for more realistic interactions
      const userEvent = (await import("@testing-library/user-event")).default;
      const user = userEvent.setup();

      await user.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.hover(badge);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it("should render as a div element", () => {
      render(<Badge data-testid="badge">Badge</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge.tagName).toBe("DIV");
    });
  });

  describe("Content variations", () => {
    it("should render text content", () => {
      render(<Badge>Text Badge</Badge>);

      expect(screen.getByText("Text Badge")).toBeInTheDocument();
    });

    it("should render numeric content", () => {
      render(<Badge>42</Badge>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render complex JSX content", () => {
      render(
        <Badge data-testid="badge">
          <span data-testid="icon">🎉</span>
          <span>Success</span>
        </Badge>
      );

      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
    });

    it("should handle empty content", () => {
      render(<Badge data-testid="badge"></Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });
  });

  describe("Accessibility", () => {
    it("should be focusable when focusable attributes are provided", () => {
      render(
        <Badge tabIndex={0} data-testid="badge">
          Focusable Badge
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("tabIndex", "0");

      badge.focus();
      expect(badge).toHaveFocus();
    });

    it("should support ARIA attributes for status badges", () => {
      render(
        <Badge
          role="status"
          aria-live="polite"
          aria-label="5 new messages"
          data-testid="badge"
        >
          5
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("role", "status");
      expect(badge).toHaveAttribute("aria-live", "polite");
      expect(badge).toHaveAttribute("aria-label", "5 new messages");
    });

    it("should support screen reader text", () => {
      render(
        <Badge data-testid="badge">
          <span aria-hidden="true">!</span>
          <span className="sr-only">Warning</span>
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toContainHTML('<span aria-hidden="true">!</span>');
      expect(badge).toContainHTML('<span class="sr-only">Warning</span>');
    });
  });

  describe("Focus states", () => {
    it("should have proper focus ring classes", () => {
      render(<Badge data-testid="badge">Focusable</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass(
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-ring",
        "focus:ring-offset-2"
      );
    });
  });

  describe("Transition classes", () => {
    it("should have transition classes for smooth color changes", () => {
      render(<Badge data-testid="badge">Transition</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("transition-colors");
    });
  });

  describe("Variant combinations with custom classes", () => {
    it("should work correctly with secondary variant and custom classes", () => {
      render(
        <Badge variant="secondary" className="text-lg" data-testid="badge">
          Secondary Large
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("text-lg");
      expect(badge).toHaveClass("text-secondary-foreground");
    });

    it("should work correctly with destructive variant and custom classes", () => {
      render(
        <Badge
          variant="destructive"
          className="font-normal"
          data-testid="badge"
        >
          Destructive Normal
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("font-normal");
      expect(badge).toHaveClass("bg-destructive");
    });

    it("should work correctly with outline variant and custom classes", () => {
      render(
        <Badge
          variant="outline"
          className="border-blue-500"
          data-testid="badge"
        >
          Outline Blue
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveClass("border-blue-500");
      expect(badge).toHaveClass("text-foreground");
    });
  });

  describe("Real-world usage scenarios", () => {
    it("should work as a notification badge", () => {
      render(
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2"
          data-testid="notification"
        >
          3
        </Badge>
      );

      const badge = screen.getByTestId("notification");
      expect(badge).toHaveClass("absolute", "-top-2", "-right-2");
      expect(badge).toHaveClass("bg-destructive");
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should work as a status badge", () => {
      render(
        <Badge variant="secondary" role="status" data-testid="status">
          Online
        </Badge>
      );

      const badge = screen.getByTestId("status");
      expect(badge).toHaveAttribute("role", "status");
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("should work as a category tag", () => {
      render(
        <Badge variant="outline" className="mr-2" data-testid="category">
          JavaScript
        </Badge>
      );

      const badge = screen.getByTestId("category");
      expect(badge).toHaveClass("mr-2");
      expect(badge).toHaveClass("text-foreground");
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
    });
  });
});
