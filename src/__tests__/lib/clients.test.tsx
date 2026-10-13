import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync } from "node:fs";
import ClientsPage from "@/app/clients/page";
import { clients, services, processSteps } from "@/lib/content/clients";
import { getClientsMarkdown } from "@/lib/markdown/pages";
import sitemap from "@/app/sitemap";

describe("client portfolio discovery", () => {
  it("renders every client and local image without browser JavaScript", () => {
    const html = renderToStaticMarkup(<ClientsPage />);
    for (const client of clients) {
      expect(html).toContain(client.href);
      expect(html).toContain(client.name);
      expect(existsSync(`public/images/clients/${client.slug}.webp`)).toBe(
        true
      );
    }
    expect(html).toContain('"@type":"CollectionPage"');
    expect(html).toContain('href="/contact?from=clients"');
  });

  it("provides the same work, services, and process in Markdown", () => {
    const markdown = getClientsMarkdown();
    for (const client of clients) expect(markdown).toContain(client.href);
    for (const item of [...services, ...processSteps]) {
      expect(markdown).toContain(item.title);
      expect(markdown).toContain(item.description);
    }
  });

  it("includes the client page in the sitemap", () => {
    expect(sitemap().some((entry) => entry.url.endsWith("/clients"))).toBe(
      true
    );
  });
});
