"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import VscoGallery from "@/components/features/gallery/VscoGallery";
import VscoGallerySkeleton from "@/components/features/gallery/VscoGallerySkeleton";

export default function GalleryPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      {...({
        className: "mx-auto flex max-w-4xl flex-col gap-2 px-4",
      } as any)}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-primary text-3xl font-bold leading-tight tracking-tight">
          Gallery
        </h1>
        <p className="text-secondary max-w-xl">
          A curated collection of my photography work, showcasing moments and
          perspectives through the lens.
        </p>
      </div>
      <Suspense fallback={<VscoGallerySkeleton />}>
        <VscoGallery />
      </Suspense>
    </motion.div>
  );
}
