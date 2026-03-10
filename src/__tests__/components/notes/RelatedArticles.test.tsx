import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../utils";
import RelatedArticles from "@/components/notes/RelatedArticles";

const ARTICLES = [
  {
    slug: "article-1",
    title: "First Article",
    summary: "Summary one",
    readTime: "3 min read",
    image: "/img1.jpg",
  },
  {
    slug: "article-2",
    title: "Second Article",
    summary: "Summary two",
    readTime: "5 min read",
    image: null,
  },
];

describe("RelatedArticles", () => {
  it("renders nothing when articles is empty", () => {
    const { container } = render(<RelatedArticles articles={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders section heading", () => {
    render(<RelatedArticles articles={ARTICLES} />);
    expect(screen.getByText("If you liked this note.")).toBeDefined();
    expect(screen.getByText("You will love these as well.")).toBeDefined();
  });

  it("renders article titles", () => {
    render(<RelatedArticles articles={ARTICLES} />);
    expect(screen.getByText(/First Article/)).toBeDefined();
    expect(screen.getByText(/Second Article/)).toBeDefined();
  });

  it("renders article summaries", () => {
    render(<RelatedArticles articles={ARTICLES} />);
    expect(screen.getByText("Summary one")).toBeDefined();
    expect(screen.getByText("Summary two")).toBeDefined();
  });

  it("renders image only when present", () => {
    const { container } = render(<RelatedArticles articles={ARTICLES} />);
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(1);
  });

  it("links to correct article URLs", () => {
    const { container } = render(<RelatedArticles articles={ARTICLES} />);
    const links = container.querySelectorAll("a");
    expect(links[0].getAttribute("href")).toBe("/notes/article-1");
    expect(links[1].getAttribute("href")).toBe("/notes/article-2");
  });
});
