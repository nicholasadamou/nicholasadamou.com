import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import FlipNumber from "@/components/common/effects/FlipNumber";

// Note: Some React act warnings are expected for this component due to setTimeout
// usage in useEffect. These are not test failures but testing environment artifacts.

// Mock the useIsMount hook
const mockUseIsMount = vi.fn();
vi.mock("@/hooks/utilities/use-is-mount", () => ({
  default: () => mockUseIsMount(),
}));

describe("FlipNumber", () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
    mockUseIsMount.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render the number on initial mount", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{42}</FlipNumber>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should format numbers with locale string", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{1234567}</FlipNumber>);

      expect(screen.getByText("1,234,567")).toBeInTheDocument();
    });

    it("should handle zero", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{0}</FlipNumber>);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle negative numbers", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{-123}</FlipNumber>);

      expect(screen.getByText("-123")).toBeInTheDocument();
    });

    it("should apply inline-flex class", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{42}</FlipNumber>);

      const element = screen.getByText("42");
      expect(element).toHaveClass("inline-flex");
    });
  });

  describe("Animation states on mount", () => {
    it("should have initial styles on mount", () => {
      mockUseIsMount.mockReturnValue(true);

      act(() => {
        render(<FlipNumber>{42}</FlipNumber>);
      });

      const element = screen.getByText("42");
      expect(element).toHaveClass("inline-flex");
    });

    it("should start animation sequence after mount", () => {
      mockUseIsMount.mockReturnValue(false);

      render(<FlipNumber>{42}</FlipNumber>);

      // Initial state should have the number visible
      const element = screen.getByText("42");
      expect(element).toBeInTheDocument();

      // Fast-forward through the animation
      act(() => {
        vi.advanceTimersByTime(1);
      });

      // Should have "out" animation class
      expect(element).toHaveClass(
        "-translate-y-3",
        "opacity-0",
        "duration-75",
        "ease-in-out"
      );
    });
  });

  describe("Animation sequence", () => {
    it("should cycle through animation states correctly", () => {
      mockUseIsMount.mockReturnValue(false);

      render(<FlipNumber>{42}</FlipNumber>);
      const element = screen.getByText("42");

      // Initial state - should be visible
      expect(element).toBeInTheDocument();

      // After first timeout (0ms) - "out" state
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(element).toHaveClass(
        "-translate-y-3",
        "opacity-0",
        "duration-75",
        "ease-in-out"
      );

      // After duration (75ms) - "moveDown" state
      act(() => {
        vi.advanceTimersByTime(75);
      });
      expect(element).toHaveClass("translate-y-3", "opacity-0");

      // After duration * 2 (150ms) - back to "initial" state
      act(() => {
        vi.advanceTimersByTime(75);
      });
      expect(element).toHaveClass(
        "translate-y-0",
        "opacity-100",
        "duration-75",
        "ease-in-out"
      );
    });
  });

  describe("Number changes", () => {
    it("should update displayed number during animation", () => {
      mockUseIsMount.mockReturnValue(false);

      const { rerender } = render(<FlipNumber>{42}</FlipNumber>);

      // Change the number
      rerender(<FlipNumber>{84}</FlipNumber>);

      // Initially should still show old number
      expect(screen.getByText("42")).toBeInTheDocument();

      // After duration, should show new number
      act(() => {
        vi.advanceTimersByTime(75);
      });

      expect(screen.getByText("84")).toBeInTheDocument();
      expect(screen.queryByText("42")).not.toBeInTheDocument();
    });

    it("should handle multiple rapid changes", () => {
      mockUseIsMount.mockReturnValue(false);

      const { rerender } = render(<FlipNumber>{1}</FlipNumber>);

      // Rapid changes
      rerender(<FlipNumber>{2}</FlipNumber>);
      rerender(<FlipNumber>{3}</FlipNumber>);
      rerender(<FlipNumber>{4}</FlipNumber>);

      // Should still show original number initially
      expect(screen.getByText("1")).toBeInTheDocument();

      // After animation completes, should show the final number
      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should format large numbers correctly during changes", () => {
      mockUseIsMount.mockReturnValue(false);

      const { rerender } = render(<FlipNumber>{1000}</FlipNumber>);

      rerender(<FlipNumber>{2000000}</FlipNumber>);

      // After animation duration, should show formatted new number
      act(() => {
        vi.advanceTimersByTime(75);
      });

      expect(screen.getByText("2,000,000")).toBeInTheDocument();
    });
  });

  describe("CSS classes", () => {
    it("should apply inline-flex class consistently", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{42}</FlipNumber>);

      const element = screen.getByText("42");
      expect(element).toHaveClass("inline-flex");
    });

    it("should apply correct animation classes for 'out' state", () => {
      mockUseIsMount.mockReturnValue(false);

      render(<FlipNumber>{42}</FlipNumber>);

      act(() => {
        vi.advanceTimersByTime(1);
      });

      const element = screen.getByText("42");
      expect(element).toHaveClass(
        "inline-flex",
        "-translate-y-3",
        "opacity-0",
        "duration-75",
        "ease-in-out"
      );
    });

    it("should apply correct animation classes for 'moveDown' state", () => {
      mockUseIsMount.mockReturnValue(false);

      render(<FlipNumber>{42}</FlipNumber>);

      act(() => {
        vi.advanceTimersByTime(76);
      });

      const element = screen.getByText("42");
      expect(element).toHaveClass("inline-flex", "translate-y-3", "opacity-0");
    });

    it("should apply correct animation classes for 'initial' state", () => {
      mockUseIsMount.mockReturnValue(false);

      render(<FlipNumber>{42}</FlipNumber>);

      act(() => {
        vi.advanceTimersByTime(151);
      });

      const element = screen.getByText("42");
      expect(element).toHaveClass(
        "inline-flex",
        "translate-y-0",
        "opacity-100",
        "duration-75",
        "ease-in-out"
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle decimal numbers", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{3.14159}</FlipNumber>);

      expect(screen.getByText("3.142")).toBeInTheDocument();
    });

    it("should handle very large numbers", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{999999999999}</FlipNumber>);

      expect(screen.getByText("999,999,999,999")).toBeInTheDocument();
    });

    it("should handle number prop changing to same value", () => {
      mockUseIsMount.mockReturnValue(false);

      const { rerender } = render(<FlipNumber>{42}</FlipNumber>);

      // Change to same number
      rerender(<FlipNumber>{42}</FlipNumber>);

      // Should still trigger animation
      act(() => {
        vi.advanceTimersByTime(1);
      });

      const element = screen.getByText("42");
      expect(element).toHaveClass("-translate-y-3", "opacity-0");
    });
  });

  describe("Timing", () => {
    it("should use correct duration for animations", () => {
      mockUseIsMount.mockReturnValue(false);

      render(<FlipNumber>{42}</FlipNumber>);

      // Verify that the component uses 75ms duration
      act(() => {
        vi.advanceTimersByTime(74); // Just before duration
      });

      // Should still be in "out" state
      expect(screen.getByText("42")).toHaveClass("-translate-y-3");

      act(() => {
        vi.advanceTimersByTime(1); // Complete the duration
      });

      // Should now be in "moveDown" state
      expect(screen.getByText("42")).toHaveClass("translate-y-3");
    });
  });

  describe("Accessibility", () => {
    it("should render numbers in a way that screen readers can access", () => {
      mockUseIsMount.mockReturnValue(true);

      render(<FlipNumber>{1234}</FlipNumber>);

      const element = screen.getByText("1,234");
      expect(element.tagName).toBe("SPAN");
      expect(element).toBeVisible();
    });
  });
});
