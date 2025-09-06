/**
 * Represents the position of the mouse cursor.
 */
type MousePosition = {
  /** The horizontal coordinate (x-axis) */
  x: number;
  /** The vertical coordinate (y-axis) */
  y: number;
};

/**
 * Configuration options for calculating bounded position.
 */
type BoundedPositionOptions = {
  /** The current mouse cursor position */
  mousePosition: MousePosition;
  /** The width of the image in pixels */
  imageWidth: number;
  /** The height of the image in pixels */
  imageHeight: number;
  /** Additional offset distance from the mouse position in pixels */
  imageOffset: number;
};

/**
 * Calculates the bounded position for an image relative to the mouse cursor.
 *
 * This function positions an image above the mouse cursor, horizontally centered,
 * with the specified offset distance. It's commonly used for tooltips, previews,
 * or hover effects that need to be positioned relative to the mouse.
 *
 * @param options - The configuration options for position calculation
 * @param options.mousePosition - The current mouse cursor coordinates
 * @param options.imageWidth - The width of the image to be positioned (in pixels)
 * @param options.imageHeight - The height of the image to be positioned (in pixels)
 * @param options.imageOffset - Additional vertical offset from the mouse position (in pixels)
 *
 * @returns An object containing the calculated top and left CSS positioning values
 * @returns returns.top - The vertical position (mouse Y - image height - offset)
 * @returns returns.left - The horizontal position (mouse X - half image width for centering)
 *
 * @example
 * ```typescript
 * const position = getBoundedPosition({
 *   mousePosition: { x: 100, y: 200 },
 *   imageWidth: 50,
 *   imageHeight: 30,
 *   imageOffset: 10
 * });
 * // Returns: { top: 160, left: 75 }
 * ```
 */
export const getBoundedPosition = ({
  mousePosition,
  imageWidth,
  imageHeight,
  imageOffset,
}: BoundedPositionOptions): { top: number; left: number } => {
  // Calculate initial position
  let top = mousePosition.y - imageHeight - imageOffset;
  let left = mousePosition.x - imageWidth / 2;

  // Only apply viewport constraints if we're in the browser
  if (typeof window !== "undefined") {
    // Ensure the image stays within the viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 16; // Minimum padding from viewport edges

    // Constrain horizontal position
    if (left < padding) {
      left = padding;
    } else if (left + imageWidth > viewportWidth - padding) {
      left = viewportWidth - imageWidth - padding;
    }

    // Constrain vertical position
    if (top < padding) {
      // If image would go above viewport, show it below the mouse instead
      top = mousePosition.y + imageOffset;
    }

    if (top + imageHeight > viewportHeight - padding) {
      // If image would go below viewport, position it above the mouse
      top = mousePosition.y - imageHeight - imageOffset;
    }
  }

  return { top, left };
};
