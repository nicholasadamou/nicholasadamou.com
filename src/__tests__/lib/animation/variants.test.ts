import { describe, it, expect } from "vitest";
import {
  EASING,
  DURATION,
  filterVariants,
  buttonVariants,
  itemVariants,
  getStaggerDelay,
} from "@/lib/animation/variants";

describe("EASING", () => {
  it("has all easing curves", () => {
    expect(EASING.ease).toHaveLength(4);
    expect(EASING.easeIn).toHaveLength(4);
    expect(EASING.easeOut).toHaveLength(4);
    expect(EASING.easeInOut).toHaveLength(4);
    expect(EASING.bouncy).toHaveLength(4);
    expect(EASING.spring).toHaveLength(4);
  });
});

describe("DURATION", () => {
  it("has increasing durations", () => {
    expect(DURATION.fast).toBeLessThan(DURATION.normal);
    expect(DURATION.normal).toBeLessThan(DURATION.slow);
    expect(DURATION.slow).toBeLessThan(DURATION.slower);
  });
});

describe("variants", () => {
  it("filterVariants has hidden and visible states", () => {
    expect(filterVariants.hidden).toBeDefined();
    expect(filterVariants.visible).toBeDefined();
  });

  it("buttonVariants has initial, hover, tap states", () => {
    expect(buttonVariants.initial).toBeDefined();
    expect(buttonVariants.hover).toBeDefined();
    expect(buttonVariants.tap).toBeDefined();
  });

  it("itemVariants has hidden and visible states", () => {
    expect(itemVariants.hidden).toBeDefined();
    expect(itemVariants.visible).toBeDefined();
  });
});

describe("getStaggerDelay", () => {
  it("returns correct delay for index", () => {
    expect(getStaggerDelay(0)).toBe(0);
    expect(getStaggerDelay(1)).toBe(0.1);
    expect(getStaggerDelay(5)).toBeCloseTo(0.5);
  });

  it("supports custom base delay", () => {
    expect(getStaggerDelay(3, 0.2)).toBeCloseTo(0.6);
  });
});
