import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const { triggerOnce = false, ...intersectionOptions } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;

        if (triggerOnce && hasTriggered) {
          return;
        }

        setIsIntersecting(isCurrentlyIntersecting);

        if (isCurrentlyIntersecting && triggerOnce) {
          setHasTriggered(true);
        }
      },
      {
        threshold: 0.1,
        ...intersectionOptions,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [triggerOnce, hasTriggered, intersectionOptions]);

  return { elementRef, isIntersecting };
}
