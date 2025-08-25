import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils/utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2 py-1", "px-3")).toBe("py-1 px-3");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "conditional", false && "not-included")).toBe(
      "base conditional"
    );
  });

  it("should handle arrays of classes", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
  });

  it("should handle undefined and null values", () => {
    expect(cn("valid", undefined, null, "also-valid")).toBe("valid also-valid");
  });

  it("should merge conflicting Tailwind classes correctly", () => {
    // twMerge should keep the last conflicting class
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-4", "px-2")).toBe("p-4 px-2");
  });

  it("should handle empty input", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });

  it("should handle complex conditional logic", () => {
    const isActive = true;
    const isDisabled = false;
    const size = "lg";

    expect(
      cn(
        "btn",
        isActive && "active",
        isDisabled && "disabled",
        size === "lg" && "btn-lg"
      )
    ).toBe("btn active btn-lg");
  });
});
