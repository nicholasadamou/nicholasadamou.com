"use client";

import React from "react";
import { GitFork, Star } from "lucide-react";
import { Parallax } from "@/components/common/effects/Parallax";
import { CardItem } from "@/components/common/ui/CardItem";
import { Button } from "@/components/ui/button";

interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
}

const RepositoryCard = ({ repo }: { repo: Repo }) => (
  <Parallax className="h-full w-full">
    <CardItem className="bg-tertiary flex h-full flex-col items-start rounded-md p-4 backdrop-blur-3xl">
      <div className="flex-grow">
        <h3 className="text-primary mb-2 text-lg font-bold">{repo.name}</h3>
        {repo.description && (
          <p className="text-secondary mb-4 line-clamp-2">{repo.description}</p>
        )}
      </div>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center space-x-1">
          <Star className="text-secondary h-4 w-4" />
          <span className="text-xs">{repo.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <GitFork className="text-secondary h-4 w-4" />
          <span className="text-xs">{repo.forks.toLocaleString()}</span>
        </div>
        {repo.language && (
          <span className="bg-primary text-secondary rounded-full px-2 py-1 text-xs">
            {repo.language}
          </span>
        )}
      </div>
      <Button
        asChild
        className="mt-10 block w-full rounded-md bg-[#111] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90"
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
);

export default RepositoryCard;
