/**
 * Animation configuration for performance and accessibility
 * This file contains utilities to optimize animations based on user preferences
 * and device capabilities.
 */

// Check if user prefers reduced motion
export const useReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Check if device has low performance indicators
export const isLowPerformanceDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check for indicators of low performance devices
  const connection = (navigator as any)?.connection;
  const hardwareConcurrency = navigator?.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any)?.deviceMemory;

  // Low performance indicators
  const hasSlowConnection =
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g";
  const hasLowCores = hardwareConcurrency <= 2;
  const hasLowMemory = deviceMemory && deviceMemory <= 2;

  return hasSlowConnection || hasLowCores || hasLowMemory;
};

// Animation configuration based on performance and preferences
export const getAnimationConfig = () => {
  const reduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const lowPerformance = isLowPerformanceDevice();

  // Disable most animations for reduced motion
  if (reduceMotion) {
    return {
      enableAnimations: false,
      enableStagger: false,
      enableHover: false,
      enableTransitions: true, // Keep basic transitions for accessibility
      duration: {
        fast: 0.1,
        normal: 0.1,
        slow: 0.15,
        slower: 0.2,
      },
      staggerDelay: 0,
    };
  }

  // Reduce complex animations for low performance devices
  if (lowPerformance) {
    return {
      enableAnimations: true,
      enableStagger: false, // Disable staggered animations
      enableHover: false, // Disable hover animations
      enableTransitions: true,
      duration: {
        fast: 0.15,
        normal: 0.2,
        slow: 0.3,
        slower: 0.4,
      },
      staggerDelay: 0,
    };
  }

  // Full animations for capable devices
  return {
    enableAnimations: true,
    enableStagger: true,
    enableHover: true,
    enableTransitions: true,
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      slower: 0.8,
    },
    staggerDelay: 0.1,
  };
};

// Conditionally apply animation variants
export const conditionalVariants = (variants: any, fallback: any = {}) => {
  const config = getAnimationConfig();
  return config.enableAnimations ? variants : fallback;
};

// Performance-aware stagger delay
export const performantStaggerDelay = (
  index: number,
  baseDelay: number = 0.1
): number => {
  const config = getAnimationConfig();
  if (!config.enableStagger) return 0;

  return baseDelay * index;
};

// Performance-aware hover variants
export const performantHoverVariants = (hoverVariants: any) => {
  const config = getAnimationConfig();
  return config.enableHover ? hoverVariants : {};
};

// Animation settings based on media queries
export const getResponsiveAnimationSettings = () => {
  if (typeof window === "undefined") {
    return { enableComplexAnimations: true };
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const isTablet = window.matchMedia("(max-width: 1024px)").matches;
  const hasTouchScreen = "ontouchstart" in window;

  return {
    enableComplexAnimations: !isMobile, // Disable complex animations on mobile
    enableParallax: !hasTouchScreen, // Disable parallax on touch devices
    enableHeavyAnimations: !isMobile && !isTablet,
    reducedStagger: isMobile,
  };
};

// Intersection Observer configuration for performance
export const getIntersectionObserverConfig = () => {
  return {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: "50px 0px", // Start animation 50px before element enters viewport
  };
};

// Animation optimization utilities
export const optimizeAnimationProps = (props: any) => {
  const config = getAnimationConfig();

  if (!config.enableAnimations) {
    // Return minimal props for reduced motion
    return {
      initial: false,
      animate: false,
      transition: { duration: 0 },
    };
  }

  return {
    ...props,
    transition: {
      ...props.transition,
      duration: props.transition?.duration || config.duration.normal,
    },
  };
};

// Debounce animations during rapid state changes
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Preload animation resources
export const preloadAnimationResources = () => {
  // Force browser to prepare for animations
  if (typeof document !== "undefined") {
    const testElement = document.createElement("div");
    testElement.style.transform = "translateZ(0)";
    testElement.style.backfaceVisibility = "hidden";
    testElement.style.perspective = "1000px";
    document.body.appendChild(testElement);
    document.body.removeChild(testElement);
  }
};

// Monitor performance and adjust animations
export const monitorAnimationPerformance = () => {
  if (typeof window === "undefined") return;

  let frameCount = 0;
  let lastTime = performance.now();

  const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      // If FPS drops below 30, consider reducing animations
      if (fps < 30) {
        console.warn(
          "Low FPS detected:",
          fps,
          "- Consider reducing animations"
        );
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);
};
