"use client";

import { ArrowUpRight } from "lucide-react";
import useGumroadProducts from "@/hooks/use-gumroad-products";

interface GumroadSectionProps {
  light: boolean;
  opacityClass: string;
  linkColorClass: string;
}

export default function GumroadSection({
  light,
  opacityClass,
  linkColorClass,
}: GumroadSectionProps) {
  const { products, loading, error } = useGumroadProducts();

  if (error) return null;

  const cardBg = light ? "bg-stone-950/[0.03]" : "bg-white/[0.04]";
  const shimmer = light ? "bg-stone-950/[0.06]" : "bg-white/[0.08]";

  return (
    <div className="space-y-4 sm:space-y-3">
      <h2 className={`${opacityClass} text-sm`}>Products</h2>
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className={`rounded-lg p-3 ${cardBg}`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 animate-pulse rounded-md ${shimmer}`}
                  />
                  <div className="flex-1 space-y-1.5">
                    <div
                      className={`h-3.5 w-2/3 animate-pulse rounded ${shimmer}`}
                    />
                    <div
                      className={`h-3 w-1/3 animate-pulse rounded ${shimmer}`}
                    />
                  </div>
                </div>
              </div>
            ))
          : products.slice(0, 3).map((product) => (
              <a
                key={product.id}
                href={product.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 rounded-lg p-2 transition-opacity hover:opacity-60 ${cardBg}`}
              >
                {product.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium !leading-snug ${linkColorClass}`}
                  >
                    {product.name}
                  </p>
                  <p className={`text-xs ${opacityClass}`}>
                    {product.formatted_price}
                  </p>
                </div>
              </a>
            ))}
        <a
          href="https://nicholasadamou.gumroad.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-60 ${opacityClass}`}
        >
          View all products
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
