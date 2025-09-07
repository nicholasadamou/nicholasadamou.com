import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OGLayout } from "./components/OGLayout";
import { LAYOUT } from "./constants";
import {
  cleanSearchParams,
  extractOGParams,
  processOGParams,
} from "./utils/params";
import { logError, logGenerationSuccess, logOGRequest } from "./utils/logger";

/**
 * Open Graph image generation route
 *
 * Generates dynamic Open Graph images for social media sharing with:
 * - Modern design with brand-consistent gradients
 * - Support for different page types (homepage, project, note, etc.)
 * - Local and external image support with base64 conversion
 * - Professional typography and spacing
 * - Proper error handling and fallbacks
 *
 * Query Parameters:
 * - title: Main title text (default: "Nicholas Adamou")
 * - description: Optional description text
 * - type: Page type (homepage|project|note|projects|notes|contact|gallery)
 * - image: Optional image path (local or external URL)
 *
 * Example URLs:
 * - /api/og?title=My%20Project&type=project
 * - /api/og?title=Homepage&type=homepage&description=Welcome
 * - /api/og?title=Blog%20Post&type=note&image=/images/photo.jpg
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Log request for debugging
    logOGRequest(searchParams);

    // Clean and normalize parameters
    cleanSearchParams(searchParams);

    // Extract and validate parameters
    const ogParams = extractOGParams(searchParams);

    // Construct base URL from request headers for local development
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `${protocol}://${host}`;

    // Process parameters (load images, generate header text, etc.)
    const processedParams = await processOGParams(ogParams, baseUrl);

    // Log successful processing
    logGenerationSuccess({
      title: processedParams.title,
      type: processedParams.type,
      hasImage: !!processedParams.processedImage,
    });

    // Generate the Open Graph image
    return new ImageResponse(<OGLayout {...processedParams} />, {
      width: LAYOUT.container.width,
      height: LAYOUT.container.height,
    });
  } catch (error) {
    logError("Image generation failed", error);

    // Return a basic error image
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            color: "#e2e8f0",
            fontSize: "48px",
            fontWeight: "bold",
          }}
        >
          Error generating image
        </div>
      ),
      {
        width: LAYOUT.container.width,
        height: LAYOUT.container.height,
      }
    );
  }
}
