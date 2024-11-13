"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from "axios";

interface InlineEmbedProps {
	id: string;
}

const YouTubeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="red"
		stroke="red"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
		<path d="m10 15 5-3-5-3z" stroke="white" fill="white"></path>
	</svg>
);

const ExternalLinkIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path>
		<path d="m21 3-9 9"></path>
		<path d="M15 3h6v6"></path>
	</svg>
);

const InlineEmbed: React.FC<InlineEmbedProps> = ({ id }) => {
	const [videoTitle, setVideoTitle] = useState<string | null>(null);
	const [channelTitle, setChannelTitle] = useState<string | null>(null);
	const videoUrl = `https://www.youtube.com/watch?v=${id}`;

	useEffect(() => {
		if (id) {
			axios
				.get(`/api/youtube/video`, { params: { id } })
				.then((response) => {
					const data = response.data;
					setVideoTitle(data.title || 'Video Title');
					setChannelTitle(data.channelTitle || 'Channel Title');
				})
				.catch(() => {
					setVideoTitle('Video Title');
					setChannelTitle('Channel Title');
				});
		}
	}, [id]);

	if (!id) return null; // Render nothing if videoId is invalid

	return (
		<Link
			href={videoUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="not-prose flex items-center gap-3 no-underline border border-zinc-200 dark:border-zinc-600 rounded-lg px-4 py-2.5 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
		>
			<YouTubeIcon />
			<div className="leading-tight">
				<p className="font-medium">{videoTitle || 'Loading...'}</p>
				<p className="text-sm font-light text-zinc-500">{channelTitle || 'Loading...'}</p>
			</div>
			<div className="text-react-link ml-auto">
				<ExternalLinkIcon />
			</div>
		</Link>
	);
};

export default InlineEmbed;
