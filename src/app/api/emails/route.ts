import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/content/contact";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Please send a valid JSON project brief." },
      { status: 400 }
    );
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the required fields and try again.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const formcarryUrl = process.env.FORMCARRY_URL;
  if (!formcarryUrl)
    return NextResponse.json(
      {
        message:
          "The contact form is temporarily unavailable. Please try again later.",
      },
      { status: 503 }
    );
  try {
    const response = await fetch(formcarryUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      return NextResponse.json(
        {
          message:
            "Your brief could not be delivered. Your details have been kept in the form; please try again.",
        },
        { status: 502 }
      );
    return NextResponse.json({ message: "Project brief sent successfully." });
  } catch {
    return NextResponse.json(
      {
        message:
          "The delivery service is unavailable. Please try again shortly.",
      },
      { status: 502 }
    );
  }
}
