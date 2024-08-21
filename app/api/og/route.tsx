import { ImageResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { getBaseUrl } from "@/app/_utils/getBaseUrl";

const baseUrl = getBaseUrl();

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const postTitle = searchParams.get('title') || 'Default Title'; // Fallback title
	const fontSize = searchParams.get('fontSize') || '105px'; // Optional font size

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
					backgroundSize: 'cover',
				}}
			>
				<div
					style={{
						marginLeft: 120,
						marginRight: 205,
						marginBottom: 205,
						display: 'flex',
						fontSize: fontSize,
						letterSpacing: '-0.025em',
						fontStyle: 'normal',
						color: 'white',
						lineHeight: '110px',
						whiteSpace: 'pre-wrap',
					}}
				>
					{postTitle}
				</div>
			</div>
		),
		{
			width: 1920,
			height: 1080,
		}
	);
}
