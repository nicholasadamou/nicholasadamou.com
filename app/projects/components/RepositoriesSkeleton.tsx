"use client";

import React from "react";

import { Parallax } from "@/app/components/Parallax";
import { CardItem } from "@/app/components/CardItem";
import { Button } from "@/app/components/ui/button";

const ITEMS_PER_PAGE = 6;

const RepositoriesSkeleton = () => {
	return (
		<>
			<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
				{Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
					<Parallax key={index} className="h-full w-full">
						<CardItem className="backdrop-blur-3xl flex h-full flex-col items-start rounded-md bg-tertiary p-4">
							<div className="flex-grow w-full">
								<div className="mb-2 h-6 w-3/4 bg-primary/20 rounded animate-pulse" />
								<div className="mb-4 h-4 w-full bg-secondary/20 rounded animate-pulse" />
								<div className="mb-4 h-4 w-5/6 bg-secondary/20 rounded animate-pulse" />
							</div>
							<div className="mb-4 flex items-center gap-4 w-full">
								<div className="flex items-center space-x-1">
									<div className="h-4 w-4 bg-secondary/20 rounded animate-pulse" />
									<div className="h-3 w-8 bg-secondary/20 rounded animate-pulse" />
								</div>
								<div className="flex items-center space-x-1">
									<div className="h-4 w-4 bg-secondary/20 rounded animate-pulse" />
									<div className="h-3 w-8 bg-secondary/20 rounded animate-pulse" />
								</div>
								<div className="h-6 w-16 bg-primary/20 rounded-full animate-pulse" />
							</div>
							<Button
								className="mt-10 block w-full rounded-md bg-[#111] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90"
								disabled
							>
								<span className="sr-only">Learn More placeholder</span>
								<div className="h-4 w-24 bg-current opacity-20 rounded animate-pulse" />
							</Button>
						</CardItem>
					</Parallax>
				))}
			</div>
			<nav
				className="mt-8 flex items-center justify-center"
				aria-label="Pagination"
			>
				<div className="flex items-center space-x-2">
					<Button
						disabled
						variant="outline"
						className="p-4 dark:bg-white dark:text-black light:bg-black light:text-white"
					>
						<span className="sr-only">Previous page placeholder</span>
						<div className="h-4 w-16 bg-current opacity-20 rounded animate-pulse" />
					</Button>
					<Button
						disabled
						variant="outline"
						className="p-4 dark:bg-white dark:text-black light:bg-black light:text-white"
					>
						<span className="sr-only">Next page placeholder</span>
						<div className="h-4 w-16 bg-current opacity-20 rounded animate-pulse" />
					</Button>
				</div>
			</nav>
		</>
	);
};

export default RepositoriesSkeleton;

