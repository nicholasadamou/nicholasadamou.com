import { getBaseUrl } from "@/lib/og";
import { getDevelopersMarkdown } from "@/lib/markdown/pages";
import {
  getNote,
  listNotes,
  listProjects,
  searchContent,
} from "@/lib/api/v1/content";

export const MCP_PROTOCOL_VERSIONS = [
  "2025-11-25",
  "2025-06-18",
  "2024-11-05",
] as const;

export const MCP_SERVER_NAME = "io.github.nicholasadamou/nicholasadamou.com";
export const MCP_SERVER_VERSION = "1.0.0";

export function getMcpServerCard() {
  const baseUrl = getBaseUrl();
  return {
    $schema:
      "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    name: MCP_SERVER_NAME,
    title: "Nicholas Adamou",
    description:
      "Search Nicholas Adamou notes and projects, list content, and retrieve Nicholas Adamou developer resources over Streamable HTTP.",
    version: MCP_SERVER_VERSION,
    websiteUrl: `${baseUrl}/`,
    repository: {
      source: "github",
      url: "https://github.com/nicholasadamou/nicholasadamou.com",
    },
    remotes: [
      {
        type: "streamable-http",
        url: `${baseUrl}/mcp`,
        supportedProtocolVersions: [...MCP_PROTOCOL_VERSIONS],
      },
    ],
  };
}

export function getMcpRegistryManifest() {
  const baseUrl = getBaseUrl();
  return {
    $schema:
      "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
    name: MCP_SERVER_NAME,
    title: "Nicholas Adamou",
    description:
      "Search Nicholas Adamou notes and projects, list content, and retrieve Nicholas Adamou developer resources.",
    version: MCP_SERVER_VERSION,
    websiteUrl: `${baseUrl}/`,
    remotes: [
      {
        type: "streamable-http",
        url: `${baseUrl}/mcp`,
      },
    ],
  };
}

export function getAiCatalog() {
  const baseUrl = getBaseUrl();
  return {
    specVersion: "1.0",
    entries: [
      {
        identifier: `urn:air:nicholasadamou.com:mcp:nicholasadamou`,
        type: "application/mcp-server-card+json",
        url: `${baseUrl}/mcp/server-card`,
      },
    ],
  };
}

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: string;
  params?: Record<string, unknown>;
}

