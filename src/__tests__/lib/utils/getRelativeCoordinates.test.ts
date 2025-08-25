import { describe, it, expect } from "vitest";
import { getRelativeCoordinates } from "@/lib/utils/getRelativeCoordinates";

// Mock MouseEvent
const createMockMouseEvent = (pageX: number, pageY: number) =>
  ({
    pageX,
    pageY,
  }) as React.MouseEvent<HTMLUListElement>;

// Mock HTMLElement
const createMockElement = (
  offsetLeft: number,
  clientTop: number,
  clientWidth: number,
  clientHeight: number,
  offsetParent: HTMLElement | null = null,
  offsetTop: number = clientTop // Default offsetTop to clientTop for simplicity
) =>
  ({
    offsetLeft,
    offsetTop,
    clientTop,
    clientWidth,
    clientHeight,
    offsetParent,
  }) as HTMLElement;

describe("getRelativeCoordinates", () => {
  it("should return page coordinates when referenceElement is null", () => {
    const event = createMockMouseEvent(100, 200);
    const result = getRelativeCoordinates(event, null);

    expect(result).toEqual({
      x: 100,
      y: 200,
    });
  });

  it("should calculate relative coordinates correctly without offset parents", () => {
    const event = createMockMouseEvent(150, 250);
    const element = createMockElement(50, 30, 200, 100);

    const result = getRelativeCoordinates(event, element);

    expect(result).toEqual({
      x: 150 - 50, // pageX - offsetLeft
      y: 250 - 30, // pageY - clientTop
    });
  });

  it("should calculate relative coordinates with single offset parent", () => {
    const event = createMockMouseEvent(200, 300);
    const parentElement = createMockElement(25, 15, 300, 200);
    const element = createMockElement(50, 30, 200, 100, parentElement);

    const result = getRelativeCoordinates(event, element);

    expect(result).toEqual({
      x: 200 - (50 + 25), // pageX - (offsetLeft + parent.offsetLeft)
      y: 300 - (30 + 15), // pageY - (clientTop + parent.offsetTop)
    });
  });

  it("should calculate relative coordinates with multiple offset parents", () => {
    const event = createMockMouseEvent(300, 400);
    const grandparentElement = createMockElement(10, 5, 500, 400);
    const parentElement = createMockElement(
      25,
      15,
      300,
      200,
      grandparentElement
    );
    const element = createMockElement(50, 30, 200, 100, parentElement);

    const result = getRelativeCoordinates(event, element);

    expect(result).toEqual({
      x: 300 - (50 + 25 + 10), // pageX - sum of all offsetLeft values
      y: 400 - (30 + 15 + 5), // pageY - sum of all offsetTop values
    });
  });

  it("should handle zero coordinates", () => {
    const event = createMockMouseEvent(0, 0);
    const element = createMockElement(0, 0, 100, 100);

    const result = getRelativeCoordinates(event, element);

    expect(result).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("should handle negative relative coordinates", () => {
    const event = createMockMouseEvent(25, 35);
    const element = createMockElement(50, 60, 100, 100);

    const result = getRelativeCoordinates(event, element);

    expect(result).toEqual({
      x: -25, // 25 - 50
      y: -25, // 35 - 60
    });
  });
});
