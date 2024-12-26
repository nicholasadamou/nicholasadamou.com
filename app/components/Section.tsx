"use client";

import React, { ReactNode } from "react";
import clsx from "clsx";
import { PinIcon } from "lucide-react";

type SectionProps = {
  heading: string;
  headingAlignment?: "right" | "left";
	showPin?: boolean;
	isPinned?: boolean;
  children: ReactNode;
  invert?: boolean;
};

export default function Section({
  heading,
  headingAlignment,
	showPin = true,
	isPinned,
  children,
  invert = false,
}: SectionProps) {
  return (
    <section
      className="col-reverse flex flex-col gap-0 md:flex-row md:gap-2"
      id={heading.toLowerCase().replace(/\s/g, "-")}
    >
      <div>
				<h2
					className={clsx(
						"shrink-0 md:w-32",
						headingAlignment === "right" && "md:text-right",
						invert ? "font-medium text-primary" : "text-secondary",
					)}
				>
					{heading}
				</h2>
				{(showPin && isPinned) && (
					<div className="inline-flex items-center gap-1 text-tertiary">
						<PinIcon className="w-[18px]" />
						(Pinned)
					</div>
				)}
			</div>
      {children}
    </section>
  );
}
