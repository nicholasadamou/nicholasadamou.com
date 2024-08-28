import React from "react";
import { Metadata } from "next";

import Link from "@/app/components/Link";

export const metadata: Metadata = {
  title: "404 | Nicholas Adamou",
  description: "Uh oh! This page does not exist",
};

const Custom404 = (): React.ReactNode => (
	<div className="flex flex-col gap-2 px-4 max-w-[700px] mx-auto">
		<h1 className="text-3xl font-bold tracking-tight text-primary">404</h1>
		<p className="text-secondary max-w-sm">
			404 - Oh no, you found a page that&apos;s missing stuff.
		</p>
		<div className="h-2" />
		<Link href="/" underline>
			Return home
		</Link>
	</div>
);

export default Custom404;
