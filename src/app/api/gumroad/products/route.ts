import { NextResponse } from "next/server";

function getGumroadToken(): string {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) {
    throw new Error("GUMROAD_ACCESS_TOKEN is not set");
  }
  return token;
}

export const GET = async () => {
  try {
    const token = getGumroadToken();
    const response = await fetch("https://api.gumroad.com/v2/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
