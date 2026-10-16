import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { features } from "@/lib/projects/spotlights";
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
      `2 of ${features.length}: Smeltery Skills`
    );
    fireEvent.click(screen.getByRole("button", { name: "Pause rotation" }));
    advance();
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      `2 of ${features.length}: Smeltery Skills`
    );
  });

  it("pauses for focused content and resumes only when requested", () => {
    render(<SmelterySpotlight />);
    fireEvent.focus(screen.getByRole("link"));
    advance();
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      `1 of ${features.length}: Smeltery Labs`
    );
    fireEvent.click(screen.getByRole("button", { name: /Choose project/ }));
    fireEvent.click(
      screen.getByRole("button", { name: features.at(-1)!.name })
    );
    fireEvent.click(screen.getByRole("button", { name: "Start rotation" }));
    advance();
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      `1 of ${features.length}: Smeltery Labs`
    );
  });
  it("filters projects and closes the selector with Escape", () => {
    render(<SmelterySpotlight compact />);
    const trigger = screen.getByRole("button", { name: /Choose project/ });
    fireEvent.click(trigger);
    const search = screen.getByRole("textbox", { name: "Find a project" });
    fireEvent.change(search, { target: { value: "loft" } });
    expect(
      screen.getByRole("button", { name: "Loft", pressed: false })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Convrt" })
    ).not.toBeInTheDocument();
    fireEvent.keyDown(search, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});
