'use client';

import React, { ReactNode } from "react";

interface CardProps {
	icon: ReactNode;
	title: string;
	description: string;
}

export function Card({ icon, title, description }: CardProps): React.JSX.Element {
	return (
		<div className={"flex flex-col p-4 rounded-2xl bg-tertiary"}>
			<div className="flex items-start gap-3 mb-2">
				<div className="w-3 h-3 mr-2 text-secondary">{icon}</div>
				<h3 className="text-primary text-lg font-bold">{title}</h3>
			</div>
			<p className="text-secondary">{description}</p>
		</div>
	);
}
