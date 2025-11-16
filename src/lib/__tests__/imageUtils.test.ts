import { describe, it, expect } from "vitest";
import { shouldSkipOptimization } from "../imageUtils";

describe("shouldSkipOptimization", () => {
  it("should skip optimization for Vercel blob URLs", () => {
    const result = shouldSkipOptimization(
      "https://example.public.blob.vercel-storage.com/image.png"
    );
    expect(result).toBe(true);
  });

  it("should skip optimization for AWS S3 URLs", () => {
    const result = shouldSkipOptimization(
      "https://s3.amazonaws.com/bucket/image.png"
    );
    expect(result).toBe(true);
  });

  it("should not skip optimization for regular URLs", () => {
    const result = shouldSkipOptimization("https://example.com/image.png");
    expect(result).toBe(false);
  });

  it("should handle empty strings", () => {
    const result = shouldSkipOptimization("");
    expect(result).toBe(false);
  });
});
