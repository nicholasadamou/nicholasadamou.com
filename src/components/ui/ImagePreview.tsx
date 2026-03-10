"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import UniversalImage from "@/components/ui/UniversalImage";

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
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onEnter = useCallback(() => {
    if (!src) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 300);
  }, [src]);

  const onLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!src) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = 256;
    const ph = 144;

    let x = e.clientX + 20;
    let y = e.clientY - 100;

    if (e.clientX + pw + 20 > vw) x = e.clientX - pw - 20;
    if (y < 0) y = e.clientY + 20;
    if (e.clientY + ph + 20 > vh) y = e.clientY - ph - 20;

    setPos({ x, y });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!src) return <div className={className}>{children}</div>;

  return (
    <>
      <div
        className={className}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
      >
        {children}
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50 overflow-hidden rounded-lg shadow-lg transition-all duration-200"
            style={{
              left: pos.x,
              top: pos.y,
              opacity: visible ? 1 : 0,
              transform: visible
                ? "scale(1) translateY(0)"
                : "scale(0.8) translateY(10px)",
            }}
          >
            <div className="relative aspect-video w-64">
              <UniversalImage
                src={src}
                alt={alt}
                fill
                sizes="256px"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
