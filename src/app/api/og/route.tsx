import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OGLayout } from "./components/OGLayout";
import { LAYOUT } from "./constants";
import {
  cleanSearchParams,
  extractOGParams,
  processOGParams,
} from "./utils/params";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    cleanSearchParams(searchParams);
    const ogParams = extractOGParams(searchParams);

    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";

    let baseUrl: string;
    if (host?.includes("nicholasadamou.com")) {
      baseUrl = "https://nicholasadamou.com";
    } else {
      baseUrl = `${protocol}://${host}`;
    }

    const processedParams = await processOGParams(ogParams, baseUrl);

    return new ImageResponse(<OGLayout {...processedParams} />, {
      width: LAYOUT.container.width,
      height: LAYOUT.container.height,
    });
  } catch (error) {
    console.error("OG image generation failed:", error);

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)",
          color: "#fafaf9",
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        Nicholas Adamou
      </div>,
      {
        width: LAYOUT.container.width,
        height: LAYOUT.container.height,
      }
    );
  }
}
