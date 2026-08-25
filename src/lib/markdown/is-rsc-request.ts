/**
 * Next.js App Router sends these headers on RSC / soft navigations.
 * Markdown content negotiation must not rewrite those requests or the
 * client router breaks.
 */
export function isRscRequest(headers: Headers): boolean {
  return (
    headers.has("rsc") ||
    headers.has("next-router-state-tree") ||
    headers.has("next-router-prefetch")
  );
}
