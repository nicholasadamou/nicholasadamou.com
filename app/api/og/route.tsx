/* eslint-disable @next/next/no-img-element */

import { ImageResponse, NextRequest } from "next/server";
import { getBaseUrl } from "@/app/_utils/getBaseUrl";

const baseUrl = getBaseUrl();

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const title = searchParams.get("title") || "Default Title"; // Fallback title
	const type = searchParams.get("type") || "blog"; // 'blog', 'project', 'homepage'
	const fontSize = searchParams.get("fontSize") || "64px"; // Optional font size
	const image = searchParams.get("image") || ""; // Optional image URL

	let headerText = "";

	switch (type) {
		case "blog":
			headerText = "Check out this article";
			break;
		case "project":
			headerText = "Explore this project";
			break;
		case "homepage":
			break;
	}

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					height: "100%",
					width: "100%",
					backgroundColor: '#111',
					padding: "20px",
					justifyContent: "space-between",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						marginTop: "64px",
						alignItems: "flex-start", // Align text to the top
						justifyContent: "flex-start",
					}}
				>
					{headerText && (
						<div
							style={{
								fontSize: "32px",
								lineHeight: "80px",
								color: "#aaa",
								paddingRight: "12px",
								whiteSpace: "normal",
								overflow: "hidden",
								textOverflow: "ellipsis",
								wordBreak: "break-word",
							}}
						>
							{headerText}
						</div>
					)}
					<div
						style={{
							fontSize: fontSize,
							lineHeight: "80px",
							color: "#fff",
							paddingRight: "12px",
							whiteSpace: "normal",
							width: "90%",
							maxWidth: "90%",
							overflow: "hidden",
							textOverflow: "ellipsis",
							wordBreak: "break-word",
						}}
					>
						{title}
					</div>
				</div>
				{image && (
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
								src={`${baseUrl}/${image}`} // Use the image URL
								alt={title} // Alternative text for the image
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									borderRadius: "8px",
								}}
							/>
						</div>
					</div>
				)}
			</div>
		),
		{
			width: 1920,
			height: 1080,
		}
	);
}