function toolDefinitions() {
  return [
    {
      name: "nicholasadamou_search",
      title: "Search Nicholas Adamou content",
      description:
        "Search Nicholas Adamou notes and open-source projects. Returns up to 10 ranked matches with titles, summaries, and URLs.",
      inputSchema: {
        type: "object",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        properties: {
          q: {
            type: "string",
            maxLength: 200,
            description: "Search query.",
          },
        },
        required: ["q"],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      outputSchema: {
        type: "object",
        properties: {
          results: { type: "array", items: { type: "object" } },
          query: { type: "string" },
          count: { type: "integer" },
        },
        required: ["results", "query", "count"],
      },
    },
    {
      name: "nicholasadamou_list_notes",
      title: "List Nicholas Adamou notes",
      description:
        "List published technical notes with slug, title, summary, date, and URL.",
      inputSchema: {
        type: "object",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      outputSchema: {
        type: "object",
        properties: {
          notes: { type: "array", items: { type: "object" } },
          count: { type: "integer" },
        },
        required: ["notes", "count"],
      },
    },
    {
      name: "nicholasadamou_get_note",
      title: "Get a Nicholas Adamou note",
      description:
        "Retrieve one note by slug, including Markdown body. Use nicholasadamou_list_notes or nicholasadamou_search to discover slugs.",
      inputSchema: {
        type: "object",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        properties: {
          slug: {
            type: "string",
            minLength: 1,
            description: "Note URL slug.",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      outputSchema: {
        type: "object",
        properties: {
          slug: { type: "string" },
          title: { type: "string" },
          summary: { type: "string" },
          body: { type: "string" },
          url: { type: "string" },
        },
        required: ["slug", "title", "summary", "body", "url"],
      },
    },
    {
      name: "nicholasadamou_list_projects",
      title: "List Nicholas Adamou projects",
      description:
        "List open-source projects and developer tools with descriptions and tags.",
      inputSchema: {
        type: "object",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      outputSchema: {
        type: "object",
        properties: {
          projects: { type: "array", items: { type: "object" } },
          count: { type: "integer" },
        },
        required: ["projects", "count"],
      },
    },
    {
      name: "nicholasadamou_get_developer_docs",
      title: "Get Nicholas Adamou developer documentation",
      description:
        "Retrieve Nicholas Adamou developer resources as Markdown: versioned REST API, OpenAPI, RFC 9457 errors, versioning/deprecation policy, official CLI, and MCP transport. No arguments.",
      inputSchema: {
        type: "object",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      outputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          markdown: { type: "string" },
          url: { type: "string", format: "uri" },
        },
        required: ["title", "markdown", "url"],
      },
    },
  ];
}

function toolResult(
  structured: Record<string, unknown>,
  text: string,
  isError = false
) {
  return {
    content: [{ type: "text", text }],
    structuredContent: structured,
    isError,
  };
}

function asRecord(value: object): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function callTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "nicholasadamou_search": {
      const q = typeof args.q === "string" ? args.q : "";
      if (!q.trim()) {
        return toolResult(
          { error: "invalid_query" },
          'Missing required argument "q". Pass a non-empty search string.',
          true
        );
      }
      const results = searchContent(q);
      const payload = { results, query: q.trim(), count: results.length };
      return toolResult(payload, JSON.stringify(payload, null, 2));
    }
    case "nicholasadamou_list_notes": {
      const notes = listNotes();
      const payload = { notes, count: notes.length };
      return toolResult(payload, JSON.stringify(payload, null, 2));
    }
    case "nicholasadamou_get_note": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      if (!slug) {
        return toolResult(
          { error: "invalid_query" },
          'Missing required argument "slug".',
          true
        );
      }
      const note = getNote(slug);
      if (!note) {
        return toolResult(
          { error: "note_not_found", slug },
          `No note exists for slug "${slug}". Use nicholasadamou_list_notes to discover valid slugs.`,
          true
        );
      }
      return toolResult(asRecord(note), JSON.stringify(note, null, 2));
    }
    case "nicholasadamou_list_projects": {
      const projects = listProjects();
      const payload = { projects, count: projects.length };
      return toolResult(payload, JSON.stringify(payload, null, 2));
    }
    case "nicholasadamou_get_developer_docs": {
      const markdown = getDevelopersMarkdown();
      const payload = {
        title: "Nicholas Adamou developer resources",
        markdown,
        url: `${getBaseUrl()}/developers`,
      };
      return toolResult(payload, markdown);
    }
    default:
      return null;
  }
}

function rpcResult(id: JsonRpcId | undefined, result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function rpcError(
  id: JsonRpcId | undefined,
  code: number,
  message: string,
  data?: unknown
) {
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message, ...(data !== undefined ? { data } : {}) },
  };
}

export function handleMcpJsonRpc(body: JsonRpcRequest): unknown {
  const method = body.method;
  const id = body.id;
  const params = body.params ?? {};

  if (!method) {
    return rpcError(id, -32600, "Invalid Request: missing method");
  }

  switch (method) {
    case "initialize": {
      const requested =
        typeof params.protocolVersion === "string"
          ? params.protocolVersion
          : MCP_PROTOCOL_VERSIONS[0];
      const protocolVersion = (
        MCP_PROTOCOL_VERSIONS as readonly string[]
      ).includes(requested)
        ? requested
        : MCP_PROTOCOL_VERSIONS[0];

      return rpcResult(id, {
        protocolVersion,
        capabilities: {
          tools: { listChanged: false },
        },
        serverInfo: {
          name: MCP_SERVER_NAME,
          version: MCP_SERVER_VERSION,
        },
        instructions:
          "Use nicholasadamou_search, nicholasadamou_list_notes, nicholasadamou_get_note, nicholasadamou_list_projects, and nicholasadamou_get_developer_docs. Every tool is public and read-only.",
      });
    }
    case "notifications/initialized":
    case "notifications/cancelled":
      return null;
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: toolDefinitions() });
    case "tools/call": {
      const name = typeof params.name === "string" ? params.name : "";
      const args =
        params.arguments &&
        typeof params.arguments === "object" &&
        !Array.isArray(params.arguments)
          ? (params.arguments as Record<string, unknown>)
          : {};
      const result = callTool(name, args);
      if (!result) {
        return rpcError(id, -32601, `Unknown tool: ${name}`);
      }
      return rpcResult(id, result);
    }
    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

export function mcpSseResponse(payload: unknown): Response {
  const data = `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function mcpJsonResponse(payload: unknown, status = 200): Response {
  return Response.json(payload, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
