import { jsonOk, methodNotAllowed, optionsOk } from "@/lib/api/errors";
import { listProjects } from "@/lib/api/v1/content";

export function GET() {
  const projects = listProjects();
  return jsonOk(
    { projects, count: projects.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  );
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export function OPTIONS() {
  return optionsOk();
}
