import React from "react";
import Image from "next/image";

type UniversalImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
};

const UniversalImage: React.FC<UniversalImageProps> = ({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  fetchPriority,
  sizes,
  className,
  objectFit = "cover",
  objectPosition = "center",
}) => {
  if (!src) {
    return (
      <div
        className={`bg-secondary flex items-center justify-center ${className}`}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      fetchPriority={fetchPriority}
      sizes={sizes}
      className={className}
      style={{
        objectFit,
        objectPosition,
      }}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
      loading={priority ? undefined : "lazy"}
    />
  );
};

export default UniversalImage;
