"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useVscoGallery } from "@/hooks/use-vsco-gallery";
import { useTheme } from "@/components/ThemeProvider";

export default function FeaturedGallery() {
  const { data, loading, error } = useVscoGallery({ limit: 4 });
  const { shouldUseDarkText, getOpacityClass } = useTheme();
  const light = shouldUseDarkText();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square animate-pulse rounded-lg ${light ? "bg-stone-950/5" : "bg-white/5"}`}
          />
        ))}
      </div>
    );
  }

  if (error || !data || data.images.length === 0) {
    return (
      <p className={`text-sm ${getOpacityClass()}`}>
        Unable to load recent photos.{" "}
        <a
          href="https://vsco.co/nicholasadamou"
          target="_blank"
          className="underline"
        >
          View on VSCO
        </a>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {data.images.slice(0, 4).map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg ${light ? "bg-stone-950/5" : "bg-white/5"}`}
          onClick={() =>
            window.open(
              image.vsco_url || "https://vsco.co/nicholasadamou",
              "_blank"
            )
          }
        >
          <Image
            src={image.url}
            alt={image.alt || `Photo ${index + 1}`}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 45vw, 120px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-1.5 right-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-white/20 p-1 backdrop-blur-sm">
              <ExternalLink className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
