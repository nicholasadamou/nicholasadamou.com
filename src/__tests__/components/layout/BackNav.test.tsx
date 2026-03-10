import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../utils";

let mockPathname = "/";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(),
}));

import BackNav from "@/components/layout/BackNav";

describe("BackNav", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("renders nothing on homepage", () => {
    mockPathname = "/";
    const { container } = render(<BackNav />);
    expect(container.innerHTML).toBe("");
  });

  it("renders Home link on non-root paths", () => {
    mockPathname = "/about";
    render(<BackNav />);
    expect(screen.getByText("Home")).toBeDefined();
  });

  it("renders breadcrumb for article pages", () => {
    mockPathname = "/notes/test-article";
    render(<BackNav />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Notes")).toBeDefined();
  });

  it("renders breadcrumb for contact page", () => {
    mockPathname = "/contact";
    render(<BackNav />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Contact")).toBeDefined();
  });

  it("renders breadcrumb for privacy page", () => {
    mockPathname = "/privacy";
    render(<BackNav />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Privacy Policy")).toBeDefined();
  });
});
