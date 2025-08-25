import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React from "react";

describe("Card Components", () => {
  describe("Card", () => {
    it("should render with default classes", () => {
      render(<Card data-testid="card">Card content</Card>);

      const card = screen.getByTestId("card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        "bg-card",
        "text-card-foreground",
        "rounded-xl",
        "border",
        "shadow"
      );
    });

    it("should render children content", () => {
      render(<Card>Test card content</Card>);

      expect(screen.getByText("Test card content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("custom-class");
      expect(card).toHaveClass("bg-card"); // should still have default classes
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should pass through HTML attributes", () => {
      render(
        <Card
          id="card-id"
          data-testid="card"
          role="region"
          aria-label="Card region"
        >
          Content
        </Card>
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("id", "card-id");
      expect(card).toHaveAttribute("role", "region");
      expect(card).toHaveAttribute("aria-label", "Card region");
    });
  });

  describe("CardHeader", () => {
    it("should render with default classes", () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
    });

    it("should render children", () => {
      render(<CardHeader>Header text</CardHeader>);

      expect(screen.getByText("Header text")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <CardHeader className="custom-header" data-testid="header">
          Content
        </CardHeader>
      );

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("custom-header", "flex", "flex-col");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Content</CardHeader>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardTitle", () => {
    it("should render with default classes", () => {
      render(<CardTitle data-testid="title">Card Title</CardTitle>);

      const title = screen.getByTestId("title");
      expect(title).toHaveClass(
        "font-semibold",
        "leading-none",
        "tracking-tight"
      );
    });

    it("should render title text", () => {
      render(<CardTitle>My Card Title</CardTitle>);

      expect(screen.getByText("My Card Title")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <CardTitle className="text-lg" data-testid="title">
          Title
        </CardTitle>
      );

      const title = screen.getByTestId("title");
      expect(title).toHaveClass("text-lg", "font-semibold");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardTitle ref={ref}>Title</CardTitle>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardDescription", () => {
    it("should render with default classes", () => {
      render(
        <CardDescription data-testid="description">
          Description text
        </CardDescription>
      );

      const description = screen.getByTestId("description");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });

    it("should render description text", () => {
      render(<CardDescription>This is a description</CardDescription>);

      expect(screen.getByText("This is a description")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <CardDescription className="text-base" data-testid="description">
          Description
        </CardDescription>
      );

      const description = screen.getByTestId("description");
      expect(description).toHaveClass("text-base", "text-muted-foreground");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardDescription ref={ref}>Description</CardDescription>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardContent", () => {
    it("should render with default classes", () => {
      render(<CardContent data-testid="content">Content text</CardContent>);

      const content = screen.getByTestId("content");
      expect(content).toHaveClass("p-6", "pt-0");
    });

    it("should render content", () => {
      render(<CardContent>Main content here</CardContent>);

      expect(screen.getByText("Main content here")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <CardContent className="px-8" data-testid="content">
          Content
        </CardContent>
      );

      const content = screen.getByTestId("content");
      expect(content).toHaveClass("px-8", "p-6", "pt-0");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Content</CardContent>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardFooter", () => {
    it("should render with default classes", () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>);

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
    });

    it("should render footer content", () => {
      render(<CardFooter>Footer text</CardFooter>);

      expect(screen.getByText("Footer text")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <CardFooter className="justify-end" data-testid="footer">
          Footer
        </CardFooter>
      );

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("justify-end", "flex", "items-center");
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Card composition", () => {
    it("should render a complete card with all components", () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      // Check all parts are rendered
      expect(screen.getByText("Test Card")).toBeInTheDocument();
      expect(screen.getByText("This is a test card")).toBeInTheDocument();
      expect(
        screen.getByText("This is the main content of the card.")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action" })
      ).toBeInTheDocument();

      // Check structure
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-card", "rounded-xl", "border", "shadow");
    });

    it("should handle nested complex content", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>
              <span data-testid="title-icon">📝</span>
              <span>Complex Title</span>
            </CardTitle>
            <CardDescription>
              Description with <strong>bold text</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <h3>Subsection</h3>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );

      expect(screen.getByTestId("title-icon")).toBeInTheDocument();
      expect(screen.getByText("Complex Title")).toBeInTheDocument();
      expect(screen.getByText("bold text")).toBeInTheDocument();
      expect(screen.getByText("Subsection")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should work with minimal composition", () => {
      render(
        <Card>
          <CardContent>Simple card with just content</CardContent>
        </Card>
      );

      expect(
        screen.getByText("Simple card with just content")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should support ARIA attributes on all components", () => {
      render(
        <Card role="article" aria-labelledby="card-title" data-testid="card">
          <CardHeader>
            <CardTitle id="card-title" data-testid="title">
              Accessible Card
            </CardTitle>
            <CardDescription
              aria-describedby="card-content"
              data-testid="description"
            >
              Description
            </CardDescription>
          </CardHeader>
          <CardContent id="card-content" data-testid="content">
            Content
          </CardContent>
          <CardFooter role="contentinfo" data-testid="footer">
            Footer
          </CardFooter>
        </Card>
      );

      const card = screen.getByTestId("card");
      const title = screen.getByTestId("title");
      const description = screen.getByTestId("description");
      const content = screen.getByTestId("content");
      const footer = screen.getByTestId("footer");

      expect(card).toHaveAttribute("role", "article");
      expect(card).toHaveAttribute("aria-labelledby", "card-title");
      expect(title).toHaveAttribute("id", "card-title");
      expect(description).toHaveAttribute("aria-describedby", "card-content");
      expect(content).toHaveAttribute("id", "card-content");
      expect(footer).toHaveAttribute("role", "contentinfo");
    });
  });

  describe("Event handling", () => {
    it("should handle click events on card components", () => {
      const handleClick = vi.fn();

      render(
        <Card onClick={handleClick} data-testid="card">
          <CardHeader onClick={handleClick}>
            <CardTitle onClick={handleClick}>Title</CardTitle>
          </CardHeader>
        </Card>
      );

      const card = screen.getByTestId("card");
      card.click();

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
