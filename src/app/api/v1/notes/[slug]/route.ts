import type { NextRequest } from "next/server";
import {
  jsonOk,
  methodNotAllowed,
  optionsOk,
  problemResponse,
} from "@/lib/api/errors";
import { getNote } from "@/lib/api/v1/content";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const note = getNote(slug);
  if (!note) {
    return problemResponse({
      code: "note_not_found",
      detail: `No note exists for slug "${slug}".`,
      resolution:
        "List notes via GET /api/v1/notes or search via GET /api/v1/search?q=…, then retry with a valid slug.",
      instance: request.nextUrl.pathname,
    });
  }

  return jsonOk(note, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export function OPTIONS() {
  return optionsOk();
}
