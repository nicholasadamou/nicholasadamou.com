import { getAiCatalog } from "@/lib/mcp/server";

export function GET() {
  return Response.json(getAiCatalog(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
