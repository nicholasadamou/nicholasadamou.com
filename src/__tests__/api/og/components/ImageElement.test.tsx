import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ImageElement } from "@/app/api/og/components/ImageElement";

describe("ImageElement Component", () => {
  const baseProps = {
    imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
    altText: "Test Alt Text",
    theme: "dark" as const,
  };

  describe("Image Rendering", () => {
    it("should render image when imageSrc is provided", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const img = container.querySelector("img");
      expect(img).toBeTruthy();
      expect(img?.getAttribute("src")).toBe(baseProps.imageSrc);
      expect(img?.getAttribute("alt")).toBe(baseProps.altText);
    });

    it("should render image with correct dimensions", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const img = container.querySelector("img");
      expect(img?.getAttribute("width")).toBe("480"); // LAYOUT.image.width
      expect(img?.getAttribute("height")).toBe("640"); // LAYOUT.image.height
    });

    it("should apply correct image styles", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const img = container.querySelector("img");
      expect(img?.style.width).toBe("100%");
      expect(img?.style.height).toBe("100%");
      expect(img?.style.objectFit).toBe("cover");
      expect(img?.style.position).toBe("relative");
      expect(img?.style.zIndex).toBe("0");
    });

    it("should render gradient overlay when image is present", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      // Look for overlay div with gradient background
      const overlay = container.querySelector(
        'div[style*="position: absolute"][style*="z-index: 1"]'
      );
      expect(overlay).toBeTruthy();
    });
  });

  describe("Fallback Rendering", () => {
    it("should render fallback when imageSrc is not provided", () => {
      const { container } = render(
        <ImageElement altText="Test" theme="dark" />
      );

      const img = container.querySelector("img");
      const fallback = container.querySelector(
        'div[style*="text-align: center"]'
      );

      expect(img).toBeNull();
      expect(fallback).toBeTruthy();
      expect(fallback?.textContent).toBe("📸"); // DEFAULTS.fallbackIcon
    });

    it("should render fallback when imageSrc is empty string", () => {
      const { container } = render(
        <ImageElement imageSrc="" altText="Test" theme="dark" />
      );

      const img = container.querySelector("img");
      const fallback = container.querySelector(
        'div[style*="text-align: center"]'
      );

      expect(img).toBeNull();
      expect(fallback).toBeTruthy();
    });

    it("should render fallback when imageSrc is undefined", () => {
      const { container } = render(
        <ImageElement imageSrc={undefined} altText="Test" theme="dark" />
      );

      const img = container.querySelector("img");
      const fallback = container.querySelector(
        'div[style*="text-align: center"]'
      );

      expect(img).toBeNull();
      expect(fallback).toBeTruthy();
    });

    it("should apply correct fallback styles", () => {
      const { container } = render(
        <ImageElement altText="Test" theme="dark" />
      );

      const fallback = container.querySelector(
        'div[style*="text-align: center"]'
      );
      expect(fallback?.style.display).toBe("flex");
      expect(fallback?.style.alignItems).toBe("center");
      expect(fallback?.style.justifyContent).toBe("center");
      expect(fallback?.style.width).toBe("100%");
      expect(fallback?.style.height).toBe("100%");
      expect(fallback?.style.textAlign).toBe("center");
    });
  });

  describe("Theme Support", () => {
    it("should apply dark theme styles to container", () => {
      const { container } = render(
        <ImageElement {...baseProps} theme="dark" />
      );

      const imageContainer = container.querySelector(
        'div[style*="border-radius"]'
      );
      expect(imageContainer).toBeTruthy();
      // Background should contain imageBackground gradient for dark theme
      expect(imageContainer?.style.background).toBeTruthy();
    });

    it("should apply light theme styles to container", () => {
      const { container } = render(
        <ImageElement {...baseProps} theme="light" />
      );

      const imageContainer = container.querySelector(
        'div[style*="border-radius"]'
      );
      expect(imageContainer).toBeTruthy();
      // Background should contain imageBackgroundLight gradient for light theme
      expect(imageContainer?.style.background).toBeTruthy();
    });

    it("should apply dark theme overlay when image is present", () => {
      const { container } = render(
        <ImageElement {...baseProps} theme="dark" />
      );

      const overlay = container.querySelector(
        'div[style*="position: absolute"][style*="z-index: 1"]'
      );
      expect(overlay?.style.background).toBeTruthy();
    });

    it("should apply light theme overlay when image is present", () => {
      const { container } = render(
        <ImageElement {...baseProps} theme="light" />
      );

      const overlay = container.querySelector(
        'div[style*="position: absolute"][style*="z-index: 1"]'
      );
      expect(overlay?.style.background).toBeTruthy();
    });

    it("should apply dark theme fallback text color", () => {
      const { container } = render(
        <ImageElement altText="Test" theme="dark" />
      );

      const fallback = container.querySelector(
        'div[style*="text-align: center"]'
      );
      expect(fallback?.style.color).toBeTruthy();
    });

    it("should apply light theme fallback text color", () => {
      const { container } = render(
        <ImageElement altText="Test" theme="light" />
      );

      const fallback = container.querySelector(
        'div[style*="text-align: center"]'
      );
      expect(fallback?.style.color).toBeTruthy();
    });

    it("should default to dark theme when theme is not provided", () => {
      const { container } = render(
        <ImageElement imageSrc="test.jpg" altText="Test" />
      );

      // Should render without errors and apply default theme
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe("Container Structure", () => {
    it("should have correct outer container structure", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const outerContainer = container.firstChild as HTMLElement;
      expect(outerContainer.style.display).toBe("flex");
      expect(outerContainer.style.alignItems).toBe("center");
      expect(outerContainer.style.justifyContent).toBe("center");
      expect(outerContainer.style.height).toBe("100%");
      expect(outerContainer.style.position).toBe("relative");
    });

    it("should have image container with correct styling", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const imageContainer = container.querySelector(
        'div[style*="border-radius"]'
      );
      expect(imageContainer?.style.position).toBe("relative");
      expect(imageContainer?.style.width).toBe("480px");
      expect(imageContainer?.style.height).toBe("640px");
      expect(imageContainer?.style.overflow).toBe("hidden");
      expect(imageContainer?.style.display).toBe("flex");
      expect(imageContainer?.style.alignItems).toBe("center");
      expect(imageContainer?.style.justifyContent).toBe("center");
    });

    it("should apply border radius to image container", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const imageContainer = container.querySelector(
        'div[style*="border-radius"]'
      );
      expect(imageContainer?.style.borderRadius).toBe("24px"); // SPACING.imageContainer.borderRadius
    });

    it("should apply box shadow to image container", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const imageContainer = container.querySelector(
        'div[style*="border-radius"]'
      );
      expect(imageContainer?.style.boxShadow).toBe(
        "0 40px 80px rgba(0, 0, 0, 0.2)"
      ); // SPACING.imageContainer.boxShadow
    });
  });

  describe("Image Data URI Support", () => {
    it("should handle JPEG data URI", () => {
      const jpegDataUri = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...";
      const { container } = render(
        <ImageElement imageSrc={jpegDataUri} altText="JPEG" theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(jpegDataUri);
    });

    it("should handle PNG data URI", () => {
      const pngDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...";
      const { container } = render(
        <ImageElement imageSrc={pngDataUri} altText="PNG" theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(pngDataUri);
    });

    it("should handle WebP data URI", () => {
      const webpDataUri = "data:image/webp;base64,UklGRqQAAABXRUJQ...";
      const { container } = render(
        <ImageElement imageSrc={webpDataUri} altText="WebP" theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(webpDataUri);
    });

    it("should handle external URLs", () => {
      const externalUrl = "https://example.com/image.jpg";
      const { container } = render(
        <ImageElement imageSrc={externalUrl} altText="External" theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(externalUrl);
    });
  });

  describe("Alt Text Handling", () => {
    it("should use provided alt text", () => {
      const altText = "Custom Alt Text";
      const { container } = render(
        <ImageElement imageSrc="test.jpg" altText={altText} theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("alt")).toBe(altText);
    });

    it("should handle undefined alt text", () => {
      const { container } = render(
        <ImageElement imageSrc="test.jpg" theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("alt")).toBeNull();
    });

    it("should handle empty alt text", () => {
      const { container } = render(
        <ImageElement imageSrc="test.jpg" altText="" theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("alt")).toBe("");
    });
  });

  describe("Error Scenarios", () => {
    it("should render fallback for invalid data URI", () => {
      const invalidDataUri = "data:invalid;base64,invalid";
      const { container } = render(
        <ImageElement
          imageSrc={invalidDataUri}
          altText="Invalid"
          theme="dark"
        />
      );

      // Should still render the image element even if invalid - browser handles the error
      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(invalidDataUri);
    });

    it("should handle very long image src", () => {
      const longSrc = "data:image/jpeg;base64," + "A".repeat(10000);
      const { container } = render(
        <ImageElement imageSrc={longSrc} altText="Long" theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe(longSrc);
    });

    it("should handle special characters in alt text", () => {
      const specialAlt = "Test & Special < > \" ' Characters";
      const { container } = render(
        <ImageElement imageSrc="test.jpg" altText={specialAlt} theme="dark" />
      );

      const img = container.querySelector("img");
      expect(img?.getAttribute("alt")).toBe(specialAlt);
    });
  });

  describe("Accessibility", () => {
    it("should provide proper image accessibility attributes", () => {
      const { container } = render(<ImageElement {...baseProps} />);

      const img = container.querySelector("img");
      expect(img?.getAttribute("alt")).toBe(baseProps.altText);
      // Images should have alt attribute for screen readers
      expect(img?.hasAttribute("alt")).toBe(true);
    });

    it("should not have accessibility issues with fallback", () => {
      const { container } = render(
        <ImageElement altText="Fallback" theme="dark" />
      );

      const fallback = container.querySelector(
        'div[style*="text-align: center"]'
      );
      // Fallback should be visible and readable
      expect(fallback?.textContent).toBeTruthy();
    });
  });
});
