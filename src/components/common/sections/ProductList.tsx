"use client";

import Image from "next/image";
import Link from "@/components/common/ui/Link";
import Halo from "@/components/common/effects/Halo";
import useGumroadProducts from "@/hooks/data/use-gumroad-products";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  description: string;
  formatted_price: string;
  short_url: string;
  thumbnail_url: string;
}

export default function ProductList() {
  const { products, loading, error } = useGumroadProducts();

  if (loading) {
    return (
      <ul className="animated-list grid grid-cols-1 gap-8 md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className="group transition-opacity">
            <div className="space-y-4">
              <div className="bg-secondary aspect-video overflow-hidden rounded-xl">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <ul className="animated-list grid grid-cols-1 gap-8 md:grid-cols-2">
      {products.slice(0, 3).map((product: Product) => (
        <li key={product.id} className="group transition-opacity">
          <Link
            href={product.short_url}
            className="block space-y-4 no-underline"
          >
            <div className="bg-secondary aspect-video overflow-hidden rounded-xl">
              <Halo strength={10}>
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover object-left-top transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </Halo>
            </div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-primary font-semibold leading-tight transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {product.name}
              </h3>
              <span className="text-tertiary text-sm font-medium no-underline">
                {product.formatted_price}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
