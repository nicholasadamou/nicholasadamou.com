// Performance optimization utilities for Core Web Vitals

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  // Preload the main profile image
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = "/nicholas-adamou.jpeg";
  link.as = "image";
  document.head.appendChild(link);

  // Preload critical fonts
  const fontLink = document.createElement("link");
  fontLink.rel = "preload";
  fontLink.href = "/fonts/geist-sans.woff2";
  fontLink.as = "font";
  fontLink.type = "font/woff2";
  fontLink.crossOrigin = "anonymous";
  document.head.appendChild(fontLink);
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Report Core Web Vitals
 */
export function reportWebVitals() {
  if (typeof window !== "undefined") {
    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(console.log);
      onINP(console.log); // onFID is now onINP (Interaction to Next Paint)
      onFCP(console.log);
      onLCP(console.log);
      onTTFB(console.log);
    });
  }
}

/**
 * Optimize images for better performance
 */
export const IMAGE_OPTIMIZATION = {
  // Responsive image sizes for different breakpoints
  SIZES: {
    default: "100vw",
    sm: "(min-width: 640px) 50vw, 100vw",
    md: "(min-width: 768px) 33vw, 50vw",
    lg: "(min-width: 1024px) 25vw, 33vw",
  },

  // Quality settings for different use cases
  QUALITY: {
    hero: 90,
    gallery: 85,
    thumbnail: 75,
    placeholder: 20,
  },

  // Common image formats in order of preference
  FORMATS: ["avif", "webp", "jpg"] as const,
};

/**
 * Generate optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: {
    priority?: boolean;
    quality?: keyof typeof IMAGE_OPTIMIZATION.QUALITY;
    sizes?: keyof typeof IMAGE_OPTIMIZATION.SIZES;
    width?: number;
    height?: number;
  } = {}
) {
  const {
    priority = false,
    quality = "gallery",
    sizes = "default",
    width,
    height,
  } = options;

  return {
    src,
    alt,
    quality: IMAGE_OPTIMIZATION.QUALITY[quality],
    sizes: IMAGE_OPTIMIZATION.SIZES[sizes],
    priority,
    loading: priority ? undefined : ("lazy" as const),
    placeholder: "blur" as const,
    blurDataURL: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==`,
    ...(width && height && { width, height }),
  };
}
