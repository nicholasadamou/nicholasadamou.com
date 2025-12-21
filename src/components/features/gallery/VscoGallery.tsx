"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useInfiniteVscoGallery } from "@/hooks/useInfiniteVscoGallery";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { VscoImage } from "@/types/vsco";
import { Button } from "@/components/ui/button";
import Link from "@/components/common/ui/Link";

interface LightboxProps {
  images: VscoImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...({
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm",
        } as any)}
        onClick={onClose}
      >
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/10 p-0 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute left-4 top-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-10 rounded-full bg-white/10 px-4 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <a
              href={currentImage.vsco_url || "https://vsco.co/nicholasadamou"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on VSCO
            </a>
          </Button>
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 p-0 text-white backdrop-blur-sm hover:bg-white/20"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 p-0 text-white backdrop-blur-sm hover:bg-white/20"
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          {...({
            className: "relative max-h-[90vh] max-w-[90vw]",
          } as any)}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || `Photo ${currentIndex + 1}`}
            width={800}
            height={800}
            className="max-h-[90vh] w-auto rounded-lg object-contain"
            priority
          />
        </motion.div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-1 rounded-full bg-white/10 px-3 py-2 backdrop-blur-sm">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function VscoGallery() {
  const { images, loading, error, hasMore, loadMore, totalCount } =
    useInfiniteVscoGallery({
      pageSize: 12,
    });

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  // Load more when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  if (loading && images.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg">
            <div className="bg-secondary aspect-square w-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="border-secondary flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="bg-secondary mb-4 rounded-full p-3">
          <X className="text-tertiary h-6 w-6" />
        </div>
        <h3 className="text-primary mb-2 text-lg font-semibold">
          Unable to load gallery
        </h3>
        <p className="text-secondary mb-4 text-sm">
          {error.message || "Something went wrong while loading the photos."}
        </p>
        <Button variant="outline" asChild>
          <a
            href="https://vsco.co/nicholasadamou"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on VSCO
          </a>
        </Button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="border-secondary flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="bg-secondary mb-4 rounded-full p-3">
          <ExternalLink className="text-tertiary h-6 w-6" />
        </div>
        <h3 className="text-primary mb-2 text-lg font-semibold">
          No photos found
        </h3>
        <p className="text-secondary mb-4 text-sm">
          Check back later for new photography updates.
        </p>
        <Button variant="outline" asChild>
          <a
            href="https://vsco.co/nicholasadamou"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on VSCO
          </a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Gallery Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
              {...({
                className:
                  "group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-secondary",
              } as any)}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={`${image.url}?w=400&h=400&fit=crop`}
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

        {/* Load More Trigger & Loading State */}
        {hasMore && (
          <div
            ref={elementRef as React.RefObject<HTMLDivElement>}
            className="flex flex-col items-center gap-4 py-8"
          >
            {loading && (
              <div className="text-secondary flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more photos...</span>
              </div>
            )}

            {/* Manual Load More Button (fallback) */}
            {!loading && (
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
                className="mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Photos"
                )}
              </Button>
            )}
          </div>
        )}

        {/* Gallery Stats */}
        {totalCount > 0 && (
          <div className="text-secondary text-center text-sm">
            Showing {images.length} of {totalCount} photos
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onNext={() =>
            setSelectedImageIndex((prev) =>
              prev !== null && prev < images.length - 1 ? prev + 1 : prev
            )
          }
          onPrev={() =>
            setSelectedImageIndex((prev) =>
              prev !== null && prev > 0 ? prev - 1 : prev
            )
          }
        />
      )}

      {/* VSCO Link */}
      <div className="mt-8 flex justify-center">
        <Button variant="outline" asChild>
          <a
            href="https://vsco.co/nicholasadamou"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on VSCO
          </a>
        </Button>
      </div>
    </>
  );
}
