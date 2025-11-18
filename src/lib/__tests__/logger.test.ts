import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "../logger";

describe("logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have log, warn, error, and debug methods", () => {
    expect(logger.log).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  it("should not throw when calling logger methods", () => {
    expect(() => {
      logger.log("test message");
      logger.warn("test warning");
      logger.error("test error");
      logger.debug("test debug");
    }).not.toThrow();
  });
});
