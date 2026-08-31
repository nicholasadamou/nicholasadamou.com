import {
  handleMcpJsonRpc,
  mcpJsonResponse,
  mcpSseResponse,
} from "@/lib/mcp/server";

export const runtime = "nodejs";

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS, POST",
    "Access-Control-Allow-Headers":
      "Accept, Content-Type, MCP-Protocol-Version, Mcp-Session-Id",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
  };
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(),
      Allow: "GET, HEAD, OPTIONS, POST",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export function GET() {
  return mcpJsonResponse(
    {
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    },
    405
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return mcpJsonResponse(
      {
        jsonrpc: "2.0",
        error: { code: -32700, message: "Parse error" },
        id: null,
      },
      400
    );
  }

  const accept = request.headers.get("accept") ?? "";
  const preferSse =
    accept.includes("text/event-stream") &&
    !accept.startsWith("application/json");

  // Batch not required for audit; reject arrays with a clear error.
  if (Array.isArray(body)) {
    return mcpJsonResponse(
      {
        jsonrpc: "2.0",
        error: {
          code: -32600,
          message: "Batch JSON-RPC is not supported on this endpoint.",
        },
        id: null,
      },
      400
    );
  }

  const result = handleMcpJsonRpc(
    body && typeof body === "object"
      ? (body as {
          jsonrpc?: string;
          id?: string | number | null;
          method?: string;
          params?: Record<string, unknown>;
        })
      : {}
  );

  // Notifications have no JSON-RPC response body.
  if (result === null) {
    return new Response(null, {
      status: 202,
      headers: corsHeaders(),
    });
  }

  if (preferSse || accept.includes("text/event-stream")) {
    const response = mcpSseResponse(result);
    for (const [key, value] of Object.entries(corsHeaders())) {
      response.headers.set(key, value);
    }
    return response;
  }

  const response = mcpJsonResponse(result);
  for (const [key, value] of Object.entries(corsHeaders())) {
    response.headers.set(key, value);
  }
  return response;
}
