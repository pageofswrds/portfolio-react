import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary, MDXErrorBoundary } from "../ErrorBoundary";
import { logger } from "@/lib/logger";

// Mock the logger
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>No error</div>;
}

describe("ErrorBoundary", () => {
  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test content")).toBeDefined();
  });

  it("should render default fallback UI when an error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeDefined();
    expect(screen.getByText("Test error message")).toBeDefined();
  });

  it("should render custom fallback when provided", () => {
    const customFallback = <div>Custom error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error UI")).toBeDefined();
  });

  it("should log error to logger when error is caught", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(logger.error).toHaveBeenCalled();
  });
});

describe("MDXErrorBoundary", () => {
  it("should render children when there is no error", () => {
    render(
      <MDXErrorBoundary>
        <div>MDX content</div>
      </MDXErrorBoundary>
    );

    expect(screen.getByText("MDX content")).toBeDefined();
  });

  it("should render MDX-specific fallback when error occurs", () => {
    render(
      <MDXErrorBoundary>
        <ThrowError shouldThrow={true} />
      </MDXErrorBoundary>
    );

    expect(screen.getByText("Content Rendering Error")).toBeDefined();
    expect(
      screen.getByText(
        "This content could not be displayed. Please check the MDX syntax or try refreshing the page."
      )
    ).toBeDefined();
  });
});
