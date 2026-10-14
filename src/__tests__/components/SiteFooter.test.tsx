import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import SiteFooter from "@/components/layout/SiteFooter";
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
it("avoids a duplicate homepage footer", () => {
  const { container } = render(<SiteFooter />);
  expect(container.querySelector("footer")).toBeNull();
});
it("provides navigation, safe external links, and a working return to top", () => {
  window.scrollTo = vi.fn();
  const { container } = render(<SiteFooter embedded />);
  container.scrollTo = vi.fn();
  expect(
    screen.getByRole("link", { name: "Start a project" }).getAttribute("href")
  ).toBe("/contact?from=footer");
  expect(
    screen.getByRole("link", { name: "GitHub" }).getAttribute("target")
  ).toBe("_blank");
  fireEvent.click(screen.getByRole("button", { name: "Back to top" }));
  expect(window.scrollTo).toHaveBeenCalled();
  expect(container.scrollTo).toHaveBeenCalled();
});
