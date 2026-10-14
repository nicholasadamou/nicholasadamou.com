import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { brand } from "@/lib/brand";
import { pageMetadata } from "@/lib/og";
import { OGLayout } from "@/app/api/og/components/OGLayout";
import BrandPage from "@/app/brand/page";
import sitemap from "@/app/sitemap";

describe("brand resources", () => {
  it("keeps downloadable colors in sync and assets readable", () => {
    expect(
      JSON.parse(readFileSync("public/brand/tokens.json", "utf8"))
    ).toEqual(brand.colors);
    for (const file of [
      "brand/portrait.png",
      "brand/onebrief.png",
      "fonts/inter-400.ttf",
      "fonts/inter-600.ttf",
      "fonts/inter-700.ttf",
    ])
      expect(readFileSync(`public/${file}`).length).toBeGreaterThan(100);
  });
  it("exposes the brand page and downloads without JavaScript", () => {
    const html = renderToStaticMarkup(<BrandPage />);
    expect(html).toContain("/brand/portrait.png");
    expect(html).toContain("/brand/tokens.json");
    expect(sitemap().some((item) => item.url.endsWith("/brand"))).toBe(true);
  });
  it("uses the motto and employer logo on the root card", () => {
    const html = renderToStaticMarkup(
      <OGLayout
        title={brand.name}
        type="homepage"
        headerText=""
        companyLogo="data:image/png;base64,logo"
      />
    );
    expect(html).toContain("Making the world better through software");
    expect(html).toContain('alt="Onebrief"');
    expect(html).toContain(brand.role);
  });
  it("provides page-specific social metadata", () => {
    const meta = pageMetadata("Contact", "Start a project", "/contact");
    expect(meta.openGraph?.title).toBe("Contact");
    expect(JSON.stringify(meta.twitter)).toContain("title=Contact");
  });
});
