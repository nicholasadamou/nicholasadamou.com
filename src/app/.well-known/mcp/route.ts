import { getMcpServerCard } from "@/lib/mcp/server";

/** SEP-1960-style discovery endpoint (also returns the server card). */
export function GET() {
  return Response.json(getMcpServerCard(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Accept, Content-Type, If-None-Match, MCP-Protocol-Version",
      Vary: "Accept",
    },
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Accept, Content-Type, If-None-Match, MCP-Protocol-Version",
    },
  });
}
