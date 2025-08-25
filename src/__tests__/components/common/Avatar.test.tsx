import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "@/components/common/Avatar";

describe("Avatar", () => {
  describe("Size variants", () => {
    it("should render small avatar with correct classes", () => {
      render(<Avatar size="sm" initials="JD" />);

      const avatar = screen.getByText("JD").parentElement;
      expect(avatar).toHaveClass("h-10", "w-10", "bg-tertiary", "text-sm");
    });

    it("should render medium avatar with correct classes", () => {
      render(<Avatar size="md" initials="JD" />);

      const avatar = screen.getByText("JD").parentElement;
      expect(avatar).toHaveClass("h-14", "w-14", "bg-tertiary", "text-base");
    });

    it("should render large avatar with correct classes", () => {
      render(<Avatar size="lg" initials="JD" />);

      const avatar = screen.getByText("JD").parentElement;
      expect(avatar).toHaveClass("h-24", "w-24", "bg-secondary", "text-2xl");
    });

    it("should default to small size when no size is provided", () => {
      render(<Avatar initials="JD" />);

      const avatar = screen.getByText("JD").parentElement;
      expect(avatar).toHaveClass("h-10", "w-10", "bg-tertiary", "text-sm");
    });
  });

  describe("Initials display", () => {
    it("should display initials when no src is provided", () => {
      render(<Avatar initials="John Doe" />);

      expect(screen.getByText("Jo")).toBeInTheDocument();
    });

    it("should truncate initials to 2 characters", () => {
      render(<Avatar initials="ABCDEF" />);

      expect(screen.getByText("AB")).toBeInTheDocument();
      expect(screen.queryByText("ABCDEF")).not.toBeInTheDocument();
    });

    it("should handle single character initials", () => {
      render(<Avatar initials="A" />);

      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should handle empty initials", () => {
      render(<Avatar initials="" data-testid="empty-avatar" />);

      const avatar = screen.getByTestId("empty-avatar");
      expect(avatar.querySelector("div")).toHaveTextContent("");
    });

    it("should handle null initials", () => {
      render(<Avatar initials={null} data-testid="null-avatar" />);

      const avatar = screen.getByTestId("null-avatar");
      expect(avatar.querySelector("div")).toHaveTextContent("");
    });

    it("should handle undefined initials", () => {
      render(<Avatar data-testid="undefined-avatar" />);

      const avatar = screen.getByTestId("undefined-avatar");
      expect(avatar.querySelector("div")).toHaveTextContent("");
    });
  });

  describe("Image display", () => {
    it("should render image when src is provided", () => {
      render(<Avatar src="/avatar.jpg" alt="User avatar" initials="JD" />);

      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        expect.stringContaining("avatar.jpg")
      );
      expect(image).toHaveAttribute("alt", "User avatar");
      expect(screen.queryByText("JD")).not.toBeInTheDocument();
    });

    it("should fall back to initials when src is empty string", () => {
      render(<Avatar src="" initials="JD" />);

      expect(screen.getByText("JD")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should fall back to initials when src is undefined", () => {
      render(<Avatar src={undefined} initials="JD" />);

      expect(screen.getByText("JD")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should use empty alt text when not provided", () => {
      const { container } = render(<Avatar src="/avatar.jpg" />);

      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("alt", "");
    });

    it("should apply correct sizes attribute for small avatar", () => {
      const { container } = render(<Avatar src="/avatar.jpg" size="sm" />);

      const image = container.querySelector("img");
      expect(image).toHaveAttribute(
        "sizes",
        "(max-width: 640px) 2.5rem, (max-width: 768px) 2.5rem, 2.5rem"
      );
    });

    it("should apply correct sizes attribute for medium avatar", () => {
      const { container } = render(<Avatar src="/avatar.jpg" size="md" />);

      const image = container.querySelector("img");
      expect(image).toHaveAttribute(
        "sizes",
        "(max-width: 640px) 3.5rem, (max-width: 768px) 3.5rem, 3.5rem"
      );
    });

    it("should apply correct sizes attribute for large avatar", () => {
      const { container } = render(<Avatar src="/avatar.jpg" size="lg" />);

      const image = container.querySelector("img");
      expect(image).toHaveAttribute(
        "sizes",
        "(max-width: 640px) 6rem, (max-width: 768px) 6rem, 6rem"
      );
    });

    it("should apply object-cover class to image", () => {
      const { container } = render(<Avatar src="/avatar.jpg" />);

      const image = container.querySelector("img");
      expect(image).toHaveClass("object-cover");
    });
  });

  describe("Common styles", () => {
    it("should apply base classes to avatar container", () => {
      render(<Avatar initials="JD" />);

      const avatar = screen.getByText("JD").parentElement;
      expect(avatar).toHaveClass(
        "relative",
        "inline-flex",
        "select-none",
        "items-center",
        "justify-center",
        "overflow-hidden",
        "rounded-full",
        "align-middle",
        "font-medium",
        "uppercase",
        "text-primary"
      );
    });

    it("should render initials in uppercase", () => {
      render(<Avatar initials="jd" />);

      const avatar = screen.getByText("jd").parentElement;
      expect(avatar).toHaveClass("uppercase");
      expect(screen.getByText("jd")).toBeInTheDocument();
    });
  });

  describe("Combined scenarios", () => {
    it("should prioritize image over initials when both are provided", () => {
      render(
        <Avatar src="/avatar.jpg" initials="JD" alt="John Doe" size="md" />
      );

      expect(screen.getByRole("img")).toBeInTheDocument();
      expect(screen.queryByText("JD")).not.toBeInTheDocument();
    });

    it("should handle StaticImageData src type", () => {
      const staticImage = {
        src: "/static-avatar.jpg",
        height: 100,
        width: 100,
        blurDataURL: "data:image/jpeg;base64,...",
      };

      render(<Avatar src={staticImage} alt="Static avatar" />);

      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("alt", "Static avatar");
    });

    it("should work with all props undefined", () => {
      render(<Avatar data-testid="undefined-props-avatar" />);

      const avatar = screen.getByTestId("undefined-props-avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass("h-10", "w-10"); // default small size
    });
  });

  describe("Accessibility", () => {
    it("should be accessible when using image", () => {
      render(<Avatar src="/avatar.jpg" alt="John Doe's profile picture" />);

      const image = screen.getByRole("img");
      expect(image).toHaveAccessibleName("John Doe's profile picture");
    });

    it("should handle missing alt text gracefully", () => {
      const { container } = render(<Avatar src="/avatar.jpg" />);

      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("alt", "");
    });
  });
});
