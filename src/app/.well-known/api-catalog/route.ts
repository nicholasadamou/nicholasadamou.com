import { getBaseUrl } from "@/lib/og";

/**
 * RFC 9727 API catalog — a linkset that points agents at the OpenAPI
 * description of this host's public surface.
 * https://www.rfc-editor.org/rfc/rfc9727.html
 */
export function GET() {
  const baseUrl = getBaseUrl();

  const body = {
    linkset: [
      {
        anchor: baseUrl,
        "service-desc": [
          {
            href: `${baseUrl}/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${baseUrl}/developers`,
            type: "text/html",
          },
        ],
      },
    ],
  };

  return Response.json(body, {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
