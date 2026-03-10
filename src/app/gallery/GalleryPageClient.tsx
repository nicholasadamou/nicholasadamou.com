"use client";

import VscoGallery from "@/components/gallery/VscoGallery";
import { useTheme } from "@/components/ThemeProvider";

export default function GalleryPageClient() {
  const { getTextColorClass, getOpacityClass, isHydrated } = useTheme();

  if (!isHydrated) {
    return <main className="min-h-screen" />;
  }

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-4xl px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <div className="animate-fadeInHome1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">Gallery</h1>
            <p className={`text-sm ${getOpacityClass()}`}>
              A curated collection of photography work.
            </p>
          </div>

          <div className="animate-fadeInHome2">
            <VscoGallery />
          </div>
        </div>
      </div>
    </main>
  );
}
