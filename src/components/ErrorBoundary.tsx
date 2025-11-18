"use client";

import React, { Component, ReactNode, ErrorInfo } from "react";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch errors in child components
 * Useful for MDX rendering and other potentially error-prone components
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to error reporting service
    logger.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="my-8 rounded-lg border border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
            <h2 className="font-semibold mb-2 text-lg text-red-800 dark:text-red-200">
              Something went wrong
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300">
              {this.state.error?.message ||
                "An error occurred while rendering this content."}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * MDX-specific error boundary with customized fallback
 */
export function MDXErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="my-8 rounded-lg border border-yellow-300 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-950">
          <h2 className="font-semibold mb-2 text-lg text-yellow-800 dark:text-yellow-200">
            Content Rendering Error
          </h2>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            This content could not be displayed. Please check the MDX syntax or
            try refreshing the page.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
