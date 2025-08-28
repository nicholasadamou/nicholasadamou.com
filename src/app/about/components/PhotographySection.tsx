"use client";

import { Suspense } from "react";
import { ExternalLink } from "lucide-react";
import Section from "@/components/common/Section";
import Link from "@/components/common/Link";
import FeaturedGallery from "@/components/features/gallery/FeaturedGallery";
import { Button } from "@/components/ui/button";

export default function PhotographySection() {
  return (
    <Section heading="Photography" headingAlignment="left">
      <div className="flex flex-col gap-6">
        <p>
          Beyond software engineering, I have a passion for photography and
          visual storytelling. Through my lens, I capture moments that resonate
          with me - from landscapes to urban scenes, always seeking to find
          beauty in the everyday. You can explore my photographic work on{" "}
          <Link className="underline" href="https://vsco.co/nicholasadamou">
            VSCO
          </Link>
          , where I share my perspective on the world around us.
        </p>

        <div className="mt-4">
          <h4 className="mb-4 text-sm font-medium text-secondary">
            Recent Photos
          </h4>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-lg bg-secondary"
                  />
                ))}
              </div>
            }
          >
            <FeaturedGallery />
          </Suspense>
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gallery">View Gallery</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
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
      </div>
    </Section>
  );
}
