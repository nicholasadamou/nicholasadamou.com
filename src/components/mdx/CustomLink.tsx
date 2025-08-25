import React from "react";
import Link from "@/components/common/Link";

interface CustomLinkProps
	extends React.DetailedHTMLProps<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	> {}

const CustomLink: React.FC<CustomLinkProps> = (props) => {
	const href = props?.href;
	const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

	if (isInternalLink) {
		return (
			<Link {...props} href={href} underline>
				{props.children}
			</Link>
		);
	}
	return (
		<a
			target="_blank"
			rel="noopener noreferrer"
			className="font-normal underline underline-offset-4 text-link"
			{...props}
		/>
	);
};

export default CustomLink;
