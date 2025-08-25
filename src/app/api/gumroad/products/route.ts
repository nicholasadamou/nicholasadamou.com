import { NextResponse } from "next/server";

// Function to get Gumroad token with runtime validation
function getGumroadToken(): string {
  const GUMROAD_ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;
  if (!GUMROAD_ACCESS_TOKEN) {
    throw new Error("GUMROAD_ACCESS_TOKEN is not set");
  }
  return GUMROAD_ACCESS_TOKEN;
}

export const GET = async () => {
  try {
    const token = getGumroadToken();
    const response = await fetch("https://api.gumroad.com/v2/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
