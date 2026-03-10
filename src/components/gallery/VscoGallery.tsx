"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useInfiniteVscoGallery } from "@/hooks/use-infinite-vsco-gallery";
import { useTheme } from "@/components/ThemeProvider";
import type { VscoImage } from "@/types/vsco";

function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onNav,
}: {
  images: VscoImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onNav: (index: number) => void;
}) {
  const current = images[currentIndex];

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNext();
      if (e.key === "ArrowLeft" && currentIndex > 0) onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, images.length, onClose, onNext, onPrev]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 cursor-pointer rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* VSCO link */}
      <a
        href={current.vsco_url || "https://vsco.co/nicholasadamou"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
      >
        <ExternalLink className="h-4 w-4" />
        View on VSCO
      </a>

      {/* Nav arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-black/70 disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-black/70 disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image */}
      <div onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.alt || `Photo ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        />
      </div>

      {/* Pagination dots */}
      {images.length > 1 && (
        <div
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, i) => {
            const dist = Math.abs(i - currentIndex);
            // Show at most 7 dots around the active one
            if (images.length > 9 && dist > 3) return null;
            const scale = dist <= 1 ? 1 : dist === 2 ? 0.75 : 0.5;
            return (
              <button
                key={i}
                onClick={() => onNav(i)}
                className="cursor-pointer p-0.5"
                aria-label={`Go to image ${i + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-200 ${
                    i === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
                  style={{
                    width: `${6 * scale}px`,
                    height: `${6 * scale}px`,
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>,
    document.body
  );
}

export default function VscoGallery() {
  const { images, loading, error, hasMore, loadMore, totalCount } =
    useInfiniteVscoGallery({ pageSize: 12 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { shouldUseDarkText, getOpacityClass, getLinkColorClass } = useTheme();
  const light = shouldUseDarkText();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const skeletonBg = light ? "bg-stone-950/5" : "bg-white/5";
  const borderDashed = light ? "border-stone-200" : "border-white/10";

  if (loading && images.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square animate-pulse rounded-lg ${skeletonBg}`}
          />
        ))}
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center ${borderDashed}`}
      >
        <p className={`mb-4 text-sm ${getOpacityClass()}`}>
          Unable to load gallery.
        </p>
        <a
          href="https://vsco.co/nicholasadamou"
          target="_blank"
          className={`text-sm underline ${getLinkColorClass()}`}
        >
          View on VSCO
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
              className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg ${skeletonBg}`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt || `Photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={index < 12 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load more sentinel */}
        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-8">
            <div className={`flex items-center gap-2 ${getOpacityClass()}`}>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading more photos...</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {totalCount > 0 && (
          <p className={`text-center text-sm ${getOpacityClass()}`}>
            Showing {images.length} of {totalCount} photos
          </p>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={() =>
            setSelectedIndex((prev) =>
              prev !== null && prev < images.length - 1 ? prev + 1 : prev
            )
          }
          onPrev={() =>
            setSelectedIndex((prev) =>
              prev !== null && prev > 0 ? prev - 1 : prev
            )
          }
          onNav={(i) => setSelectedIndex(i)}
        />
      )}
    </>
  );
}
