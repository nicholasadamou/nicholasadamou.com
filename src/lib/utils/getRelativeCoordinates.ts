import React from "react";

export const getRelativeCoordinates = (
  event: React.MouseEvent<HTMLUListElement>,
  referenceElement: HTMLElement | null
) => {
  // Use clientX/clientY for viewport-relative coordinates instead of pageX/pageY
  // This is more reliable with fixed positioning and animated layouts
  const position = {
    x: event.clientX,
    y: event.clientY,
  };

  if (!referenceElement) {
    // Return viewport coordinates when no reference element
    return position;
  }

  // Use getBoundingClientRect for more accurate positioning with transforms
  const rect = referenceElement.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};
