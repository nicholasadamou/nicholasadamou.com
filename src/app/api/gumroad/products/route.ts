import { NextResponse } from "next/server";

const { GUMROAD_ACCESS_TOKEN } = process.env;

if (!GUMROAD_ACCESS_TOKEN) {
  throw new Error("GUMROAD_ACCESS_TOKEN is not set");
}

export const GET = async () => {
  try {
    const response = await fetch("https://api.gumroad.com/v2/products", {
      headers: {
        Authorization: `Bearer ${GUMROAD_ACCESS_TOKEN}`,
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
