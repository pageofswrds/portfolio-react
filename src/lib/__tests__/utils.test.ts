import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toContain("px-4");
    expect(result).toContain("py-1");
  });

  it("should handle conditional classes", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toContain("base");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("should handle undefined and null", () => {
    const result = cn("base", undefined, null, "extra");
    expect(result).toContain("base");
    expect(result).toContain("extra");
  });
});
