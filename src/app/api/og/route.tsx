import { readFileSync } from "node:fs";
import { join } from "node:path";
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

    const companyLogo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/onebrief.png")).toString("base64")}`;
    return new ImageResponse(
      <OGLayout {...processedParams} companyLogo={companyLogo} />,
      {
        fonts: ([400, 600, 700] as const).map((weight) => ({
          name: "Inter",
          data: readFileSync(
            join(process.cwd(), `public/fonts/inter-${weight}.ttf`)
          ),
          weight,
          style: "normal" as const,
        })),
        width: LAYOUT.container.width,
        height: LAYOUT.container.height,
      }
    );
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
