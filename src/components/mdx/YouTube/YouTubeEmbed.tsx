import React from 'react';

import InlineEmbed from './InlineEmbed';
import PlayerEmbed from './PlayerEmbed';

interface YouTubeEmbedProps {
	url: string;
	inline: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, inline = false }) => {
	const extractVideoId = (url: string): string | null => {
		const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	};

	const id = extractVideoId(url);

	if (!id) {
		return null;
	}

	if (inline) {
		return <InlineEmbed id={id} />;
	}

	return <PlayerEmbed id={id} />;
};

export default YouTubeEmbed;
