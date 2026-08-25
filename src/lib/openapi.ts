import { getBaseUrl } from "@/lib/og";

/**
 * OpenAPI 3.1 description of the public agent-facing surface on this host.
 * Documents real endpoints only — no stubbed MCP, OAuth, or webhook APIs.
 */
export function getOpenApiDocument() {
  const baseUrl = getBaseUrl();

  return {
    openapi: "3.1.0",
    info: {
      title: "Nicholas Adamou developer resources",
      description:
        "Public agent-facing endpoints for nicholasadamou.com: Markdown content negotiation, site discovery files, and JSON search across notes and projects. This host does not provide API keys, OAuth, webhooks, or an MCP server.",
      version: "1.0.0",
      contact: {
        name: "Nicholas Adamou",
        url: `${baseUrl}/contact`,
      },
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/llms.txt": {
        get: {
          operationId: "getLlmsTxt",
          summary: "Agent site guide (llms.txt)",
          responses: {
            "200": {
              description: "llms.txt document",
              content: {
                "text/plain": {
                  schema: { type: "string" },
                },
              },
            },
          },
        },
      },
      "/sitemap.xml": {
        get: {
          operationId: "getSitemap",
          summary: "XML sitemap of indexable URLs",
          responses: {
            "200": {
              description: "Sitemap",
              content: {
                "application/xml": {
                  schema: { type: "string" },
                },
              },
            },
          },
        },
      },
      "/developers": {
        get: {
          operationId: "getDevelopers",
          summary: "Nicholas Adamou developer resources",
          description:
            "HTML by default. Send Accept: text/markdown for a Markdown representation.",
          responses: {
            "200": {
              description: "Developer resources page",
              content: {
                "text/html": { schema: { type: "string" } },
                "text/markdown": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/": {
        get: {
          operationId: "getHome",
          summary: "Home page (HTML or Markdown via Accept)",
          responses: {
            "200": {
              description: "Home page",
              content: {
                "text/html": { schema: { type: "string" } },
                "text/markdown": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/about": {
        get: {
          operationId: "getAbout",
          summary: "About page (HTML or Markdown via Accept)",
          responses: {
            "200": {
              description: "About page",
              content: {
                "text/html": { schema: { type: "string" } },
                "text/markdown": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/projects": {
        get: {
          operationId: "getProjects",
          summary: "Projects page (HTML or Markdown via Accept)",
          responses: {
            "200": {
              description: "Projects page",
              content: {
                "text/html": { schema: { type: "string" } },
                "text/markdown": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/notes": {
        get: {
          operationId: "getNotes",
          summary: "Notes index (HTML or Markdown via Accept)",
          responses: {
            "200": {
              description: "Notes index",
              content: {
                "text/html": { schema: { type: "string" } },
                "text/markdown": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/notes/{slug}": {
        get: {
          operationId: "getNote",
          summary: "Note article (HTML or Markdown via Accept)",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Note article",
              content: {
                "text/html": { schema: { type: "string" } },
                "text/markdown": { schema: { type: "string" } },
              },
            },
            "404": {
              description:
                "Unknown slug — Markdown recovery body when Accept prefers text/markdown",
            },
          },
        },
      },
      "/api/search": {
        get: {
          operationId: "search",
          summary: "Search notes and projects",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Search query",
            },
          ],
          responses: {
            "200": {
              description: "Search results",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      results: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            type: {
                              type: "string",
                              enum: ["note", "project"],
                            },
                            slug: { type: "string" },
                            title: { type: "string" },
                            summary: { type: "string" },
                            href: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/openapi.json": {
        get: {
          operationId: "getOpenApi",
          summary: "This OpenAPI document",
          responses: {
            "200": {
              description: "OpenAPI 3.1 JSON",
              content: {
                "application/json": { schema: { type: "object" } },
              },
            },
          },
        },
      },
    },
  };
}
