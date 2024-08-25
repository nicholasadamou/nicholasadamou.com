/* eslint-disable @next/next/no-img-element */

import { ImageResponse, NextRequest } from "next/server";
import { getBaseUrl } from "@/app/_utils/getBaseUrl";
import { ReactElement, JSXElementConstructor, ReactNode, AwaitedReactNode } from "react";

const baseUrl = getBaseUrl();

const createTextDiv = (
  text:
    | string
    | number
    | bigint
    | boolean
    | ReactElement
    | Iterable<ReactNode>
    | Promise<AwaitedReactNode>
    | null
    | undefined,
  fontSize: string,
  color: string,
  maxWidth: string,
) => (
  <div
    style={{
      paddingRight: "12px",
      fontSize: fontSize,
      lineHeight: "80px",
      color: color,
      whiteSpace: "normal",
      width: "90%",
      maxWidth: maxWidth,
      overflow: "hidden",
      textOverflow: "ellipsis",
      wordBreak: "break-word",
    }}
  >
    {text}
  </div>
);

const createImageDiv = (
  imageSrc: string | undefined,
  altText: string | undefined,
) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        width: "650px",
        height: "850px",
        overflow: "hidden",
      }}
    >
      <img
        src={imageSrc}
        alt={altText}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    </div>
  </div>
);

const createImageResponse = (
  backgroundImage: string,
  title: string,
  headerText: string,
  image: string,
  fontSize: string,
	maxWidth: string,
) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      height: "100%",
      width: "100%",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "20px",
    }}
  >
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: "64px",
      }}
    >
      {headerText && createTextDiv(headerText, "38px", "#aaa", maxWidth)}
      {createTextDiv(title, fontSize, "#fff", maxWidth)}
    </div>
    {image && createImageDiv(`${baseUrl}/${image}`, title)}
  </div>
);

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const title = searchParams.get("title") ?? "Default Title"; // Fallback title
	const type = searchParams.get("type") ?? "blog"; // 'blog', 'project', 'homepage'
	const fontSize = searchParams.get("fontSize") ?? "64px"; // Optional font size
	const image = searchParams.get("image") ?? ""; // Optional image URL

	let headerText = "";
	let maxWidth = "90%";
	const backgroundImage = type === "homepage" ? `${baseUrl}/og/gradient.png` : `${baseUrl}/og/plain.png`;

	switch (type) {
		case "blog":
			headerText = "Check out this article";
			break;
		case "project":
			headerText = "Explore this project";
			break;
		case "homepage":
			maxWidth = "50%";
	}

	const imageResponse = createImageResponse(backgroundImage, title, headerText, image, fontSize, maxWidth);

	return new ImageResponse(imageResponse, {
		width: 1920,
		height: 1080,
	});
}
