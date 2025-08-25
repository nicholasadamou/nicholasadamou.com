import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  formatShortDate,
  formatLongDateWithSuffix,
} from "@/lib/utils/formatShortDate";

describe("formatShortDate", () => {
  it("should format date to short format", () => {
    const result = formatShortDate("2024-01-15");
    expect(result).toBe("Jan 15, 2024");
  });

  it("should handle different months", () => {
    expect(formatShortDate("2024-12-25")).toBe("Dec 25, 2024");
    expect(formatShortDate("2024-06-01")).toBe("Jun 01, 2024");
  });

  it("should handle ISO string format", () => {
    const result = formatShortDate("2024-01-15T10:30:00.000Z");
    expect(result).toBe("Jan 15, 2024");
  });
});

describe("formatLongDateWithSuffix", () => {
  it("should format date with 'st' suffix", () => {
    const result = formatLongDateWithSuffix("2024-01-01");
    expect(result).toBe("January 1st, 2024");
  });

  it("should format date with 'nd' suffix", () => {
    const result = formatLongDateWithSuffix("2024-01-02");
    expect(result).toBe("January 2nd, 2024");
  });

  it("should format date with 'rd' suffix", () => {
    const result = formatLongDateWithSuffix("2024-01-03");
    expect(result).toBe("January 3rd, 2024");
  });

  it("should format date with 'th' suffix for 4-20", () => {
    expect(formatLongDateWithSuffix("2024-01-04")).toBe("January 4th, 2024");
    expect(formatLongDateWithSuffix("2024-01-11")).toBe("January 11th, 2024");
    expect(formatLongDateWithSuffix("2024-01-15")).toBe("January 15th, 2024");
    expect(formatLongDateWithSuffix("2024-01-20")).toBe("January 20th, 2024");
  });

  it("should format date with correct suffix for 21st, 22nd, 23rd", () => {
    expect(formatLongDateWithSuffix("2024-01-21")).toBe("January 21st, 2024");
    expect(formatLongDateWithSuffix("2024-01-22")).toBe("January 22nd, 2024");
    expect(formatLongDateWithSuffix("2024-01-23")).toBe("January 23rd, 2024");
  });

  it("should format date with 'th' suffix for 24-30", () => {
    expect(formatLongDateWithSuffix("2024-01-24")).toBe("January 24th, 2024");
    expect(formatLongDateWithSuffix("2024-01-30")).toBe("January 30th, 2024");
  });

  it("should format date with correct suffix for 31st", () => {
    expect(formatLongDateWithSuffix("2024-01-31")).toBe("January 31st, 2024");
  });

  it("should handle different months", () => {
    expect(formatLongDateWithSuffix("2024-12-25")).toBe("December 25th, 2024");
    expect(formatLongDateWithSuffix("2024-06-02")).toBe("June 2nd, 2024");
  });
});
