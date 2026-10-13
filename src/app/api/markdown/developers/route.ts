import { getDevelopersMarkdown } from "@/lib/markdown/pages";
import { markdownResponse } from "@/lib/markdown/response";

export function GET() {
  return markdownResponse(getDevelopersMarkdown());
}
