import {
  getNoteArticleMarkdown,
  getNotFoundMarkdown,
} from "@/lib/markdown/pages";
import { markdownResponse } from "@/lib/markdown/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const markdown = getNoteArticleMarkdown(slug);

  if (!markdown) {
    return markdownResponse(getNotFoundMarkdown(), { status: 404 });
  }

  return markdownResponse(markdown);
}
