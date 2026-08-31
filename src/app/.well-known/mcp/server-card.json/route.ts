import { getMcpServerCard } from "@/lib/mcp/server";

/** SEP-1649 server card at the well-known compatibility URL. */
export function GET() {
  return Response.json(getMcpServerCard(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
