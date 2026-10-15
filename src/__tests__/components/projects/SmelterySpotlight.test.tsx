import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SmelterySpotlight from "@/components/projects/SmelterySpotlight";

describe("spotlight playback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  const advance = () => act(() => vi.advanceTimersByTime(9000));

  it("plays while the pointer and focus remain on the control, then pauses", () => {
    render(<SmelterySpotlight compact />);
    fireEvent.mouseEnter(screen.getByRole("region"));
    const play = screen.getByRole("button", { name: "Start rotation" });
    fireEvent.focus(play);
    fireEvent.click(play);
    advance();
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "2 of 7: Smeltery Skills"
    );
    fireEvent.click(screen.getByRole("button", { name: "Pause rotation" }));
    advance();
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "2 of 7: Smeltery Skills"
    );
  });

  it("pauses for focused content and resumes only when requested", () => {
    render(<SmelterySpotlight />);
    fireEvent.focus(screen.getByRole("link"));
    advance();
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "1 of 7: Smeltery Labs"
    );
    fireEvent.click(screen.getByRole("button", { name: "Convrt" }));
    fireEvent.click(screen.getByRole("button", { name: "Start rotation" }));
    advance();
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "1 of 7: Smeltery Labs"
    );
  });
});
