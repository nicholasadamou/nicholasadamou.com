import Image, { StaticImageData } from "next/image";
import clsx from "clsx";

export default function Avatar({
																 src,
																 alt,
																 initials,
																 size = "sm",
															 }: {
	src?: string | StaticImageData;
	alt?: string;
	initials?: string | null;
	size?: "sm" | "md" | "lg";
}) {
	initials = initials?.slice(0, 2);

	// Define sizes based on the size prop
	const sizes = {
		sm: "(max-width: 640px) 2.5rem, (max-width: 768px) 2.5rem, 2.5rem", // 10px
		md: "(max-width: 640px) 3.5rem, (max-width: 768px) 3.5rem, 3.5rem", // 14px
		lg: "(max-width: 640px) 6rem, (max-width: 768px) 6rem, 6rem", // 24px
	}[size];

	return (
		<div
			className={clsx(
				"relative inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle font-medium uppercase text-primary",
				size === "sm" && "h-10 w-10 bg-tertiary text-sm",
				size === "md" && "h-14 w-14 bg-tertiary text-base",
				size === "lg" && "h-24 w-24 bg-secondary text-2xl",
			)}
		>
			{!src || src === "" ? (
				<div>{initials || ""}</div>
			) : (
				<Image
					src={src}
					alt={alt || ""}
					fill
					sizes={sizes}
					className="object-cover"
				/>
			)}
		</div>
	);
}
