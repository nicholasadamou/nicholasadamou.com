import { getOpenApiDocument } from "@/lib/openapi";

export function GET() {
  return Response.json(getOpenApiDocument(), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
