import { useEffect, useState, RefObject } from "react";

interface MousePosition {
  x: number | null;
  y: number | null;
}

const useMousePosition = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>
): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
          x: ev.clientX - rect.left,
          y: ev.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [ref]);

  return mousePosition;
};

export default useMousePosition;
