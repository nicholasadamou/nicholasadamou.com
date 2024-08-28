"use client";

import React, { useEffect } from "react";
import { useTheme } from "next-themes";

export default function WorkWithMePage() {
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		// Load Stripe script
		const script = document.createElement("script");
		script.src = "https://js.stripe.com/v3/pricing-table.js";
		script.async = true;
		document.body.appendChild(script);

		// Clean up script on component unmount
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const pricingTableId = resolvedTheme === "dark"
		? "prctbl_1PskfCFOUeuyFeHJmrqc5UB7"
		: "prctbl_1Psq2pFOUeuyFeHJdCPe6YNC";

	const publishableKey = "pk_live_51Joz56FOUeuyFeHJaAHTFWrJUevoIQMObhlQLYMXRxqgM2fpZmvytLRO7YZIrlp0i4rc2uBmLaQU5Fr97NpqMiEd00NAo4SnqS";

	return (
		<div className="flex flex-col gap-16 md:gap-10">
			<div className="mx-auto flex max-w-[700px] flex-col gap-8 px-4">
				<div>
					<h1 className="animate-in text-3xl font-bold tracking-tight">
						Work With Me
					</h1>
					<p
						className="mt-5 animate-in text-secondary"
						style={{ "--index": 1 } as React.CSSProperties}
					>
						Whether you want my team to build your next project, or you&apos;re
						looking for some guidance in your coding journey, you can schedule
						some time with me on a monthly basis or for a one-time consultation.
					</p>
				</div>
			</div>
			<div
				className="animate-in overflow-hidden rounded-3xl dark:bg-[#111] light:bg-white pb-16 pt-12"
				style={{ "--index": 2 } as React.CSSProperties}
			>
				<stripe-pricing-table
					pricing-table-id={pricingTableId}
					publishable-key={publishableKey}
				></stripe-pricing-table>
			</div>
		</div>
	);
}
