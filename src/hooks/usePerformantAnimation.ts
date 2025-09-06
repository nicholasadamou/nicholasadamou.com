import { useEffect, useState, useMemo } from "react";
import {
  getAnimationConfig,
  getResponsiveAnimationSettings,
  isLowPerformanceDevice,
  performantStaggerDelay,
  conditionalVariants,
} from "@/lib/animation-config";

/**
 * Hook for performance-aware animations
 * Automatically adapts animation behavior based on user preferences and device capabilities
 */
export const usePerformantAnimation = () => {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState(() => getAnimationConfig());
  const [responsive, setResponsive] = useState(() =>
    getResponsiveAnimationSettings()
  );

  useEffect(() => {
    setMounted(true);

    // Update config on mount to get accurate readings
    setConfig(getAnimationConfig());
    setResponsive(getResponsiveAnimationSettings());

    // Listen for media query changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = () => {
      setConfig(getAnimationConfig());
      setResponsive(getResponsiveAnimationSettings());
    };

    mediaQuery.addEventListener("change", handleChange);
    mobileQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      mobileQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Memoized values to prevent unnecessary re-renders
  const animationSettings = useMemo(
    () => ({
      ...config,
      ...responsive,
      mounted,
    }),
    [config, responsive, mounted]
  );

  return animationSettings;
};

/**
 * Hook for adaptive animation variants
 * Returns optimized variants based on device capabilities
 */
export const useAdaptiveVariants = (
  variants: any,
  fallbackVariants: any = {}
) => {
  const { enableAnimations } = usePerformantAnimation();

  return useMemo(() => {
    return conditionalVariants(variants, fallbackVariants);
  }, [variants, fallbackVariants]);
};

/**
 * Hook for performance-aware staggered animations
 * Automatically adjusts stagger delays based on device performance
 */
export const useStaggeredAnimation = (
  itemCount: number,
  baseDelay: number = 0.1
) => {
  const { enableStagger, reducedStagger } = usePerformantAnimation();

  return useMemo(() => {
    if (!enableStagger) return Array(itemCount).fill(0);

    const adjustedDelay = reducedStagger ? baseDelay * 0.5 : baseDelay;
    return Array.from({ length: itemCount }, (_, index) =>
      performantStaggerDelay(index, adjustedDelay)
    );
  }, [itemCount, baseDelay, enableStagger, reducedStagger]);
};

/**
 * Hook for conditional hover animations
 * Only enables hover animations on devices that support them well
 */
export const useHoverAnimation = (hoverVariants: any) => {
  const { enableHover } = usePerformantAnimation();

  return useMemo(() => {
    return enableHover ? hoverVariants : {};
  }, [hoverVariants, enableHover]);
};

/**
 * Hook for adaptive animation duration
 * Adjusts animation duration based on performance
 */
export const useAnimationDuration = () => {
  const { duration } = usePerformantAnimation();

  return duration;
};

/**
 * Hook for intersection observer with performance optimization
 * Used for triggering animations when elements come into view
 */
export const useInViewAnimation = (threshold: number = 0.1) => {
  const [inView, setInView] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);
  const { enableAnimations } = usePerformantAnimation();

  useEffect(() => {
    if (!ref || !enableAnimations) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Unobserve after first intersection for performance
          observer.unobserve(ref);
        }
      },
      {
        threshold,
        rootMargin: "50px 0px", // Trigger animation before element is fully visible
      }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold, enableAnimations]);

  return { ref: setRef, inView: enableAnimations ? inView : true };
};

/**
 * Hook for debounced animations
 * Prevents animation spam during rapid state changes
 */
export const useDebouncedAnimation = (value: any, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for scroll-based animations with performance optimization
 */
export const useScrollAnimation = (threshold: number = 50) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const { enableComplexAnimations } = usePerformantAnimation();

  useEffect(() => {
    if (!enableComplexAnimations) return;

    let ticking = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          setIsScrolling(true);
          ticking = false;

          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
          }, 150);
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [enableComplexAnimations]);

  return { scrollY, isScrolling };
};
