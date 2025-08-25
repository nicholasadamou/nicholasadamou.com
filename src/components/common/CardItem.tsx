import React from "react"

import { cn } from "@/lib/utils/utils"

interface CardItemProps {
	className?: string
	children?: React.ReactNode
}

export function CardItem({ className, children }: CardItemProps) {
	return (
		<div
			className={cn(
				"bg-tertiary flex size-full items-center justify-center rounded-xl border border-primary",
				className
			)}
		>
			{children}
		</div>
	)
}
