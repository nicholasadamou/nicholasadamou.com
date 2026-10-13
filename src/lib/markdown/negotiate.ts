function qValue(entry: string): number {
  const match = entry.match(/;\s*q=([\d.]+)/);
  if (!match) return 1;
  const q = parseFloat(match[1]);
  return Number.isNaN(q) ? 0 : q;
}

/**
 * Per https://acceptmarkdown.com: honor q-values and prefer `text/markdown`
 * over `text/html` when the client's Accept header ranks it at least as
 * high (e.g. a bare `Accept: text/markdown`, or `text/markdown` with a q
 * greater than or equal to `text/html`'s).
 */
export function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;

  const entries = acceptHeader.split(",").map((entry) => entry.trim());
  const markdownEntry = entries.find((entry) =>
    entry.startsWith("text/markdown")
  );
  if (!markdownEntry) return false;

  const markdownQ = qValue(markdownEntry);
  if (markdownQ <= 0) return false;

  const htmlEntry = entries.find((entry) => entry.startsWith("text/html"));
  const htmlQ = htmlEntry ? qValue(htmlEntry) : 0;

  return markdownQ >= htmlQ;
}

/**
 * Whether a 404 recovery response should be Markdown instead of HTML.
 * Agents and curl often send no Accept header or only a wildcard type,
 * so treat those as Markdown-friendly while still honoring explicit HTML.
 */
export function prefersMarkdownRecovery(acceptHeader: string | null): boolean {
  if (prefersMarkdown(acceptHeader)) return true;
  if (!acceptHeader) return true;

  const trimmed = acceptHeader.trim();
  if (trimmed === "*/*") return true;

  const entries = acceptHeader.split(",").map((entry) => entry.trim());
  const htmlEntry = entries.find((entry) => entry.startsWith("text/html"));
  if (!htmlEntry) return true;

  return qValue(htmlEntry) <= 0;
}
