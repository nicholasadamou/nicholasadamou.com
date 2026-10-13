import { getBaseUrl } from "@/lib/og";

const PROBLEM_CONTENT = {
  description: "RFC 9457 problem details",
  content: {
    "application/problem+json": {
      schema: { $ref: "#/components/schemas/ProblemDetails" },
    },
  },
} as const;

const JSON_HEADERS = {
  Link: {
    schema: { type: "string" },
    description:
      "Links to OpenAPI, the API catalog, developer docs, and deprecation policy.",
  },
} as const;

/**
 * OpenAPI 3.1 description of the public Nicholas Adamou developer API.
 * Focuses on versioned JSON endpoints with typed schemas and RFC 9457 errors.
 */
export function getOpenApiDocument() {
  const baseUrl = getBaseUrl();

  return {
    openapi: "3.1.0",
    info: {
      title: "Nicholas Adamou developer resources",
      description:
        "Public, read-only Nicholas Adamou developer API for searching notes and projects, listing content, and discovering agent entry points (OpenAPI, MCP, CLI, Markdown negotiation). Stable operations use URL path versioning under /api/v1. Errors use RFC 9457 application/problem+json. No API key or OAuth is required. Breaking changes require a new major path; deprecations are signaled with RFC 9745 Deprecation and Sunset headers at least 90 days before removal. See /developers#versioning-and-deprecation.",
      version: "1.0.0",
      contact: {
        name: "Nicholas Adamou",
        url: `${baseUrl}/contact`,
      },
    },
    externalDocs: {
      description:
        "Nicholas Adamou developer resources — API, errors, versioning, CLI, and MCP",
      url: `${baseUrl}/developers`,
    },
    servers: [
      {
        url: baseUrl,
        description: "Nicholas Adamou production API",
      },
    ],
    tags: [
      {
        name: "Search",
        description: "Search notes and open-source projects.",
      },
      {
        name: "Notes",
        description: "Technical writing published on this site.",
      },
      {
        name: "Projects",
        description: "Open-source projects and developer tools.",
      },
      {
        name: "Discovery",
        description: "Machine-readable catalogs and agent manifests.",
      },
    ],
    paths: {
      "/api/v1/search": {
        get: {
          operationId: "searchContentV1",
          summary: "Search notes and projects",
          description:
            "Full-text style search across Nicholas Adamou notes and projects. Returns up to 10 ranked matches. Read-only; no authentication.",
          security: [],
          tags: ["Search"],
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              description: "Search query string.",
              schema: { type: "string", minLength: 0, maxLength: 200 },
              example: "nextjs",
            },
          ],
          responses: {
            "200": {
              description: "Search results",
              headers: JSON_HEADERS,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SearchResponse" },
                },
              },
            },
            "400": PROBLEM_CONTENT,
            "405": PROBLEM_CONTENT,
          },
        },
      },
      "/api/v1/notes": {
        get: {
          operationId: "listNotesV1",
          summary: "List notes",
          description:
            "Returns every published note with title, summary, date, and absolute URL. Read-only; no authentication.",
          security: [],
          tags: ["Notes"],
          responses: {
            "200": {
              description: "Note list",
              headers: JSON_HEADERS,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NotesListResponse" },
                },
              },
            },
            "405": PROBLEM_CONTENT,
          },
        },
      },
      "/api/v1/notes/{slug}": {
        get: {
          operationId: "getNoteV1",
          summary: "Get a note by slug",
          description:
            "Returns one note including Markdown body. Unknown slugs return RFC 9457 note_not_found.",
          security: [],
          tags: ["Notes"],
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              description: "Note URL slug.",
              schema: { type: "string", minLength: 1 },
            },
          ],
          responses: {
            "200": {
              description: "Note detail",
              headers: JSON_HEADERS,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NoteDetail" },
                },
              },
            },
            "404": PROBLEM_CONTENT,
            "405": PROBLEM_CONTENT,
          },
        },
      },
      "/api/v1/projects": {
        get: {
          operationId: "listProjectsV1",
          summary: "List projects",
          description:
            "Returns open-source projects and developer tools with descriptions and tags. Read-only; no authentication.",
          security: [],
          tags: ["Projects"],
          responses: {
            "200": {
              description: "Project list",
              headers: JSON_HEADERS,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProjectsListResponse",
                  },
                },
              },
            },
            "405": PROBLEM_CONTENT,
          },
        },
      },
      "/api/search": {
        get: {
          operationId: "searchContentLegacy",
          summary: "Search notes and projects (legacy alias)",
          description:
            "Deprecated compatibility alias for GET /api/v1/search. Responses include RFC 9745 Deprecation and Sunset headers plus a successor-version Link. Prefer /api/v1/search for new integrations.",
          deprecated: true,
          security: [],
          tags: ["Search"],
          parameters: [
            {
              name: "q",
              in: "query",
              required: false,
              description:
                "Search query. Empty or missing returns an empty results array.",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Legacy search results",
              headers: {
                ...JSON_HEADERS,
                Deprecation: { schema: { type: "string" } },
                Sunset: { schema: { type: "string" } },
              },
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/LegacySearchResponse",
                  },
                },
              },
            },
            "405": PROBLEM_CONTENT,
          },
        },
      },
      "/openapi.json": {
        get: {
          operationId: "getOpenApiDocument",
          summary: "This OpenAPI document",
          description:
            "OpenAPI 3.1 JSON describing the Nicholas Adamou developer API.",
          security: [],
          tags: ["Discovery"],
          responses: {
            "200": {
              description: "OpenAPI 3.1 document",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/OpenApiDocument" },
                },
              },
            },
          },
        },
      },
      "/.well-known/api-catalog": {
        get: {
          operationId: "getApiCatalog",
          summary: "RFC 9727 API catalog",
          description:
            "Linkset pointing agents at the OpenAPI description and developer docs.",
          security: [],
          tags: ["Discovery"],
          responses: {
            "200": {
              description: "API catalog linkset",
              content: {
                "application/linkset+json": {
                  schema: { $ref: "#/components/schemas/ApiCatalog" },
                },
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiCatalog" },
                },
              },
            },
          },
        },
      },
      "/server.json": {
        get: {
          operationId: "getMcpServerManifest",
          summary: "MCP registry manifest",
          description:
            "MCP registry server.json declaring the Streamable HTTP transport for this host.",
          security: [],
          tags: ["Discovery"],
          responses: {
            "200": {
              description: "MCP server manifest",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/McpServerManifest" },
                },
              },
            },
          },
        },
      },
      "/mcp/server-card": {
        get: {
          operationId: "getMcpServerCard",
          summary: "MCP server card",
          description:
            "MCP server card (also available at /.well-known/mcp and /.well-known/mcp/server-card.json).",
          security: [],
          tags: ["Discovery"],
          responses: {
            "200": {
              description: "MCP server card",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/McpServerCard" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        SearchResult: {
          type: "object",
          additionalProperties: false,
          required: ["type", "slug", "title", "summary", "href", "url"],
          properties: {
            type: { type: "string", enum: ["note", "project"] },
            slug: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            href: { type: "string" },
            url: { type: "string", format: "uri" },
            tags: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        SearchResponse: {
          type: "object",
          additionalProperties: false,
          required: ["results", "query", "count"],
          properties: {
            results: {
              type: "array",
              items: { $ref: "#/components/schemas/SearchResult" },
            },
            query: { type: "string" },
            count: { type: "integer", minimum: 0 },
          },
        },
        LegacySearchResponse: {
          type: "object",
          additionalProperties: false,
          required: ["results"],
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["type", "slug", "title", "summary", "href"],
                properties: {
                  type: { type: "string", enum: ["note", "project"] },
                  slug: { type: "string" },
                  title: { type: "string" },
                  summary: { type: "string" },
                  href: { type: "string" },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
        NoteSummary: {
          type: "object",
          additionalProperties: false,
          required: [
            "slug",
            "title",
            "summary",
            "date",
            "readTime",
            "href",
            "url",
            "pinned",
          ],
          properties: {
            slug: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            date: { type: "string" },
            readTime: { type: "string" },
            href: { type: "string" },
            url: { type: "string", format: "uri" },
            pinned: { type: "boolean" },
          },
        },
        NoteDetail: {
          allOf: [
            { $ref: "#/components/schemas/NoteSummary" },
            {
              type: "object",
              additionalProperties: false,
              required: ["body"],
              properties: {
                body: {
                  type: "string",
                  description: "Markdown source of the note.",
                },
              },
            },
          ],
        },
        NotesListResponse: {
          type: "object",
          additionalProperties: false,
          required: ["notes", "count"],
          properties: {
            notes: {
              type: "array",
              items: { $ref: "#/components/schemas/NoteSummary" },
            },
            count: { type: "integer", minimum: 0 },
          },
        },
        ProjectSummary: {
          type: "object",
          additionalProperties: false,
          required: ["name", "slug", "description", "href", "tags", "featured"],
          properties: {
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            href: { type: "string", format: "uri" },
            tags: { type: "array", items: { type: "string" } },
            featured: { type: "boolean" },
          },
        },
        ProjectsListResponse: {
          type: "object",
          additionalProperties: false,
          required: ["projects", "count"],
          properties: {
            projects: {
              type: "array",
              items: { $ref: "#/components/schemas/ProjectSummary" },
            },
            count: { type: "integer", minimum: 0 },
          },
        },
        ProblemDetails: {
          type: "object",
          additionalProperties: true,
          required: [
            "type",
            "title",
            "status",
            "detail",
            "instance",
            "code",
            "resolution",
          ],
          properties: {
            type: { type: "string", format: "uri" },
            title: { type: "string" },
            status: { type: "integer", minimum: 400, maximum: 599 },
            detail: { type: "string" },
            instance: { type: "string", format: "uri" },
            code: {
              type: "string",
              enum: [
                "invalid_query",
                "note_not_found",
                "method_not_allowed",
                "api_route_not_found",
                "internal_error",
              ],
            },
            resolution: { type: "string" },
            documentation_url: { type: "string", format: "uri" },
          },
        },
        OpenApiDocument: {
          type: "object",
          additionalProperties: true,
          required: ["openapi", "info", "paths"],
          properties: {
            openapi: { type: "string" },
            info: { type: "object", additionalProperties: true },
            paths: { type: "object", additionalProperties: true },
          },
        },
        ApiCatalog: {
          type: "object",
          additionalProperties: true,
          required: ["linkset"],
          properties: {
            linkset: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
        McpServerManifest: {
          type: "object",
          additionalProperties: true,
          required: ["name", "description", "version", "remotes"],
          properties: {
            name: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            version: { type: "string" },
            websiteUrl: { type: "string", format: "uri" },
            remotes: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                required: ["type", "url"],
                properties: {
                  type: { type: "string", enum: ["streamable-http"] },
                  url: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        McpServerCard: {
          type: "object",
          additionalProperties: true,
          required: ["name", "description", "version", "remotes"],
          properties: {
            name: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            version: { type: "string" },
            websiteUrl: { type: "string", format: "uri" },
            remotes: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                required: ["type", "url"],
                properties: {
                  type: { type: "string", enum: ["streamable-http"] },
                  url: { type: "string", format: "uri" },
                  supportedProtocolVersions: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}
