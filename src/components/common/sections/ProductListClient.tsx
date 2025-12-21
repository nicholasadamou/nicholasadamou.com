"use client";

import dynamic from "next/dynamic";

const ProductList = dynamic(() => import("./ProductList"), {
  ssr: false,
  loading: () => (
    <ul className="animated-list grid grid-cols-1 gap-8 md:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="group transition-opacity">
          <div className="space-y-4">
            <div className="bg-secondary aspect-video animate-pulse overflow-hidden rounded-xl" />
            <div className="flex items-center justify-between gap-3">
              <div className="bg-secondary h-6 w-2/3 animate-pulse rounded" />
              <div className="bg-secondary h-6 w-16 animate-pulse rounded" />
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
