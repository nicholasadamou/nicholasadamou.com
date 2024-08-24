import { ImageResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { getBaseUrl } from "@/app/_utils/getBaseUrl";

const baseUrl = getBaseUrl();

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const title = searchParams.get('title') || 'Default Title'; // Fallback title
	const fontSize = searchParams.get('fontSize') || '64px'; // Optional font size

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'center',
					backgroundImage: `url(${baseUrl}/og-bg.png)`,
					backgroundSize: 'cover', // Use cover to fill the area
				}}
			>
				<div
					style={{
						position: 'absolute',
						bottom: 20,
						left: 40,
						display: 'flex',
						fontSize: fontSize,
						letterSpacing: '-0.025em',
						fontStyle: 'normal',
						color: 'white',
						lineHeight: '100px',
						paddingRight: 50, // Add padding to prevent word from being cut off
						whiteSpace: 'normal', // Allow wrapping
						maxWidth: '90%', // Set a max width to prevent overflow
						overflow: 'hidden', // Hide overflow
						textOverflow: 'ellipsis', // Ellipsis for overflow
						wordWrap: 'break-word', // Break words if necessary
					}}
				>
					{title}
				</div>
			</div>
		),
		{
			width: 1920,
			height: 1080,
		}
	);
}
