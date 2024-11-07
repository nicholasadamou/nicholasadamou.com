/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getBaseUrl } from "@/app/_utils/getBaseUrl";
import { ReactElement, ReactNode, AwaitedReactNode } from "react";

const baseUrl = getBaseUrl();

const createTextDiv = (
	text: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined,
	fontSize: string,
	color: string,
	maxWidth: string,
	lineHeight: string
) => (
	<div
		style={{
			paddingRight: "12px",
			marginLeft: "20px",
			fontSize: fontSize,
			lineHeight: lineHeight,
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
				marginRight: "20px",
				overflow: "hidden",
			}}
		>
			<img
				src={imageSrc} // Ensure this is a valid URL
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
	description: string,
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
			{headerText && createTextDiv(headerText, "38px", "#aaa", maxWidth, "80px")}
			{createTextDiv(title, fontSize, "#fff", maxWidth, "80px")}
			{description && createTextDiv(description, "32px", "#aaa", maxWidth, "64px")}
		</div>
		{image && createImageDiv(`${baseUrl}${image}`, title)} {/* Ensure image is a full URL */}
	</div>
);

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const title = searchParams.get("title") ?? "Default Title"; // Fallback title
	const description = searchParams.get("description") ?? ""; // Fallback description
	const type = searchParams.get("type") ?? searchParams.get("amp;type") ?? "note"; // 'note', 'project', 'homepage'
	const fontSize = searchParams.get("fontSize") ?? "64px"; // Optional font size
	const image = searchParams.get("image") ?? searchParams.get("amp;image") ?? ""; // Optional image URL

	let headerText = "";
	let maxWidth = "90%";
	const backgroundImage = type === "homepage" ? `${baseUrl}/og/gradient.png` : `${baseUrl}/og/plain.png`;

	switch (type) {
		case "note":
			headerText = "Check out this note";
			break;
		case "project":
			headerText = "Explore this project";
			break;
		case "homepage":
			maxWidth = "50%";
			break;
	}

	const imageResponse = createImageResponse(backgroundImage, title, description, headerText, image, fontSize, maxWidth);

	return new ImageResponse(imageResponse, {
		width: 1920,
		height: 1080,
	});
}

