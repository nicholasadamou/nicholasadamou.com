import { getNotFoundMarkdown } from "@/lib/markdown/pages";
import { markdownResponse } from "@/lib/markdown/response";

export function GET() {
  return markdownResponse(getNotFoundMarkdown(), { status: 404 });
}
