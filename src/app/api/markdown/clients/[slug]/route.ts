import { getCaseStudy } from "@/lib/content/case-studies";
import { markdownResponse } from "@/lib/markdown/response";
import { getNotFoundMarkdown } from "@/lib/markdown/pages";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const study = getCaseStudy((await params).slug);
  return study
    ? markdownResponse(
        `# ${study.name}\n\n${study.description}\n\n[Visit website](${study.href})\n\n${study.content}`
      )
    : markdownResponse(getNotFoundMarkdown(), { status: 404 });
}
