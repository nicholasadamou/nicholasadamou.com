import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import NavLink from "@/components/common/ui/NavLink";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;

describe("NavLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children correctly", () => {
    mockUsePathname.mockReturnValue("/about");

    render(<NavLink href="/about">About Page</NavLink>);

    expect(screen.getByText("About Page")).toBeInTheDocument();
  });

  it("should apply active styles when pathname matches href", () => {
    mockUsePathname.mockReturnValue("/about/some-subpage");

    render(<NavLink href="/about">About</NavLink>);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("text-primary");
    expect(link).toHaveClass("decoration-react-link");
  });

  it("should apply inactive styles when pathname does not match href", () => {
    mockUsePathname.mockReturnValue("/projects");

    render(<NavLink href="/about">About</NavLink>);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("text-secondary");
    expect(link).not.toHaveClass("decoration-react-link");
  });

  it("should handle root path correctly", () => {
    mockUsePathname.mockReturnValue("/");

    render(<NavLink href="/">Home</NavLink>);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("should handle nested paths correctly for active state", () => {
    mockUsePathname.mockReturnValue("/projects/some-project");

    render(<NavLink href="/projects">Projects</NavLink>);

    const link = screen.getByRole("link");
    // Should be active because pathname starts with /projects
    expect(link).toHaveClass("text-primary");
  });

  it("should extract base path from nested routes", () => {
    mockUsePathname.mockReturnValue("/about/team/member/123");

    render(<NavLink href="/about">About</NavLink>);

    const link = screen.getByRole("link");
    // Should be active because base path is /about
    expect(link).toHaveClass("text-primary");
  });

  it("should have correct accessibility attributes", () => {
    mockUsePathname.mockReturnValue("/contact");

    render(<NavLink href="/contact">Contact Us</NavLink>);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/contact");
    expect(link).toBeVisible();
  });

  it("should handle different pathnames correctly", () => {
    const testCases = [
      { pathname: "/notes", href: "/notes", shouldBeActive: true },
      { pathname: "/notes/my-post", href: "/notes", shouldBeActive: true },
      { pathname: "/projects", href: "/notes", shouldBeActive: false },
      { pathname: "/about", href: "/contact", shouldBeActive: false },
    ];

    testCases.forEach(({ pathname, href, shouldBeActive }) => {
      mockUsePathname.mockReturnValue(pathname);

      const { rerender } = render(<NavLink href={href}>Test Link</NavLink>);

      const link = screen.getByRole("link");

      if (shouldBeActive) {
        expect(link).toHaveClass("text-primary");
      } else {
        expect(link).toHaveClass("text-secondary");
      }

      // Clean up for next iteration
      rerender(<div />);
    });
  });
});
