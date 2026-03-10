import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const formcarryUrl = process.env.FORMCARRY_URL;
    if (!formcarryUrl) {
      return NextResponse.json(
        { message: "FORMCARRY_URL is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(formcarryUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      return NextResponse.json({ message: "Email sent successfully" });
    }

    const data = await response.json();
    return NextResponse.json(
      { message: data.title || "Error sending email" },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 }
    );
  }
}
