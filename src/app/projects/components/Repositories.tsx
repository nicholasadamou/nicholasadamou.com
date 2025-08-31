"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

import Pagination from "@/components/common/Pagination";

import RepositoriesSkeleton from "./RepositoriesSkeleton";
import RepositoryCard from "./RepositoryCard";

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

const Repositories = ({ searchTerm }: RepositoriesProps) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRepos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github/nicholasadamou`);

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      const sortedRepos = sortReposByStarsAndForks(data.projects);

      setRepos(sortedRepos);
    } catch (err) {
      setError("Error fetching repositories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sortReposByStarsAndForks = (repos: Repo[]): Repo[] => {
    return repos.sort((a, b) => {
      if (b.stars !== a.stars) {
        return b.stars - a.stars;
      }
      return b.forks - a.forks;
    });
  };

  const filteredRepos = useMemo(() => {
    if (!searchTerm) return repos;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (repo.description &&
          repo.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [repos, searchTerm]);

  const paginateRepos = (repos: Repo[], page: number): Repo[] => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return repos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const currentRepos = paginateRepos(filteredRepos, currentPage);
  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  if (isLoading) {
    return <RepositoriesSkeleton />;
  }

  if (error) {
    return <p className="mb-4 mt-5 text-red-500">{error}</p>;
  }

  if (filteredRepos.length === 0) {
    return <p className="text-secondary mt-5">No repositories found.</p>;
  }

  return (
    <>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {currentRepos.map((repo) => (
          <RepositoryCard key={repo.name} repo={repo} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Repositories;
