import React from 'react';
import Image from 'next/image';
import Link from '@/app/components/Link';

type ImageAttributionProps = {
	imageSrc: string;
	imageAlt: string;
	imageAuthor?: string;
	imageAuthorUrl?: string;
	imageUrl?: string;
};

function getDomain(url: string): string {
	try {
		return new URL(url).hostname.replace('www.', '');
	} catch {
		return '';
	}
}

const HeaderImage: React.FC<ImageAttributionProps> = ({
																														 imageSrc,
																														 imageAlt,
																														 imageAuthor,
																														 imageAuthorUrl,
																														 imageUrl,
																													 }) => {
	const domain = imageUrl ? getDomain(imageUrl) : '';
	const hasAttribution = imageAuthor && imageAuthorUrl && imageUrl;

	return (
		<div className="flex flex-col gap-2">
			<div className="relative h-[350px] overflow-hidden">
				<Image
					src={imageSrc}
					alt={imageAlt}
					fill
					className="rounded-lg object-cover"
					priority
					sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
				/>
			</div>
			{hasAttribution && (
				<small className="text-tertiary italic">
					Photo by{' '}
					<Link href={imageAuthorUrl}>
						{imageAuthor}
					</Link>{' '}
					on{' '}
					<Link href={imageUrl}>
						{domain}
					</Link>
					.
				</small>
			)}
		</div>
	);
};

export default HeaderImage;
