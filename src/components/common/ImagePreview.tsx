"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import UniversalImage from "./UniversalImage";

interface ImagePreviewProps {
  src: string | null | undefined;
  alt: string;
  children: React.ReactNode;
  className?: string;
}

export default function ImagePreview({
  src,
  alt,
  children,
  className = "",
}: ImagePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (src) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Set a slight delay before showing the preview
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, 300); // 300ms delay
    }
  }, [src]);

  const handleMouseLeave = useCallback(() => {
    // Clear timeout if mouse leaves before preview shows
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !src) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const previewWidth = 256; // w-64 = 256px
    const previewHeight = 144; // aspect-video of w-64 = 144px

    let x = e.clientX + 20;
    let y = e.clientY - 100;

    // Adjust x position if preview would go off-screen to the right
    if (e.clientX + previewWidth + 20 > viewportWidth) {
      x = e.clientX - previewWidth - 20;
    }

    // Adjust y position if preview would go off-screen at the top
    if (e.clientY - previewHeight - 100 < 0) {
      y = e.clientY + 20;
    }

    // Adjust y position if preview would go off-screen at the bottom
    if (e.clientY + previewHeight + 20 > viewportHeight) {
      y = e.clientY - previewHeight - 20;
    }

    setMousePosition({ x, y });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Don't render preview if no image source
  if (!src) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="pointer-events-none fixed z-50"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                }}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <div className="bg-background relative overflow-hidden rounded-lg shadow-lg">
                  <div className="aspect-video w-64">
                    <UniversalImage
                      src={src}
                      alt={alt}
                      fill
                      sizes="256px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
