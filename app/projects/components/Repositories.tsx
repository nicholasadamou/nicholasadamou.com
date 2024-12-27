"use client";

import React, { useEffect, useState, useMemo } from "react";
import { GitFork, Star } from "lucide-react";
import { Parallax } from "@/app/components/Parallax";
import { CardItem } from "@/app/components/CardItem";
import { Button } from "@/app/components/ui/button";

interface Repo {
	name: string;
	description: string | null;
	language: string | null;
	stars: number;
	forks: number;
	url: string;
}

type RepositoriesProps = {
	searchTerm?: string;
};

const ITEMS_PER_PAGE = 6;

const Repositories = ({ searchTerm }: RepositoriesProps ) => {
	const [repos, setRepos] = useState<Repo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const fetchRepos = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`/api/github/nicholasadamou`);
			if (!response.ok) {
				throw new Error("Failed to fetch repositories");
			}
			const data = await response.json();

			// Sort the repositories by stars and forks
			const sortedRepos = data.projects.sort((a: Repo, b: Repo) => {
				if (b.stars !== a.stars) {
					return b.stars - a.stars; // Sort by stars first
				}
				return b.forks - a.forks; // Then sort by forks if stars are equal
			});
			setRepos(sortedRepos);
		} catch (err) {
			setError("Error fetching repositories. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchRepos();
	}, []);

	const filteredRepos = useMemo(() => {
		if (!searchTerm) return repos;
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		return repos.filter(
			(repo) =>
				repo.name.toLowerCase().includes(lowerCaseSearchTerm) ||
				(repo.description && repo.description.toLowerCase().includes(lowerCaseSearchTerm))
		);
	}, [repos, searchTerm]);

	const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentRepos = filteredRepos.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			{isLoading && (
				<p className="mt-5 text-[var(--secondary-color)]">Loading repositories...</p>
			)}
			{error && <p className="mt-5 mb-4 text-red-500">{error}</p>}
			{filteredRepos.length > 0 && (
				<>
					<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
						{currentRepos.map((repo) => (
							<Parallax key={repo.name} className="h-full w-full">
								<CardItem className="backdrop-blur-3xl flex h-full flex-col items-start rounded-md bg-tertiary p-4">
									<div className="flex-grow">
										<h3 className="mb-2 text-lg font-bold text-primary">
											{repo.name}
										</h3>
										{repo.description && (
											<p className="mb-4 line-clamp-2 text-secondary">
												{repo.description}
											</p>
										)}
									</div>
									<div className="mb-4 flex items-center gap-4">
										<div className="flex items-center space-x-1">
											<Star className="h-4 w-4 text-secondary" />
											<span className="text-xs">
                        {repo.stars.toLocaleString()}
                      </span>
										</div>
										<div className="flex items-center space-x-1">
											<GitFork className="h-4 w-4 text-secondary" />
											<span className="text-xs">
                        {repo.forks.toLocaleString()}
                      </span>
										</div>
										{repo.language && (
											<span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary">
                        {repo.language}
                      </span>
										)}
									</div>
									<Button
										asChild
										className="w-full cursor-pointer bg-primary text-primary hover:bg-secondary"
									>
										<a
											href={repo.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center justify-center"
										>
											Learn More
										</a>
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
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								variant="outline"
								className="p-4"
							>
								<span className="sr-only">Previous page</span>
								Previous
							</Button>
							<Button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								variant="outline"
								className="p-4"
							>
								<span className="sr-only">Next page</span>
								Next
							</Button>
						</div>
					</nav>
				</>
			)}
		</>
	);
};

export default Repositories;
