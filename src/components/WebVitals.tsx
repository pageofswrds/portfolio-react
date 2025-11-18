"use client";

import { useReportWebVitals } from "next/web-vitals";
import { logger } from "@/lib/logger";

/**
 * Web Vitals monitoring component
 * Tracks Core Web Vitals (CLS, FID, FCP, LCP, TTFB) and Next.js specific metrics
 *
 * Metrics tracked:
 * - CLS: Cumulative Layout Shift
 * - FID: First Input Delay
 * - FCP: First Contentful Paint
 * - LCP: Largest Contentful Paint
 * - TTFB: Time to First Byte
 * - Next.js-hydration: Hydration time
 * - Next.js-route-change-to-render: Route change render time
 * - Next.js-render: Render time
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log Web Vitals in development for debugging
    logger.debug("Web Vital:", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });

    // In production, you would typically send these to an analytics endpoint
    // Example:
    // if (process.env.NODE_ENV === 'production') {
    //   const body = JSON.stringify(metric);
    //   const url = '/api/analytics';
    //
    //   if (navigator.sendBeacon) {
    //     navigator.sendBeacon(url, body);
    //   } else {
    //     fetch(url, { body, method: 'POST', keepalive: true });
    //   }
    // }
  });

  return null;
}
