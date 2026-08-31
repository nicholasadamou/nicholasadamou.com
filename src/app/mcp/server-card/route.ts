import { getMcpServerCard } from "@/lib/mcp/server";

function jsonManifest(body: unknown): Response {
  return Response.json(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Accept, Content-Type, If-None-Match, MCP-Protocol-Version",
    },
  });
}

export function GET() {
  return jsonManifest(getMcpServerCard());
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
      "Cache-Control": "public, max-age=86400",
    },
  });
}
