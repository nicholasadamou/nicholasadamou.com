"use client";

import React from "react";

import { Parallax } from "@/components/common/Parallax";
import { CardItem } from "@/components/common/CardItem";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

const RepositoriesSkeleton = () => {
  return (
    <>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
          <Parallax key={index} className="h-full w-full">
            <CardItem className="flex h-full flex-col items-start rounded-md bg-tertiary p-4 backdrop-blur-3xl">
              <div className="w-full flex-grow">
                <div className="bg-primary/20 mb-2 h-6 w-3/4 animate-pulse rounded" />
                <div className="bg-secondary/20 mb-4 h-4 w-full animate-pulse rounded" />
                <div className="bg-secondary/20 mb-4 h-4 w-5/6 animate-pulse rounded" />
              </div>
              <div className="mb-4 flex w-full items-center gap-4">
                <div className="flex items-center space-x-1">
                  <div className="bg-secondary/20 h-4 w-4 animate-pulse rounded" />
                  <div className="bg-secondary/20 h-3 w-8 animate-pulse rounded" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="bg-secondary/20 h-4 w-4 animate-pulse rounded" />
                  <div className="bg-secondary/20 h-3 w-8 animate-pulse rounded" />
                </div>
                <div className="bg-primary/20 h-6 w-16 animate-pulse rounded-full" />
              </div>
              <Button
                className="mt-10 flex w-full items-center rounded-md bg-[#111] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90"
                disabled
              >
                <span className="sr-only">Learn More placeholder</span>
                <div className="h-4 w-24 animate-pulse rounded bg-current opacity-20" />
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
            className="light:bg-black light:text-white p-4 dark:bg-white dark:text-black"
          >
            <span className="sr-only">Previous page placeholder</span>
            <div className="h-4 w-16 animate-pulse rounded bg-current opacity-20" />
          </Button>
          <Button
            disabled
            variant="outline"
            className="light:bg-black light:text-white p-4 dark:bg-white dark:text-black"
          >
            <span className="sr-only">Next page placeholder</span>
            <div className="h-4 w-16 animate-pulse rounded bg-current opacity-20" />
          </Button>
        </div>
      </nav>
    </>
  );
};

export default RepositoriesSkeleton;
