"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, ExternalLink } from "lucide-react";
import { useVscoGallery } from "@/hooks/useVscoGallery";
import Link from "@/components/common/Link";
import { Button } from "@/components/ui/button";

export default function FeaturedGallery() {
  const { data, loading, error } = useVscoGallery({ limit: 4 });

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-secondary aspect-square animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (error || !data || data.images.length === 0) {
    return (
      <div className="border-secondary flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="bg-secondary mb-3 rounded-full p-2">
          <Camera className="text-tertiary h-5 w-5" />
        </div>
        <p className="text-secondary mb-3 text-sm">
          Unable to load recent photos
        </p>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://vsco.co/nicholasadamou"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            View on VSCO
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {data.images.slice(0, 4).map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          {...({
            className:
              "group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-secondary",
          } as any)}
          onClick={() =>
            window.open(
              image.vsco_url || `https://vsco.co/nicholasadamou`,
              "_blank"
            )
          }
        >
          <Image
            src={`${image.url}?w=200&h=200&fit=crop`}
            alt={image.alt || `Photo ${index + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
              <ExternalLink className="h-3 w-3 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
