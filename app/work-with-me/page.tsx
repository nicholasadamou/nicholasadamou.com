"use client";

import React, { useEffect } from "react";

export default function WorkWithMePage() {
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

	return (
		<div className="flex flex-col gap-16 md:gap-10">
			<div className="flex flex-col gap-8 px-4 max-w-[700px] mx-auto">
				<div>
					<h1 className="animate-in text-3xl font-bold tracking-tight">Work With Me</h1>
					<p
						className="mt-5 animate-in text-secondary"
						style={{ "--index": 1 } as React.CSSProperties}
					>
						Whether you want my team to build your next project, or you&apos;re looking for some guidance in your coding journey, you can schedule some time with me on a monthly basis or for a one-time consultation.
					</p>
				</div>
			</div>
			<div
				className="animate-in pt-12 pb-16 bg-[#111] rounded-3xl overflow-hidden"
				style={{ "--index": 2 } as React.CSSProperties}
			>
				<stripe-pricing-table
					pricing-table-id="prctbl_1PskfCFOUeuyFeHJmrqc5UB7"
					publishable-key="pk_live_51Joz56FOUeuyFeHJaAHTFWrJUevoIQMObhlQLYMXRxqgM2fpZmvytLRO7YZIrlp0i4rc2uBmLaQU5Fr97NpqMiEd00NAo4SnqS"
				></stripe-pricing-table>
			</div>
		</div>
	);
}
