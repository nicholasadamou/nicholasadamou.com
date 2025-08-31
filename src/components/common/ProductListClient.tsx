"use client";

import dynamic from "next/dynamic";

const ProductList = dynamic(() => import("./ProductList"), {
  ssr: false,
  loading: () => (
    <ul className="animated-list flex snap-x snap-mandatory grid-cols-2 flex-nowrap gap-5 overflow-x-scroll md:grid md:overflow-auto">
      {Array.from({ length: 2 }).map((_, index) => (
        <li
          key={index}
          className="col-span-1 min-w-72 snap-start transition-opacity"
        >
          <div className="space-y-4 no-underline">
            <div className="bg-secondary aspect-video animate-pulse overflow-hidden rounded-md" />
            <div className="flex flex-row items-center justify-between gap-1">
              <div className="bg-secondary h-6 w-1/2 animate-pulse rounded" />
              <div className="bg-secondary h-6 w-12 animate-pulse rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  ),
});

export default function ProductListClient() {
  return <ProductList />;
}
