import React from 'react';

interface YouTubeEmbedProps {
	url: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url }) => {
	return (
		<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
			<iframe
				width="560"
				height="315"
				src={url}
				allowFullScreen
				style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
			></iframe>
		</div>
	);
};

export default YouTubeEmbed;
