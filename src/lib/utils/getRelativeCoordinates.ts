import React from "react";

export const getRelativeCoordinates = (
  event: React.MouseEvent<HTMLUListElement>,
  referenceElement: HTMLElement | null
) => {
  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  if (!referenceElement) {
    // Handle the case where referenceElement is null
    return position; // or return { x: 0, y: 0 } or any default values
  }

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.clientTop,
    width: referenceElement.clientWidth,
    height: referenceElement.clientHeight,
  };

  let reference = referenceElement.offsetParent as HTMLElement | null;

  while (reference) {
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent as HTMLElement | null;
  }

  return {
    x: position.x - offset.left,
    y: position.y - offset.top,
  };
};
